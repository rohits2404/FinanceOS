import { motion } from "framer-motion";
import { Menu, Moon, Sun, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { RoleSwitcher } from "../role-switcher";

interface HeaderProps {
    onMenuClick: () => void;
    title: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  
    const { theme, toggleTheme, role, setRole } = useApp();

    return (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
                        data-testid="header-menu-button"
                    >
                        <Menu className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-foreground">{title}</h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Role switcher */}
                    <RoleSwitcher role={role} setRole={setRole} />

                    {/* Notification bell */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-xl hover:bg-muted transition-colors relative"
                        data-testid="notification-bell"
                    >
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
                    </motion.button>

                    {/* Dark mode toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="p-2 rounded-xl hover:bg-muted transition-colors"
                        data-testid="theme-toggle"
                    >
                        <AnimatedIcon theme={theme} />
                    </motion.button>
                </div>
            </div>
        </header>
    );
}

function AnimatedIcon({ theme }: { theme: string }) {
    return (
        <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
            ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
            )}
        </motion.div>
    );
}
