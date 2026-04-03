import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { type TransactionCategory, categoryConfig } from "../../data/mockData";

interface Props {
    value: TransactionCategory;
    onChange: (val: TransactionCategory) => void;
}

export function CategorySelect({ value, onChange }: Props) {
  
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(0);
    const [position, setPosition] = useState<"top" | "bottom">("bottom");

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const categories = Object.entries(categoryConfig);

    // 📍 POSITIONING (auto up/down)
    useEffect(() => {
        if (!open) return;

        const rect = triggerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        setPosition(spaceBelow < 250 && spaceAbove > spaceBelow ? "top" : "bottom");
    }, [open]);

    // ❌ CLOSE ON OUTSIDE CLICK
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                !triggerRef.current?.contains(e.target as Node) &&
                !dropdownRef.current?.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ⌨️ KEYBOARD NAVIGATION
    useEffect(() => {
        if (!open) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                setHighlighted((p) => (p + 1) % categories.length);
            }
            if (e.key === "ArrowUp") {
                setHighlighted((p) =>
                p === 0 ? categories.length - 1 : p - 1
                );
            }
            if (e.key === "Enter") {
                const selected = categories[highlighted];
                onChange(selected[0] as TransactionCategory);
                setOpen(false);
            }
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, highlighted]);

    const rect = triggerRef.current?.getBoundingClientRect();

    return (
        <>
            {/* Trigger */}
            <button
            ref={triggerRef}
            onClick={() => setOpen((p) => !p)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-border bg-background text-sm hover:bg-muted transition"
            >
                <span className="text-foreground">
                    {categoryConfig[value].label}
                </span>

                <motion.div animate={{ rotate: open ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
            </button>

            {/* Portal Dropdown */}
            {typeof window !== "undefined" && createPortal (
                <AnimatePresence>
                    {open && rect && (
                        <motion.div
                            ref={dropdownRef}
                            initial={{ opacity: 0, scale: 0.95, y: position === "bottom" ? -5 : 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            style={{
                            position: "fixed",
                            top:
                                position === "bottom"
                                ? rect.bottom + 6
                                : rect.top - 260,
                            left: rect.left,
                            width: rect.width,
                            zIndex: 9999,
                            }}
                            className="rounded-xl border border-border bg-popover shadow-2xl overflow-hidden"
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {categories.map(([key, val], index) => (
                                    <button
                                    key={key}
                                    onClick={() => {
                                        onChange(key as TransactionCategory);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 text-sm transition",
                                        index === highlighted && "bg-muted",
                                        "hover:bg-muted"
                                    )}
                                    >
                                        <span>{val.label}</span>

                                        {value === key && (
                                            <Check className="w-4 h-4 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
