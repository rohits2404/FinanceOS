import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    change?: number;
    changeLabel?: string;
    icon: React.ReactNode;
    gradient: string;
    index?: number;
}

export function StatCard({
    title,
    value,
    change,
    changeLabel,
    icon,
    gradient,
    index = 0,
}: StatCardProps) {
  
    const isPositive = (change ?? 0) > 0;
  
    const isNeutral = change === undefined || change === 0;

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        className="relative bg-card border border-card-border rounded-2xl p-5 overflow-hidden group cursor-default"
        data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
        >
            {/* Background gradient blob */}
            <div
            className={cn(
                "absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-15 transition-opacity",
                gradient
            )}
            />

            <div className="relative">
                <div className="flex items-start justify-between mb-3">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div
                    className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        gradient
                    )}
                    >
                        {icon}
                    </div>
                </div>

                <p className="text-2xl font-bold text-foreground mb-2 tracking-tight">
                    {value}
                </p>

                {!isNeutral && (
                    <div className="flex items-center gap-1.5">
                        <div
                        className={cn(
                            "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                            isPositive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}
                        >
                            {isPositive ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(change ?? 0).toFixed(1)}%
                        </div>
                        {changeLabel && (
                            <span className="text-xs text-muted-foreground">{changeLabel}</span>
                        )}
                    </div>
                )}
                {isNeutral && changeLabel && (
                    <div className="flex items-center gap-1">
                        <Minus className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{changeLabel}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
