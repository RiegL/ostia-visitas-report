
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, PlusCircle, FileText, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { icon: Home, label: "Início", path: "/" },
    { icon: Users, label: "Pacientes", path: "/patients" },
    { icon: PlusCircle, label: "Novo Paciente", path: "/patients/new" },
    { icon: FileText, label: "Relatórios", path: "/reports" },
    { icon: Users, label: "Ministros", path: "/ministers" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-pastoral-gradient text-white shadow-lg transition-transform duration-300 ease-in-out ${
          isMobile ? (isSidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold">Visitas Pastorais</h1>
            <p className="text-sm opacity-80">Sistema de relatórios</p>
          </div>

          <Separator className="bg-white/20" />

          <ScrollArea className="flex-1 py-2">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-white/20 text-white font-medium"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => isMobile && setIsSidebarOpen(false)}
                  >
                    <Icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="px-4 py-3">
            <p className="text-center text-xs text-white/60">
              &copy; {new Date().getFullYear()} Ministério Pastoral
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          !isMobile ? "ml-64" : "ml-0"
        }`}
      >
        <main className="container p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
