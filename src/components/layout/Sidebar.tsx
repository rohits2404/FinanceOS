import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Settings,
  X,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { cn } from "../../lib/utils";

const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/transactions", icon: ArrowLeftRight, label: "Transactions" },
    { href: "/insights", icon: Lightbulb, label: "Insights" },
    { href: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
    isMobile: boolean;
}

export function Sidebar({ open, onClose, isMobile }: SidebarProps) {
  
    const [location] = useLocation();
    
    const { role } = useApp();

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
                <div className="w-9 h-9 rounded-xl gradient-balance flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                    <span className="font-bold text-foreground text-lg tracking-tight">FinanceOS</span>
                    <p className="text-xs text-muted-foreground capitalize">{role} view</p>
                </div>
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="ml-auto p-1 rounded-lg hover:bg-muted transition-colors"
                        data-testid="sidebar-close"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                )}
            </div>
            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                    Navigation
                </p>
                {navItems.map((item) => {
                    const isActive = location === item.href;
                    return (
                        <Link key={item.href} href={item.href} onClick={isMobile ? onClose : undefined}>
                            <motion.div
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            data-testid={`nav-${item.label.toLowerCase()}`}
                            className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            )}
                            >
                                <item.icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                {item.label}
                                {isActive && (
                                    <motion.div
                                    layoutId="active-indicator"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/60"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>
            {/* Bottom */}
            <div className="px-4 py-4 border-t border-border/50">
                <div className="rounded-xl bg-primary/10 dark:bg-primary/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Pro Tip</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Track your spending weekly to stay on top of your financial goals.
                    </p>
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <>
                <AnimatePresence>
                    {open && (
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={onClose}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {open && (
                        <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 lg:hidden"
                        >
                            {sidebarContent}
                        </motion.aside>
                    )}
                </AnimatePresence>
            </>
        );
    }

    return (
        <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar border-r border-sidebar-border h-screen sticky top-0">
            {sidebarContent}
        </aside>
    );
}
