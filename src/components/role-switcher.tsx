import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";

type Role = "admin" | "viewer";

interface RoleSwitcherProps {
    role: Role;
    setRole: (role: Role) => void;
}

export function RoleSwitcher({ role, setRole }: RoleSwitcherProps) {
  
    const [open, setOpen] = useState(false);
  
    const ref = useRef<HTMLDivElement>(null);

    const options: Role[] = ["admin", "viewer"];

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative" data-testid="role-switcher">
            {/* Trigger */}
            <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition-colors"
            >
                <div
                className={cn(
                    "w-2 h-2 rounded-full",
                    role === "admin" ? "bg-primary" : "bg-chart-2"
                )}
                />
                <span className="text-foreground capitalize">{role}</span>

                <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </motion.div>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl border border-border bg-popover shadow-lg z-50 overflow-hidden"
                    >
                        {options.map((option) => (
                            <button
                            key={option}
                            onClick={() => {
                            setRole(option);
                            setOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                    className={cn(
                                    "w-2 h-2 rounded-full",
                                    option === "admin"
                                        ? "bg-primary"
                                        : "bg-chart-2"
                                    )}
                                    />
                                    <span className="text-foreground capitalize">
                                        {option}
                                    </span>
                                </div>

                                {role === option && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
