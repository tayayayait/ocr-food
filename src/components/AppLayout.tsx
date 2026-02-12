import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, History, LayoutDashboard, Settings, Database, BarChart3 } from "lucide-react";

const userLinks = [
  { to: "/", label: "홈", icon: Home },
  { to: "/history", label: "히스토리", icon: History },
];

const adminLinks = [
  { to: "/admin", label: "대시보드", icon: LayoutDashboard },
  { to: "/admin/ocr", label: "OCR 관리", icon: Database },
  { to: "/admin/keywords", label: "키워드 관리", icon: Settings },
  { to: "/admin/stats", label: "통계", icon: BarChart3 },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container-app flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading font-bold text-sm">
              OC
            </div>
            <span className="font-heading font-bold text-lg text-foreground">OCR Food</span>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-mint-50 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
            {!isAdmin ? (
              <Link
                to="/admin"
                className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">관리자</span>
              </Link>
            ) : (
              <Link
                to="/"
                className="ml-2 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">사용자</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="container-app py-6 lg:py-10">{children}</main>
    </div>
  );
}
