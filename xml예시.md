```xml
<?xml version="1.0" encoding="UTF-8"?>
<ocr_food_uiux_spec id="ocr-food-mvp-uiux-spec" version="1.0" doc_date="2026-02-12" locale="ko-KR" source="상세서.md">
  <title>OCR Food MVP UI/UX 상세 명세서</title>
  <metadata>
    <fields>
      <field index="1" key="document_name" label="문서명">OCR Food MVP UI/UX 상세 명세서</field>
      <field index="2" key="version" label="버전">v1.0</field>
      <field index="3" key="created_date" label="작성일">2026-02-12</field>
      <field index="4" key="audience" label="대상">기획, 프로덕트 디자이너, 프론트엔드 개발자, 백엔드 개발자, QA</field>
      <field index="5" key="scope" label="적용 범위">사용자 웹(MO/PC), 관리자 페이지(MO/PC)</field>
      <field index="6" key="base_stack" label="기준 스택">React + Tailwind CSS</field>
      <field index="7" key="theme_policy" label="테마 정책">라이트 모드 전용(MVP), 다크 모드 제외</field>
      <field index="8" key="design_tone" label="디자인 톤">클린 헬스케어, 민트+블루 컬러 축</field>
    </fields>
  </metadata>
  <sections>
    <section id="sec-0" order="0" label="문서 목적 및 사용 규칙">
      <subsection id="sec-0-sub-1" order="0.1" label="목적">
        <content>
          <unordered_list>
            <item>본 문서는 개발/디자인이 동일 기준으로 즉시 구현 가능한 UI/UX 규칙을 정의한다.</item>
            <item>본 문서는 화면 시안이 아닌 구현 명세다. 수치와 상태 정의가 우선한다.</item>
          </unordered_list>
        </content>
      </subsection>
      <subsection id="sec-0-sub-2" order="0.2" label="사용 규칙">
        <content>
          <unordered_list>
            <item>모든 핵심 컴포넌트와 화면은 아래 6요소를 동일하게 따른다.</item>
          </unordered_list>
          <ordered_list>
            <item index="1">원칙</item>
            <item index="2">수치</item>
            <item index="3">상태</item>
            <item index="4">예외</item>
            <item index="5">접근성</item>
            <item index="6">테스트 기준</item>
          </ordered_list>
        </content>
      </subsection>
      <subsection id="sec-0-sub-3" order="0.3" label="표기 규칙">
        <content>
          <unordered_list>
            <item>길이 단위: `px (rem)` 병기</item>
            <item>색상: `HEX + 토큰명` 병기</item>
            <item>텍스트 스타일: `font-size/line-height/font-weight` 병기</item>
            <item>인터랙션 시간: `ms` 단위</item>
          </unordered_list>
        </content>
      </subsection>
    </section>
    <section id="sec-1" order="1" label="제품 UX 원칙">
      <subsection id="sec-1-1" order="1.1" label="핵심 가치">
        <content>
          <ordered_list>
            <item index="1">빠른 인식: 업로드 후 사용자에게 단계별 처리 상태를 즉시 보여준다.</item>
            <item index="2">수정 가능한 신뢰: OCR 결과는 사용자가 직접 수정 가능해야 한다.</item>
            <item index="3">행동 유도: 분석 결과는 반드시 구강케어 행동 CTA로 연결되어야 한다.</item>
            <item index="4">운영 가시성: 관리자 화면에서 오류 원인과 처리 상태를 추적 가능해야 한다.</item>
          </ordered_list>
        </content>
      </subsection>
      <subsection id="sec-1-2" order="1.2" label="KPI 및 UI 반영 기준">
        <content>
          <table>
            <columns>
              <column index="1">KPI 항목</column>
              <column index="2">목표</column>
              <column index="3">UI 반영 기준</column>
            </columns>
            <rows>
              <row index="1">
                <cell column="1">처리 단계 가시성</cell>
                <cell column="2">100%</cell>
                <cell column="3">`업로드 -&gt; OCR -&gt; AI` 단계 로딩 UI를 항상 노출</cell>
              </row>
              <row index="2">
                <cell column="1">오류 복구 접근성</cell>
                <cell column="2">2클릭 이내</cell>
                <cell column="3">오류 메시지에 `재시도` 또는 `수정 후 재분석` 버튼 고정</cell>
              </row>
              <row index="3">
                <cell column="1">상태 피드백 시작 시간</cell>
                <cell column="2">300ms 이내</cell>
                <cell column="3">업로드 즉시 진행 표시(스켈레톤/프로그레스) 표시</cell>
              </row>
              <row index="4">
                <cell column="1">장기 처리 안내</cell>
                <cell column="2">3초/8초 임계</cell>
                <cell column="3">3초 보조 문구, 8초 백그라운드 처리 안내 노출</cell>
              </row>
            </rows>
          </table>
        </content>
      </subsection>
      <subsection id="sec-1-3" order="1.3" label="마이크로카피(문장 톤) 규칙">
        <content>
          <unordered_list>
            <item>문장은 짧고 명확하게 작성한다.</item>
            <item>명령형 문장 남용을 금지한다.</item>
            <item>실패 시 `원인 + 다음 행동`을 반드시 함께 제시한다.</item>
          </unordered_list>
          <paragraph>예시:</paragraph>
          <unordered_list>
            <item>권장: `텍스트 인식이 일부 실패했습니다. 메뉴명을 수정한 뒤 다시 분석해 주세요.`</item>
            <item>비권장: `인식 실패. 다시 하세요.`</item>
          </unordered_list>
        </content>
      </subsection>
    </section>
    <section id="sec-2" order="2" label="정보 구조(IA) 및 사용자 플로우">
      <subsection id="sec-2-1" order="2.1" label="IA">
        <subsection id="sec-2-1-sub-1" order="2.1.1" label="사용자 IA">
          <content>
            <ordered_list>
              <item index="1">홈/업로드</item>
              <item index="2">OCR 결과 확인·수정</item>
              <item index="3">AI 분석 결과</item>
              <item index="4">추천 결과</item>
              <item index="5">히스토리</item>
            </ordered_list>
          </content>
        </subsection>
        <subsection id="sec-2-1-sub-2" order="2.1.2" label="관리자 IA">
          <content>
            <ordered_list>
              <item index="1">대시보드</item>
              <item index="2">식단표/OCR 관리</item>
              <item index="3">키워드·추천 로직 관리</item>
              <item index="4">사용 통계</item>
              <item index="5">날짜별 식단 조회</item>
            </ordered_list>
          </content>
        </subsection>
      </subsection>
      <subsection id="sec-2-2" order="2.2" label="플로우 정의">
        <subsection id="sec-2-2-sub-1" order="2.2.1" label="플로우 A: 정상 처리">
          <content>
            <ordered_list>
              <item index="1">사용자 업로드</item>
              <item index="2">파일 유효성 검사 통과</item>
              <item index="3">OCR 처리 완료</item>
              <item index="4">AI 분석 완료</item>
              <item index="5">추천 노출</item>
              <item index="6">결과 저장</item>
            </ordered_list>
            <paragraph>진입 조건:</paragraph>
            <unordered_list>
              <item>이미지 파일 형식/용량 규칙 통과</item>
            </unordered_list>
            <paragraph>이탈 조건:</paragraph>
            <unordered_list>
              <item>결과 확인 후 히스토리 저장 완료</item>
            </unordered_list>
            <paragraph>CTA 우선순위:</paragraph>
            <ordered_list>
              <item index="1">`결과 보기`</item>
              <item index="2">`추천 보기`</item>
              <item index="3">`새 이미지 업로드`</item>
            </ordered_list>
          </content>
        </subsection>
        <subsection id="sec-2-2-sub-2" order="2.2.2" label="플로우 B: OCR 일부 실패">
          <content>
            <ordered_list>
              <item index="1">OCR 결과 일부 저신뢰 항목 발생</item>
              <item index="2">저신뢰 배지 표시</item>
              <item index="3">인라인 수정</item>
              <item index="4">재분석 실행</item>
              <item index="5">결과 업데이트</item>
            </ordered_list>
            <paragraph>진입 조건:</paragraph>
            <unordered_list>
              <item>OCR confidence가 임계치 미만(기본 0.75 미만)</item>
            </unordered_list>
            <paragraph>이탈 조건:</paragraph>
            <unordered_list>
              <item>수정 없이 계속 진행 또는 수정 후 재분석 완료</item>
            </unordered_list>
            <paragraph>CTA 우선순위:</paragraph>
            <ordered_list>
              <item index="1">`수정 후 재분석`</item>
              <item index="2">`그대로 분석 진행`</item>
              <item index="3">`다시 업로드`</item>
            </ordered_list>
          </content>
        </subsection>
        <subsection id="sec-2-2-sub-3" order="2.2.3" label="플로우 C: AI 분석 실패">
          <content>
            <ordered_list>
              <item index="1">OCR 성공</item>
              <item index="2">AI 분석 API 실패 또는 타임아웃</item>
              <item index="3">오류 메시지 및 임시 저장</item>
              <item index="4">재시도 또는 관리자 문의</item>
            </ordered_list>
            <paragraph>진입 조건:</paragraph>
            <unordered_list>
              <item>AI 단계 오류 코드 발생</item>
            </unordered_list>
            <paragraph>이탈 조건:</paragraph>
            <unordered_list>
              <item>재시도 성공 또는 히스토리로 이동</item>
            </unordered_list>
            <paragraph>CTA 우선순위:</paragraph>
            <ordered_list>
              <item index="1">`재시도`</item>
              <item index="2">`OCR 결과 확인`</item>
              <item index="3">`나중에 다시 시도`</item>
            </ordered_list>
          </content>
        </subsection>
      </subsection>
    </section>
    <section id="sec-3" order="3" label="반응형 레이아웃 규격">
      <subsection id="sec-3-1" order="3.1" label="브레이크포인트">
        <content>
          <table>
            <columns>
              <column index="1">토큰</column>
              <column index="2">해상도</column>
              <column index="3">Tailwind 예시</column>
            </columns>
            <rows>
              <row index="1">
                <cell column="1">`xs`</cell>
                <cell column="2">360px 이상</cell>
                <cell column="3">`xs:`</cell>
              </row>
              <row index="2">
                <cell column="1">`md`</cell>
                <cell column="2">768px 이상</cell>
                <cell column="3">`md:`</cell>
              </row>
              <row index="3">
                <cell column="1">`lg`</cell>
                <cell column="2">1024px 이상</cell>
                <cell column="3">`lg:`</cell>
              </row>
              <row index="4">
                <cell column="1">`xl`</cell>
                <cell column="2">1280px 이상</cell>
                <cell column="3">`xl:`</cell>
              </row>
            </rows>
          </table>
        </content>
      </subsection>
      <subsection id="sec-3-2" order="3.2" label="컨테이너">
        <content>
          <unordered_list>
            <item>모바일: 좌우 여백 `16px (1rem)`</item>
            <item>태블릿: 좌우 여백 `24px (1.5rem)`</item>
            <item>데스크톱: 좌우 여백 `32px (2rem)`</item>
            <item>최대 콘텐츠 폭: `1200px (75rem)`</item>
          </unordered_list>
        </content>
      </subsection>
      <subsection id="sec-3-3" order="3.3" label="그리드">
        <content>
          <unordered_list>
            <item>사용자 화면:</item>
          </unordered_list>
          <paragraph>- 기본: 1컬럼</paragraph>
          <paragraph>- `lg` 이상: `content 8col + side insight 4col` 허용</paragraph>
          <unordered_list>
            <item>관리자 화면:</item>
          </unordered_list>
          <paragraph>- 기본: 1컬럼(모바일)</paragraph>
          <paragraph>- `lg` 이상: 12컬럼</paragraph>
        </content>
      </subsection>
      <subsection id="sec-3-4" order="3.4" label="간격 시스템">
        <content>
          <unordered_list>
            <item>8pt 기반 스페이싱 토큰: `4, 8, 12, 16, 24, 32, 40, 48`</item>
            <item>카드 내부 패딩 기본: `16px (1rem)` 모바일, `24px (1.5rem)` 데스크톱</item>
            <item>섹션 간격 기본: `32px (2rem)` 모바일, `40px (2.5rem)` 데스크톱</item>
          </unordered_list>
        </content>
      </subsection>
      <subsection id="sec-3-5" order="3.5" label="터치/인터랙션 최소 규격">
        <content>
          <unordered_list>
            <item>모든 탭 가능 요소 최소 크기: `44x44px (2.75rem)`</item>
            <item>테이블 행 최소 높이: `52px (3.25rem)`</item>
          </unordered_list>
        </content>
      </subsection>
    </section>
    <section id="sec-4" order="4" label="디자인 토큰(라이트 모드 고정)">
      <subsection id="sec-4-1" order="4.1" label="색상 토큰">
        <subsection id="sec-4-1-sub-1" order="4.1.1" label="Primary Mint">
          <content>
            <table>
              <columns>
                <column index="1">토큰</column>
                <column index="2">값</column>
              </columns>
              <rows>
                <row index="1">
                  <cell column="1">`mint-50`</cell>
                  <cell column="2">`#ECFEF9`</cell>
                </row>
                <row index="2">
                  <cell column="1">`mint-100`</cell>
                  <cell column="2">`#CCFBF1`</cell>
                </row>
                <row index="3">
                  <cell column="1">`mint-500`</cell>
                  <cell column="2">`#14B8A6`</cell>
                </row>
                <row index="4">
                  <cell column="1">`mint-600`</cell>
                  <cell column="2">`#0D9488`</cell>
                </row>
                <row index="5">
                  <cell column="1">`mint-700`</cell>
                  <cell column="2">`#0F766E`</cell>
                </row>
              </rows>
            </table>
          </content>
        </subsection>
        <subsection id="sec-4-1-sub-2" order="4.1.2" label="Secondary Blue">
          <content>
            <table>
              <columns>
                <column index="1">토큰</column>
                <column index="2">값</column>
              </columns>
              <rows>
                <row index="1">
                  <cell column="1">`blue-50`</cell>
                  <cell column="2">`#F0F9FF`</cell>
                </row>
                <row index="2">
                  <cell column="1">`blue-100`</cell>
                  <cell column="2">`#E0F2FE`</cell>
                </row>
                <row index="3">
                  <cell column="1">`blue-500`</cell>
                  <cell column="2">`#0EA5E9`</cell>
                </row>
                <row index="4">
                  <cell column="1">`blue-600`</cell>
                  <cell column="2">`#0284C7`</cell>
                </row>
                <row index="5">
                  <cell column="1">`blue-700`</cell>
                  <cell column="2">`#0369A1`</cell>
                </row>
              </rows>
            </table>
          </content>
        </subsection>
        <subsection id="sec-4-1-sub-3" order="4.1.3" label="Neutral">
          <content>
            <table>
              <columns>
                <column index="1">토큰</column>
                <column index="2">값</column>
              </columns>
              <rows>
                <row index="1">
                  <cell column="1">`neutral-0`</cell>
                  <cell column="2">`#FFFFFF`</cell>
                </row>
                <row index="2">
                  <cell column="1">`neutral-50`</cell>
                  <cell column="2">`#F8FAFC`</cell>
                </row>
                <row index="3">
                  <cell column="1">`neutral-100`</cell>
                  <cell column="2">`#F1F5F9`</cell>
                </row>
                <row index="4">
                  <cell column="1">`neutral-300`</cell>
                  <cell column="2">`#CBD5E1`</cell>
                </row>
                <row index="5">
                  <cell column="1">`neutral-500`</cell>
                  <cell column="2">`#64748B`</cell>
                </row>
                <row index="6">
                  <cell column="1">`neutral-700`</cell>
                  <cell column="2">`#334155`</cell>
                </row>
                <row index="7">
                  <cell column="1">`neutral-900`</cell>
                  <cell column="2">`#0F172A`</cell>
                </row>
              </rows>
            </table>
          </content>
        </subsection>
        <subsection id="sec-4-1-sub-4" order="4.1.4" label="Semantic">
          <content>
            <table>
              <columns>
                <column index="1">토큰</column>
                <column index="2">값</column>
                <column index="3">용도</column>
              </columns>
              <rows>
                <row index="1">
                  <cell column="1">`success-500`</cell>
                  <cell column="2">`#16A34A`</cell>
                  <cell column="3">성공 알림, 완료 배지</cell>
                </row>
                <row index="2">
                  <cell column="1">`warning-500`</cell>
                  <cell column="2">`#D97706`</cell>
                  <cell column="3">주의 상태, 저신뢰 OCR</cell>
                </row>
                <row index="3">
                  <cell column="1">`error-500`</cell>
                  <cell column="2">`#DC2626`</cell>
                  <cell column="3">실패 상태, 유효성 오류</cell>
                </row>
                <row index="4">
                  <cell column="1">`info-500`</cell>
                  <cell column="2">`#0284C7`</cell>
                  <cell column="3">정보 안내, 상태 메시지</cell>
                </row>
              </rows>
            </table>
          </content>
        </subsection>
      </subsection>
      <subsection id="sec-4-2" order="4.2" label="타이포그래피">
        <content>
          <unordered_list>
            <item>Heading 폰트: `SUIT`</item>
            <item>Body/UI 폰트: `Pretendard Variable`</item>
            <item>최소 본문 크기: `16px (1rem)`</item>
            <item>본문 line-height: `1.6`</item>
          </unordered_list>
          <paragraph>타입 스케일:</paragraph>
          <table>
            <columns>
              <column index="1">스타일</column>
              <column index="2">크기</column>
              <column index="3">줄높이</column>
              <column index="4">굵기</column>
            </columns>
            <rows>
              <row index="1">
                <cell column="1">`display`</cell>
                <cell column="2">36px (2.25rem)</cell>
                <cell column="3">1.25</cell>
                <cell column="4">700</cell>
              </row>
              <row index="2">
                <cell column="1">`h1`</cell>
                <cell column="2">30px (1.875rem)</cell>
                <cell column="3">1.3</cell>
                <cell column="4">700</cell>
              </row>
              <row index="3">
                <cell column="1">`h2`</cell>
                <cell column="2">24px (1.5rem)</cell>
                <cell column="3">1.35</cell>
                <cell column="4">700</cell>
              </row>
              <row index="4">
                <cell column="1">`h3`</cell>
                <cell column="2">20px (1.25rem)</cell>
                <cell column="3">1.4</cell>
                <cell column="4">600</cell>
              </row>
              <row index="5">
                <cell column="1">`body-lg`</cell>
                <cell column="2">18px (1.125rem)</cell>
                <cell column="3">1.6</cell>
                <cell column="4">400</cell>
              </row>
              <row index="6">
                <cell column="1">`body`</cell>
                <cell column="2">16px (1rem)</cell>
                <cell column="3">1.6</cell>
                <cell column="4">400</cell>
              </row>
              <row index="7">
                <cell column="1">`caption`</cell>
                <cell column="2">14px (0.875rem)</cell>
                <cell column="3">1.5</cell>
                <cell column="4">400</cell>
              </row>
              <row index="8">
                <cell column="1">`label`</cell>
                <cell column="2">13px (0.8125rem)</cell>
                <cell column="3">1.4</cell>
                <cell column="4">500</cell>
              </row>
            </rows>
          </table>
        </content>
      </subsection>
      <subsection id="sec-4-3" order="4.3" label="형태/효과">
        <content>
          <unordered_list>
            <item>Radius: `8px (0.5rem)`, `12px (0.75rem)`, `16px (1rem)`, `24px (1.5rem)`</item>
            <item>Border 기본: `1px solid #CBD5E1 (neutral-300)`</item>
            <item>Shadow:</item>
          </unordered_list>
          <paragraph>- `shadow-sm`: `0 1px 2px rgba(15, 23, 42, 0.06)`</paragraph>
          <paragraph>- `shadow-md`: `0 6px 18px rgba(15, 23, 42, 0.10)`</paragraph>
          <paragraph>- `shadow-lg`: `0 14px 30px rgba(15, 23, 42, 0.14)`</paragraph>
        </content>
      </subsection>
      <subsection id="sec-4-4" order="4.4" label="모션">
        <content>
          <unordered_list>
            <item>`motion-micro`: `160ms`, `ease-out`</item>
            <item>`motion-panel`: `220ms`, `ease-out`</item>
            <item>상태 전환은 `transform, opacity` 우선 사용(레이아웃 점프 방지)</item>
            <item>`prefers-reduced-motion: reduce` 시 애니메이션 제거</item>
          </unordered_list>
        </content>
      </subsection>
      <subsection id="sec-4-5" order="4.5" label="CSS 변수 기준(예시)">
        <content>
          <code language="``css"><![CDATA[:root {
  --color-bg: #F8FAFC;             /* neutral-50 */
  --color-surface: #FFFFFF;        /* neutral-0 */
  --color-text-primary: #0F172A;   /* neutral-900 */
  --color-text-secondary: #334155; /* neutral-700 */
  --color-border: #CBD5E1;         /* neutral-300 */

  --color-primary: #14B8A6;        /* mint-500 */
  --color-primary-strong: #0D9488; /* mint-600 */
  --color-accent: #0EA5E9;         /* blue-500 */

  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-info: #0284C7;
}
```

---
]]></code>
        </content>
      </subsection>
    </section>
    <section id="sec-5" order="5" label="컴포넌트 규격(실구현 수준)">
      <subsection id="sec-5-1" order="5.1" label="Button">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>버튼은 1화면 1차 행동(primary) 1개를 초과하지 않는다.</item>
              <item>로딩 중 중복 클릭을 방지한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>높이: `44px (2.75rem)` 기본, `48px (3rem)` 강조형</item>
              <item>패딩: `0 16px (1rem)` 기본</item>
              <item>radius: `12px (0.75rem)`</item>
              <item>폰트: `16px (1rem)/1.2/600`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>variants: `primary`, `secondary`, `ghost`, `danger`</item>
              <item>states: `default`, `hover`, `active`, `focus`, `disabled`, `loading`, `icon-only`</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>`icon-only`는 최소 `44x44px` 유지</item>
              <item>`loading` 시 텍스트 유지 + 스피너 좌측 배치</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>icon-only 필수 `aria-label`</item>
              <item>focus ring: `2px` 외곽 강조(`blue-500`)</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">disabled에서 클릭 이벤트 미발생</item>
              <item index="2">loading에서 중복 요청 미발생</item>
              <item index="3">키보드 `Tab -&gt; Enter/Space` 동작</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-5-2" order="5.2" label="InputField">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>라벨과 힌트는 필수, placeholder는 보조 텍스트만 사용한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>높이: `48px (3rem)`</item>
              <item>패딩: `12px 14px (0.75rem 0.875rem)`</item>
              <item>radius: `12px (0.75rem)`</item>
              <item>라벨 간격: 필드 상단 `8px (0.5rem)`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>`default`, `focus`, `filled`, `error`, `success`, `disabled`</item>
              <item>파일 업로드형은 썸네일 미리보기 지원</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>OCR 수정 필드는 multiline 허용(`min-height 96px (6rem)`)</item>
              <item>숫자 입력 필드는 스핀 버튼 비노출</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>`label for` 연결</item>
              <item>에러는 필드 인접 텍스트로 제공(`role="alert"`)</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">에러 상태에서 테두리 + 에러 문구 동시 노출</item>
              <item index="2">키보드만으로 입력/제출 가능</item>
              <item index="3">파일 업로드 실패 시 오류 메시지 표시</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-5-3" order="5.3" label="UploadDropzone">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>업로드 방식(촬영/앨범)을 같은 우선순위로 제공한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>높이: 모바일 `196px (12.25rem)`, 데스크톱 `240px (15rem)`</item>
              <item>border: `2px dashed #CBD5E1`</item>
              <item>아이콘 영역: `48px (3rem)`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>`idle`, `dragover`, `uploading`, `success`, `error`</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>파일 포맷/용량 오류 시 즉시 토스트 노출</item>
              <item>모바일 카메라 권한 거부 시 대체 업로드 안내 노출</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>키보드 포커스 시 동일 강조 스타일</item>
              <item>버튼형 업로드 입력과 드래그 앤 드롭 동시 제공</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">촬영/앨범 업로드 동작 확인</item>
              <item index="2">용량 초과, 미지원 확장자 오류 확인</item>
              <item index="3">dragover 스타일 및 drop 동작 확인</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-5-4" order="5.4" label="Card 규격">
        <common_principle label="공통 원칙">
          <content>
            <unordered_list>
              <item>카드 헤더는 `제목 + 보조 액션` 구조로 통일한다.</item>
              <item>카드 내부 정보 밀도를 높이되, 주요 CTA는 카드 하단 우측 정렬로 통일한다.</item>
            </unordered_list>
          </content>
        </common_principle>
        <common_metrics label="공통 수치">
          <content>
            <unordered_list>
              <item>padding: 모바일 `16px (1rem)`, 데스크톱 `24px (1.5rem)`</item>
              <item>radius: `16px (1rem)`</item>
              <item>border: `1px solid #CBD5E1`</item>
              <item>gap: `12px (0.75rem)`</item>
            </unordered_list>
          </content>
        </common_metrics>
        <card_types label="카드 종류">
          <content>
            <ordered_list>
              <item index="1">`UploadCard`: 업로드 상태/가이드/최근 파일명</item>
              <item index="2">`AnalysisCard`: OCR/AI 키워드, 신뢰도, 처리시간</item>
              <item index="3">`RecommendationCard`: 추천 항목, 우선순위 배지, 근거 문장</item>
              <item index="4">`AdminStatCard`: 수치 KPI, 전일 대비 증감, 세부 링크</item>
            </ordered_list>
          </content>
        </card_types>
        <states label="상태">
          <content>
            <unordered_list>
              <item>`default`, `hover(optional)`, `selected`, `disabled`</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>추천 없음 상태에서는 대체 행동(`가글 추천 보기`) 노출</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>클릭 가능한 카드에만 `cursor-pointer` 적용</item>
              <item>카드 전체 클릭 시 `role="button"` + 키보드 접근 제공</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">카드 타입별 정보 누락 없음</item>
              <item index="2">hover가 레이아웃을 흔들지 않음</item>
              <item index="3">selected 상태 시 시각 구분 가능</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-5-5" order="5.5" label="Modal">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>파괴적 액션은 반드시 Confirm 모달을 거친다.</item>
              <item>모달 내 기본 CTA는 우측 하단 배치로 통일한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>max-width: `520px (32.5rem)`</item>
              <item>모바일 폭: `calc(100vw - 32px)` (좌우 16px 여백)</item>
              <item>내부 패딩: `24px (1.5rem)`</item>
              <item>헤더-본문 간격: `12px (0.75rem)`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>타입: `Confirm`, `Edit OCR`, `Rule Edit`</item>
              <item>`open`, `closing`, `submit-loading`, `error-inline`</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>`Edit OCR`는 변경점 없으면 저장 버튼 비활성</item>
              <item>`Rule Edit`는 유효 범위 벗어나면 저장 불가</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>ESC로 닫기 가능(파괴적 작업 저장 중 제외)</item>
              <item>focus trap 필수</item>
              <item>최초 포커스는 모달 제목 또는 첫 입력 필드</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">백드롭 클릭 동작 정책 확인</item>
              <item index="2">포커스가 모달 외부로 이탈하지 않음</item>
              <item index="3">ESC 동작/비동작 조건 정확</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-5-6" order="5.6" label="StatusChip(키워드 강도)">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>색상만으로 의미를 전달하지 않고 텍스트를 병기한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>높이: `28px (1.75rem)`</item>
              <item>패딩: `0 10px (0.625rem)`</item>
              <item>폰트: `13px (0.8125rem)/1.2/600`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>`low`, `medium`, `high`</item>
              <item>dismiss 옵션: `true/false`</item>
            </unordered_list>
          </content>
        </states>
        <colors label="색상">
          <content>
            <unordered_list>
              <item>`low`: `blue-100 + blue-700`</item>
              <item>`medium`: `mint-100 + mint-700`</item>
              <item>`high`: `#FEE2E2 + #B91C1C`</item>
            </unordered_list>
          </content>
        </colors>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>dismiss 가능한 칩은 삭제 후 Undo 토스트 제공(3초)</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>dismiss 버튼 `aria-label="키워드 제거"`</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">강도별 색/텍스트 동시 확인</item>
              <item index="2">dismiss 시 상태 반영/Undo 동작 확인</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-5-7" order="5.7" label="DataTable(관리자)">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>운영 업무 중심으로 `정렬 -&gt; 필터 -&gt; 상세` 흐름을 보장한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>헤더 높이: `52px (3.25rem)`</item>
              <item>행 높이: `52px (3.25rem)`</item>
              <item>셀 패딩: `12px 16px (0.75rem 1rem)`</item>
              <item>첫 열 고정 선택 가능(데스크톱)</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>`default`, `sorting`, `filtered-empty`, `loading`, `row-expanded`</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>모바일은 카드 리스트 뷰로 자동 전환 가능</item>
              <item>데이터 0건 시 필터 초기화 버튼 노출</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>헤더 정렬 상태 `aria-sort` 제공</item>
              <item>키보드 화살표 탐색 지원(필수 테이블만)</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">정렬/필터/페이지네이션 결합 동작</item>
              <item index="2">sticky header 가독성 확인</item>
              <item index="3">0건 상태 CTA 동작 확인</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-5-8" order="5.8" label="Toast 및 인라인 알림">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>글로벌 이벤트는 Toast, 필드 단위는 인라인 오류를 사용한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>Toast 폭: `320px (20rem)` 기본</item>
              <item>표시 시간: 성공 3초, 정보 4초, 경고/오류 수동 닫기 기본</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>`success`, `info`, `warning`, `error`</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>네트워크 오류는 재시도 버튼 포함</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>`aria-live="polite"` (일반), 오류는 `aria-live="assertive"`</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">자동 닫힘 시간 준수</item>
              <item index="2">다중 Toast 스택 레이아웃 정상</item>
              <item index="3">스크린리더 읽기 우선순위 확인</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-5-9" order="5.9" label="Skeleton/Loading">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>대기 시간 체감을 줄이기 위해 처리 단계와 남은 행동을 함께 안내한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>단계 컴포넌트 높이: `72px (4.5rem)`</item>
              <item>스켈레톤 애니메이션 주기: `1.2s`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>`uploading`, `ocr_processing`, `ai_processing`, `done`, `failed`</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>3초 이상: `처리 중입니다. 잠시만 기다려 주세요.`</item>
              <item>8초 이상: `처리가 길어지고 있습니다. 결과는 자동으로 저장됩니다.`</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>진행률 컴포넌트 `role="status"` 제공</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">단계 전환 정확성</item>
              <item index="2">3초/8초 임계 문구 노출 확인</item>
              <item index="3">실패 시 복구 CTA 노출 확인</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-5-10" order="5.10" label="Empty/Error 상태">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>모든 빈/오류 상태는 명확한 다음 행동을 제공한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>일러스트 최대 폭: `160px (10rem)`</item>
              <item>상태 제목: `20px (1.25rem)/600`</item>
              <item>상태 설명: `16px (1rem)/1.6/400`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>`no-data`, `no-search-result`, `ocr-error`, `ai-error`, `network-error`</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>반복 실패 3회 이상 시 문의 채널 링크 노출</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>상태 제목은 `h2`로 노출</item>
              <item>CTA는 키보드 접근 가능</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">케이스별 문구/CTA 매핑 정확</item>
              <item index="2">오류 후 재시도 흐름 정상</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
    </section>
    <section id="sec-6" order="6" label="화면별 상세 스펙">
      <subsection id="sec-6-1" order="6.1" label="사용자 홈(업로드)">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>첫 화면에서 업로드 행동을 즉시 시작할 수 있어야 한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>상단 안내 배너: `min-height 96px (6rem)`</item>
              <item>업로드 카드: 화면 상단에서 `24px (1.5rem)` 아래</item>
              <item>최근 분석 목록: 최대 3건</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>초기, 업로드 가능, 업로드 중, 최근 기록 있음/없음</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>첫 방문 시 촬영 가이드 모달 1회 노출</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>업로드 버튼/영역 이중 제공</item>
              <item>개인정보 안내 링크 키보드 포커스 가능</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">업로드 진입 1클릭 가능</item>
              <item index="2">최근 분석 3건 제한 노출</item>
              <item index="3">가이드 모달 재노출 정책 확인</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-6-2" order="6.2" label="OCR 결과 확인·수정 화면">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>저신뢰 항목을 빠르게 발견하고 수정할 수 있어야 한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>좌측 원본 이미지 영역: 데스크톱 6컬럼</item>
              <item>우측 추출 텍스트 영역: 데스크톱 6컬럼</item>
              <item>confidence 배지: `28px (1.75rem)` 높이</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>OCR 성공, 일부 실패(저신뢰), 전체 실패</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>저신뢰 항목 우선 정렬(상단 표시)</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>수정 입력마다 라벨과 confidence 텍스트 연결</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">저신뢰 항목 강조 표시 확인</item>
              <item index="2">수정 후 재분석 API 호출 확인</item>
              <item index="3">전체 실패 시 대체 업로드 흐름 확인</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-6-3" order="6.3" label="AI 분석 결과 화면">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>분석 결과는 `요약 -&gt; 근거 -&gt; 행동` 순서로 제시한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>요약 카드 상단 고정 영역: `min-height 120px (7.5rem)`</item>
              <item>키워드 칩 간격: `8px (0.5rem)`</item>
              <item>추천 카드 최소 2개, 최대 4개 노출</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>분석 완료, 일부 항목 누락, 분석 실패</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>추천 로직 데이터 부족 시 공통 구강케어 가이드를 대체 노출</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>키워드/근거 문장 모두 텍스트로 제공</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">키워드-근거-추천 순서 유지</item>
              <item index="2">누락 데이터 대체 문구 노출</item>
              <item index="3">CTA 클릭 후 다음 행동 정상</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-6-4" order="6.4" label="사용자 히스토리 화면">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>재조회가 빠르고 필터 조건이 명확해야 한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>상단 필터 바 높이: `56px (3.5rem)`</item>
              <item>카드 리스트 간격: `12px (0.75rem)`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>기본 목록, 필터 결과, 빈 결과, 로딩</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>90일 초과 데이터는 월 단위 묶음 표시</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>필터 컨트롤에 명시적 라벨 제공</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">날짜/상태 필터 동시 동작</item>
              <item index="2">카드/리스트 토글 상태 유지</item>
              <item index="3">빈 결과 CTA 동작</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-6-5" order="6.5" label="관리자 대시보드">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>장애와 품질 문제를 첫 화면에서 발견 가능해야 한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>KPI 카드 4개 1행(`lg` 이상)</item>
              <item>오류 로그 위젯 높이: `320px (20rem)`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>정상, 경고(실패율 임계), 장애(실시간 실패 급증)</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>당일 데이터 부족 시 전주 평균 비교로 대체</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>차트에는 표 형식 대체 데이터 제공</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">KPI 값/증감률 일치</item>
              <item index="2">오류 로그 최근순 정렬 확인</item>
              <item index="3">경고 상태 색/텍스트 동시 표시</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-6-6" order="6.6" label="관리자 식단표/OCR 관리">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>원본과 결과를 나란히 비교하고 즉시 수정/승인 가능해야 한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>원본 이미지 패널: 5컬럼</item>
              <item>OCR 텍스트 패널: 7컬럼</item>
              <item>액션 바: 하단 sticky `64px (4rem)`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>`pending`, `approved`, `rejected`, `reprocess`</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>승인 후 수정 시 변경 이력 필수 기록</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>상태 변경 버튼 키보드 접근 가능</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">승인/반려/재처리 상태 전이 검증</item>
              <item index="2">수정 이력 타임스탬프 기록 검증</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-6-7" order="6.7" label="관리자 키워드·추천 로직 관리">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>추천 규칙 변경은 가시적이고 추적 가능해야 한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>키워드 테이블 행 높이: `52px (3.25rem)`</item>
              <item>가중치 슬라이더 폭: `240px (15rem)`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>조회, 추가, 수정, 비활성화, 버전 충돌</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>충돌 시 최신 버전 재로딩 후 병합 안내</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>슬라이더 변경 값은 텍스트 수치 동시 노출</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">CRUD 전체 동작</item>
              <item index="2">가중치 범위 검증(0~100)</item>
              <item index="3">추천 매핑 저장/반영 검증</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
      <subsection id="sec-6-8" order="6.8" label="관리자 통계/날짜별 식단 조회">
        <principle label="원칙">
          <content>
            <unordered_list>
              <item>기간 기반 패턴과 오류 유형을 빠르게 파악하도록 구성한다.</item>
            </unordered_list>
          </content>
        </principle>
        <metrics label="수치">
          <content>
            <unordered_list>
              <item>기간 필터: `일/주/월` 세그먼트</item>
              <item>차트 최소 높이: `280px (17.5rem)`</item>
            </unordered_list>
          </content>
        </metrics>
        <states label="상태">
          <content>
            <unordered_list>
              <item>기본, 기간 변경 로딩, 데이터 없음, 오류</item>
            </unordered_list>
          </content>
        </states>
        <exceptions label="예외">
          <content>
            <unordered_list>
              <item>데이터 없음 시 직전 기간 자동 추천 버튼 제공</item>
            </unordered_list>
          </content>
        </exceptions>
        <accessibility label="접근성">
          <content>
            <unordered_list>
              <item>차트의 데이터 요약 텍스트 별도 노출</item>
            </unordered_list>
          </content>
        </accessibility>
        <test_criteria label="테스트 기준">
          <content>
            <ordered_list>
              <item index="1">기간 변경 시 쿼리 파라미터 일치</item>
              <item index="2">오류 유형 TopN 정렬 검증</item>
              <item index="3">데이터 없음 대체 행동 확인</item>
            </ordered_list>
          </content>
        </test_criteria>
      </subsection>
    </section>
    <section id="sec-7" order="7" label="비기능 요구 반영 UI 규칙">
      <subsection id="sec-7-1" order="7.1" label="성능 UX">
        <content>
          <unordered_list>
            <item>처리 상태 UI는 항상 3단계 표시(업로드/OCR/AI).</item>
            <item>3초 이상: 사용자 불안을 낮추는 보조 문구 표시.</item>
            <item>8초 이상: 백그라운드 저장 안내 + 이탈 허용 안내 표시.</item>
            <item>긴 작업은 optimistic UI 금지, 실제 상태 기반 표기.</item>
          </unordered_list>
        </content>
      </subsection>
      <subsection id="sec-7-2" order="7.2" label="데이터 품질 개선 UX">
        <content>
          <unordered_list>
            <item>OCR 실패 항목은 `저신뢰` 태그와 함께 하이라이트.</item>
            <item>AI 분석 실패는 `error_code`와 함께 관리자 큐로 자동 분류.</item>
            <item>사용자 수정 데이터는 향후 모델 개선용 로그로 연결(사용자 화면에는 노출하지 않음).</item>
          </unordered_list>
        </content>
      </subsection>
      <subsection id="sec-7-3" order="7.3" label="로그 노출 분리 정책">
        <content>
          <unordered_list>
            <item>사용자 화면: 이해 가능한 문구 중심(`원인 + 다음 행동`)</item>
            <item>관리자 화면: `errorCode`, `stage`, `rawMessage`, `timestamp`, `mealDate` 포함</item>
          </unordered_list>
        </content>
      </subsection>
    </section>
    <section id="sec-8" order="8" label="접근성/사용성 체크 규칙">
      <subsection id="sec-8-1" order="8.1" label="필수 접근성 규칙">
        <content>
          <ordered_list>
            <item index="1">텍스트 대비 `4.5:1` 이상</item>
            <item index="2">키보드 탐색 완전 지원</item>
            <item index="3">아이콘 버튼 `aria-label` 필수</item>
            <item index="4">입력 오류는 색상 외 텍스트로 전달</item>
            <item index="5">포커스 순서는 시각 순서와 일치</item>
          </ordered_list>
        </content>
      </subsection>
      <subsection id="sec-8-2" order="8.2" label="시맨틱 구조">
        <content>
          <unordered_list>
            <item>페이지별 주 제목 `h1` 1개</item>
            <item>카드/섹션은 논리적 heading 계층 유지</item>
            <item>의미 있는 이미지는 `alt`, 장식용 이미지는 `aria-hidden="true"`</item>
          </unordered_list>
        </content>
      </subsection>
      <subsection id="sec-8-3" order="8.3" label="상호작용 규칙">
        <content>
          <unordered_list>
            <item>hover 의존 금지(모바일 동일 기능 제공)</item>
            <item>포커스 링 제거 금지</item>
            <item>클릭 가능한 요소에는 `cursor-pointer`</item>
          </unordered_list>
        </content>
      </subsection>
    </section>
    <section id="sec-9" order="9" label="공용 API/인터페이스/타입 명세">
      <subsection id="sec-9-1" order="9.1" label="도메인 타입">
        <content>
          <code language="``ts"><![CDATA[type ProcessStage = 'idle' | 'uploading' | 'ocr_processing' | 'ai_processing' | 'done' | 'failed';

interface OCRMenuItem {
  id: string;
  text: string;
  confidence: number; // 0~1
  correctedText?: string;
  correctedBy?: 'user' | 'admin';
}

interface DietKeyword {
  code: 'spicy' | 'salty' | 'oily' | 'sweet' | 'acidic';
  label: string;
  score: number; // 0~100
}

interface CareRecommendation {
  id: string;
  title: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

interface AdminLogRow {
  id: string;
  createdAt: string;
  stage: Exclude<ProcessStage, 'idle' | 'done'>;
  errorCode?: string;
  message: string;
  mealDate?: string;
}
```
]]></code>
        </content>
      </subsection>
      <subsection id="sec-9-2" order="9.2" label="컴포넌트 Props 표준">
        <content>
          <code language="``ts"><![CDATA[type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize; // md=44px, lg=48px
  loading?: boolean;
  disabled?: boolean;
  iconOnly?: boolean;
  ariaLabel?: string; // iconOnly일 때 필수
  onClick?: () => void;
  children?: React.ReactNode;
}

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  success?: string;
  disabled?: boolean;
  required?: boolean;
  multiline?: boolean;
  onChange: (value: string) => void;
}

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  submitLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  destructive?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children?: React.ReactNode;
}

type StatusLevel = 'low' | 'medium' | 'high';
interface StatusChipProps {
  level: StatusLevel;
  label: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

interface DataTableColumn<T> {
  key: string;
  header: string;
  width?: number;
  sortable?: boolean;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onSortChange?: (key: string, order: 'asc' | 'desc') => void;
}

interface UploadDropzoneProps {
  accept?: string[];
  maxSizeMB?: number;
  onSelectFile: (file: File) => void;
  onCapturePhoto?: () => void;
  loading?: boolean;
}
```
]]></code>
        </content>
      </subsection>
      <subsection id="sec-9-3" order="9.3" label="API 응답 최소 필드(권장)">
        <content>
          <code language="``ts"><![CDATA[interface ProcessResponse {
  processId: string;
  stage: ProcessStage;
  progress: number; // 0~100
  ocrItems?: OCRMenuItem[];
  keywords?: DietKeyword[];
  recommendations?: CareRecommendation[];
  errorCode?: string;
}
```

---
]]></code>
        </content>
      </subsection>
    </section>
    <section id="sec-10" order="10" label="테스트 케이스 및 시나리오">
      <content>
        <ordered_list>
          <item index="1">반응형 검증: `360/768/1024/1280`에서 레이아웃 붕괴/가로 스크롤 없음.</item>
          <item index="2">업로드 플로우: 촬영/앨범 업로드 각각 정상 동작 및 용량 초과 오류 메시지.</item>
          <item index="3">OCR 편집 플로우: 신뢰도 낮은 항목 수정 후 재분석 성공.</item>
          <item index="4">AI 결과 플로우: 키워드/추천/근거 문구가 규격대로 표시.</item>
          <item index="5">실패 복구: OCR 실패, AI 실패, 네트워크 실패 각각 재시도 가능.</item>
          <item index="6">관리자 CRUD: 키워드 추가/수정/비활성화와 추천 로직 반영 확인.</item>
          <item index="7">접근성: 키보드 탭 이동, 스크린리더 라벨, 포커스 시각화.</item>
          <item index="8">시맨틱 색상: success/warning/error/info가 텍스트와 함께 전달.</item>
          <item index="9">로딩 UX: 3초/8초 임계 메시지 표시 규칙 검증.</item>
          <item index="10">로그 가시성: 사용자 메시지와 관리자 상세 로그가 역할에 맞게 분리 표시.</item>
        </ordered_list>
      </content>
    </section>
    <section id="sec-11" order="11" label="가정 및 기본값">
      <content>
        <unordered_list>
          <item>프론트엔드 기준은 `React + Tailwind`.</item>
          <item>테마는 `라이트 모드 우선`이며 다크모드는 이번 문서 범위에서 제외.</item>
          <item>관리자 권한은 MVP 기준 단일 역할(`admin`)로 가정.</item>
          <item>언어는 한국어 단일 로케일 기준.</item>
          <item>디자인 기준은 모바일 퍼스트, 데스크톱 확장형.</item>
          <item>아이콘 세트는 단일 세트(Lucide 등)로 통일, 이모지 아이콘 미사용.</item>
        </unordered_list>
      </content>
    </section>
    <section id="sec-12" order="12" label="구현 핸드오프 체크리스트">
      <subsection id="sec-12-sub-1" order="12.1" label="디자인">
        <content>
          <checklist>
            <check_item index="1" checked="false">컬러/타입/간격 토큰이 Figma와 코드에서 동일한 이름으로 관리됨</check_item>
            <check_item index="2" checked="false">핵심 화면(8개) 시안과 상태별 화면(오류/빈 상태/로딩) 준비 완료</check_item>
            <check_item index="3" checked="false">컴포넌트 상태표(default/hover/focus/disabled/loading) 완료</check_item>
          </checklist>
        </content>
      </subsection>
      <subsection id="sec-12-sub-2" order="12.2" label="프론트엔드">
        <content>
          <checklist>
            <check_item index="1" checked="false">공용 컴포넌트(`Button/InputField/Modal/StatusChip/DataTable/UploadDropzone`) 구현</check_item>
            <check_item index="2" checked="false">브레이크포인트/컨테이너 규칙 적용</check_item>
            <check_item index="3" checked="false">접근성 속성(`aria-*`, keyboard nav, focus ring) 적용</check_item>
            <check_item index="4" checked="false">3초/8초 로딩 임계 메시지 로직 반영</check_item>
          </checklist>
        </content>
      </subsection>
      <subsection id="sec-12-sub-3" order="12.3" label="백엔드/연동">
        <content>
          <checklist>
            <check_item index="1" checked="false">`ProcessStage` 기반 상태값 전달</check_item>
            <check_item index="2" checked="false">OCR confidence 필드 제공</check_item>
            <check_item index="3" checked="false">오류 코드 분리(사용자 메시지용/관리자 상세용)</check_item>
          </checklist>
        </content>
      </subsection>
      <subsection id="sec-12-sub-4" order="12.4" label="QA">
        <content>
          <checklist>
            <check_item index="1" checked="false">10개 시나리오 전수 점검</check_item>
            <check_item index="2" checked="false">브라우저(Chrome/Safari/Edge) 및 모바일 기기 점검</check_item>
            <check_item index="3" checked="false">접근성 기본 검사(키보드/대비/라벨) 통과</check_item>
          </checklist>
        </content>
      </subsection>
    </section>
  </sections>
</ocr_food_uiux_spec>
```
