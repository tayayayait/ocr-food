import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Enhanced debugging version
serve(async (req) => {
  // 0. Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("------------------------------------------------------------------");
    console.log(`[analyze-meal] Request received: ${req.method} ${req.url}`);

    // 1. Parsing Body
    let body;
    try {
      body = await req.json();
      console.log(`[analyze-meal] Body parsed. analysisId: ${body.analysisId}`);
    } catch (e) {
      console.error(`[analyze-meal] Failed to parse body: ${e}`);
      throw new Error(`Invalid JSON body: ${e}`);
    }

    const { analysisId, imageUrl, mode = "full" } = body;
    if (mode === "full" && !imageUrl) {
      throw new Error("imageUrl is missing in request body");
    }

    // 2. Env Var Check
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    const isKeySet = !!GOOGLE_API_KEY;
    console.log(`[analyze-meal] GOOGLE_API_KEY configured: ${isKeySet} (Length: ${GOOGLE_API_KEY?.length})`);
    
    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not configured in Supabase Secrets");
    }

    // 3. Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 4. Update Stage
    if (mode === "full") {
        console.log(`[analyze-meal] Updating stage to 'ocr_processing' for ${analysisId}`);
        await supabase
        .from("meal_analyses")
        .update({ stage: "ocr_processing", progress: 30 })
        .eq("id", analysisId);

        // 5. Google API Call (OCR)
        console.log(`[analyze-meal] Calling Google Gemini API (OCR Step)...`);

        // Fetch image and convert to base64
        console.log(`[analyze-meal] Fetching image from: ${imageUrl}`);
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) throw new Error(`Failed to fetch image: ${imageResp.statusText}`);
    
    const imageBlob = await imageResp.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    const ocrPayload = {
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "system",
          content: `You are an OCR food menu extractor. Return ONLY a JSON array of objects with "text" and "confidence". Example: [{"text":"김치찌개","confidence":0.95}].`,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract menu items from this image." },
            { 
              type: "image_url", 
              image_url: { 
                url: `data:${imageBlob.type};base64,${base64Image}` 
              } 
            },
          ],
        },
      ],
    };
    
    // Log payload without tools first to test connection
    // console.log(`[analyze-meal] OCR Payload: ${JSON.stringify(ocrPayload).slice(0, 200)}...`);

    const ocrResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GOOGLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...ocrPayload,
        // Re-adding tools
        tools: [
          {
            type: "function",
            function: {
              name: "extract_menu_items",
              description: "Extract menu items from a food image",
              parameters: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        confidence: { type: "number" },
                      },
                      required: ["text", "confidence"],
                    },
                  },
                },
                required: ["items"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_menu_items" } },
      }),
    });

    console.log(`[analyze-meal] Google API Status: ${ocrResponse.status}`);
    
    if (!ocrResponse.ok) {
      const errText = await ocrResponse.text();
      console.error(`[analyze-meal] Google API Error Body: ${errText}`);
      throw new Error(`Google API Error (${ocrResponse.status}): ${errText}`);
    }

    const ocrData = await ocrResponse.json();
    console.log(`[analyze-meal] Google API Success. Checking tool calls...`);
    
    let menuItems: { text: string; confidence: number }[] = [];
    try {
      const toolCall = ocrData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        const parsed = JSON.parse(toolCall.function.arguments);
        menuItems = parsed.items || [];
      } else {
        // Fallback for content
        console.log(`[analyze-meal] No tool call found, checking content...`);
        const content = ocrData.choices?.[0]?.message?.content || "";
        const match = content.match(/\[.*\]/s);
        if (match) menuItems = JSON.parse(match[0]);
      }
      
      if (menuItems.length === 0) {
        console.warn(`[analyze-meal] No menu items found. Full API Response: ${JSON.stringify(ocrData).slice(0, 500)}`);
      }
    } catch (e) {
      console.error(`[analyze-meal] Parsing logic failed: ${e}`);
    }

    console.log(`[analyze-meal] Extracted ${menuItems.length} items: ${menuItems.map(m => m.text).join(", ")}`);

    // Insert OCR items
    if (menuItems.length > 0) {
      const ocrInserts = menuItems.map((item, idx) => ({
        analysis_id: analysisId,
        text: item.text,
        confidence: Math.min(1, Math.max(0, item.confidence)),
        sort_order: idx,
      }));
      await supabase.from("ocr_items").insert(ocrInserts);
    }
  } else if (mode === "analysis_only") {
      // Fetch existing OCR items
      console.log(`[analyze-meal] Mode: analysis_only. Fetching existing OCR items...`);
      const { data: existingItems, error } = await supabase
          .from("ocr_items")
          .select("text, corrected_text")
          .eq("analysis_id", analysisId)
          .order("sort_order");
      
      if (error) throw new Error(`Failed to fetch existing items: ${error.message}`);
      
      // Use corrected_text if available, otherwise text
      menuItems = (existingItems || []).map(item => ({
          text: item.corrected_text || item.text,
          confidence: 1.0 // Mock confidence for existing items
      }));
  }

    // Update to AI processing stage
    await supabase
      .from("meal_analyses")
      .update({ stage: "ai_processing", progress: 60 })
      .eq("id", analysisId);

    // Step 2: AI Analysis (Skipping detailed logging for brevity, assumed similar pattern)
    // For debugging, we'll return early success if OCR works to isolate the issue
    // OR we proceed with simpler logic. Let's proceed but wrap carefully.

    console.log(`[analyze-meal] Proceeding to Step 2 (Analysis)...`);
    const menuList = menuItems.map((m) => m.text).join(", ");
    
    // ... (rest of AI logic kept mostly same but ensure error propagation)
    // Re-using the same pattern for second call

    const aiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GOOGLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          model: "gemini-2.0-flash",
        messages: [
          {
            role: "system",
            content: `Analyze diet and dental care recommendations for: ${menuList}. Return JSON via tool 'extract_analysis'.
            IMPORTANT:
            1. All text content (label, title, reason, tags) MUST be in Korean.
            2. 'code' and 'priority' must be the exact English enum values.
            3. Provide practical, lengthy, and helpful advice.`,
          },
          { role: "user", content: "Analyze this menu and provide recommendations in Korean." }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_analysis",
              description: "Extract diet analysis in Korean",
              parameters: {
                type: "object",
                properties: {
                  keywords: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        code: { type: "string", enum: ["spicy", "salty", "oily", "sweet", "acidic"] },
                        label: { type: "string", description: "Korean label for the keyword (e.g., 맵고 짠)" },
                        score: { type: "number" },
                      },
                      required: ["code", "label", "score"],
                    },
                  },
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Title of recommendation in Korean" },
                        reason: { type: "string", description: "Detailed reason in Korean" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        tags: { type: "array", items: { type: "string", description: "Tag in Korean" } },
                      },
                      required: ["title", "reason", "priority", "tags"],
                    },
                  },
                },
                required: ["keywords", "recommendations"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_analysis" } },
      }),
    });

    if (!aiResponse.ok) {
       const errText = await aiResponse.text();
       throw new Error(`Google AI (Analysis) Error: ${errText}`);
    }
    
    const aiData = await aiResponse.json();
    let analysis = { keywords: [] as any[], recommendations: [] as any[] };
    try {
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall) analysis = JSON.parse(toolCall.function.arguments);
    } catch(e) { console.error(`[analyze-meal] AI parse error: ${e}`); }

    // Insert keywords
    if (analysis.keywords?.length > 0) {
      const kwInserts = analysis.keywords.map((kw: any) => ({
        analysis_id: analysisId,
        code: kw.code,
        label: kw.label,
        score: Math.min(100, Math.max(0, Math.round(kw.score))),
      }));
      await supabase.from("diet_keywords").insert(kwInserts);
    }

    // Insert recommendations
    if (analysis.recommendations?.length > 0) {
        const recInserts = analysis.recommendations.map((rec: any, idx: number) => ({
          analysis_id: analysisId,
          title: rec.title,
          reason: rec.reason,
          priority: rec.priority,
          tags: rec.tags || [],
          sort_order: idx,
        }));
        await supabase.from("care_recommendations").insert(recInserts);
    }

    await supabase
      .from("meal_analyses")
      .update({ stage: "done", progress: 100 })
      .eq("id", analysisId);

    console.log(`[analyze-meal] Success!`);
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e: any) {
    console.error(`[analyze-meal] FATAL ERROR: ${e.message}`);
    console.error(e.stack);
    
    // Try to update DB to failed if we have analysisId
    // Note: analysisId might be undefined if parse failed
    
    return new Response(
      JSON.stringify({ error: e.message, stack: e.stack }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
