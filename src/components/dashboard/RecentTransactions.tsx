import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { categoryConfig } from "../../data/mockData";
import { formatCurrency, formatDate } from "../../lib/utils";
import { cn } from "../../lib/utils";

export function RecentTransactions() {
  
    const { transactions } = useApp();
  
    const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-card border border-card-border rounded-2xl p-5"
        data-testid="recent-transactions"
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-foreground">Recent Transactions</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Latest activity</p>
                </div>
                <Link href="/transactions">
                    <span className="flex items-center gap-1 text-xs text-primary font-medium hover:underline cursor-pointer">
                        View all <ArrowRight className="w-3 h-3" />
                    </span>
                </Link>
            </div>

            {recent.length === 0 ? (
                <div className="py-8 text-center">
                <p className="text-muted-foreground text-sm">No transactions yet</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {recent.map((tx, i) => {
                        const config = categoryConfig[tx.category];
                        return (
                            <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.06 }}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                            data-testid={`recent-tx-${tx.id}`}
                            >
                                <div
                                className={cn(
                                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm",
                                    config.bgColor,
                                    "dark:bg-opacity-30"
                                )}
                                >
                                    <span style={{ color: config.color }}>
                                        {tx.description.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p
                                    className={cn(
                                    "text-sm font-semibold",
                                    tx.type === "income"
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-foreground"
                                    )}
                                    >
                                        {tx.type === "income" ? "+" : "-"}
                                        {formatCurrency(tx.amount)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{config.label}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
