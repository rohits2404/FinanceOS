import { motion } from "framer-motion";
import { Moon, Sun, Shield, Database, RefreshCw, Trash2, Download } from "lucide-react";
import { useApp } from "../context/AppContext";
import { mockTransactions } from "../data/mockData";
import { exportToCSV, exportToJSON, formatCurrency, cn } from "../lib/utils";

export default function Settings() {
  
    const { theme, toggleTheme, role, setRole, transactions } = useApp();

    const handleResetData = () => {
        localStorage.removeItem("fd_transactions");
        window.location.reload();
    };

    const handleRestoreDefaults = () => {
        localStorage.setItem("fd_transactions", JSON.stringify(mockTransactions));
        window.location.reload();
    };

    const handleExportAll = () => {
        exportToCSV(
            transactions.map((t) => ({
                id: t.id,
                date: t.date,
                description: t.description,
                merchant: t.merchant || "",
                category: t.category,
                type: t.type,
                amount: t.amount,
                notes: t.notes || "",
            })),
            "all-transactions"
        );
    };

    const handleExportAllJSON = () => {
        exportToJSON(transactions, "all-transactions");
    };

    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 max-w-3xl mx-auto"
        data-testid="settings-page"
        >
            {/* Appearance */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-card border border-card-border rounded-2xl p-5"
            >
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        {theme === "dark" ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-indigo-600" />}
                    </div>
                    Appearance
                </h2>
                <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                        <p className="text-sm font-medium text-foreground">Dark Mode</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {theme === "dark" ? "Currently using dark theme" : "Currently using light theme"}
                        </p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        data-testid="settings-theme-toggle"
                        className={cn(
                        "relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30",
                        theme === "dark" ? "bg-primary" : "bg-muted"
                        )}
                    >
                        <div
                        className={cn(
                            "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
                            theme === "dark" ? "translate-x-6" : "translate-x-0"
                        )}
                        />
                    </button>
                </div>
            </motion.div>

            {/* Role */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-card-border rounded-2xl p-5"
            >
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-purple-600" />
                    </div>
                    Role & Permissions
                </h2>
                <div className="space-y-3">
                    {(["admin", "viewer"] as const).map((r) => (
                        <div
                        key={r}
                        onClick={() => setRole(r)}
                        data-testid={`role-option-${r}`}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
                            role === r
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-border/80 hover:bg-muted/50"
                        )}
                        >
                            <div className={cn(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                                role === r ? "border-primary bg-primary" : "border-border"
                            )}>
                                {role === r && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground capitalize">{r}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                {r === "admin"
                                    ? "Full access — add, edit, and delete transactions"
                                    : "Read-only — view data but cannot make changes"}
                                </p>
                            </div>
                            {role === r && (
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Active</span>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Data Summary */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card border border-card-border rounded-2xl p-5"
            >
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Database className="w-4 h-4 text-emerald-600" />
                    </div>
                    Data Overview
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {[
                        { label: "Total Transactions", value: transactions.length.toString() },
                        { label: "Total Income", value: formatCurrency(income) },
                        { label: "Total Expenses", value: formatCurrency(expenses) },
                    ].map((item) => (
                        <div key={item.label} className="bg-muted/50 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className="text-sm font-bold text-foreground">{item.value}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                    Data is persisted in browser local storage and will survive page refreshes.
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <button
                    onClick={handleExportAll}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                    data-testid="export-all-csv"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={handleExportAllJSON}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                        data-testid="export-all-json"
                    >
                        <Download className="w-4 h-4" />
                        Export JSON
                    </button>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-card-border rounded-2xl p-5"
            >
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </div>
                    Danger Zone
                </h2>
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-border">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">Restore Sample Data</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Reset to the original 60 mock transactions</p>
                        </div>
                        <button
                        onClick={handleRestoreDefaults}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors shrink-0"
                        data-testid="restore-defaults"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Restore
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5">
                        <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Clear All Data</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Permanently delete all transactions from local storage</p>
                        </div>
                        <button
                        onClick={handleResetData}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors shrink-0"
                        data-testid="clear-all-data"
                        >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
