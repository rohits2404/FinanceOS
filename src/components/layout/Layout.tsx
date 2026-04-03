import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/transactions": "Transactions",
    "/insights": "Insights",
    "/settings": "Settings",
};

export function Layout({ children }: { children: React.ReactNode }) {
  
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    const [location] = useLocation();

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const title = pageTitles[location] || "Finance Dashboard";

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobile={isMobile}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                onMenuClick={() => setSidebarOpen(true)}
                title={title}
                />
                <main className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
