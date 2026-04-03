import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit2,
  Trash2,
  SortAsc,
  SortDesc,
  ChevronDown,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { TransactionModal } from "../components/transactions/TransactionModal";
import { type Transaction, categoryConfig } from "../data/mockData";
import { formatCurrency, formatDate, exportToCSV, exportToJSON, cn } from "../lib/utils";

const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...Object.entries(categoryConfig).map(([k, v]) => ({ value: k, label: v.label })),
];

export default function Transactions() {
    const {
        role,
        filteredTransactions,
        filters,
        setFilters,
        deleteTransaction,
        resetFilters,
    } = useApp();

    const [modalOpen, setModalOpen] = useState(false);
    const [editTx, setEditTx] = useState<Transaction | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);

    const handleEdit = (tx: Transaction) => {
        setEditTx(tx);
        setModalOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteTransaction(id);
        setDeleteConfirm(null);
    };

    const handleExportCSV = () => {
        exportToCSV(
            filteredTransactions.map((t) => ({
                id: t.id,
                date: t.date,
                description: t.description,
                merchant: t.merchant || "",
                category: categoryConfig[t.category].label,
                type: t.type,
                amount: t.amount,
                notes: t.notes || "",
            })),
            "transactions"
        );
        setExportMenuOpen(false);
    };

    const handleExportJSON = () => {
        exportToJSON(filteredTransactions, "transactions");
        setExportMenuOpen(false);
    };

    const toggleSort = (field: "date" | "amount" | "description") => {
        if (filters.sortBy === field) {
            setFilters({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
        } else {
            setFilters({ sortBy: field, sortOrder: "desc" });
        }
    };

    const activeFiltersCount = [
        filters.type !== "all",
        filters.category !== "all" && !!filters.category,
        !!filters.dateFrom,
        !!filters.dateTo,
    ].filter(Boolean).length;

    const totalIncome = filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0);
    const totalExpenses = filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 max-w-7xl mx-auto"
        data-testid="transactions-page"
        >
            {/* Toolbar */}
            <div className="bg-card border border-card-border rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-50">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                        type="search"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        placeholder="Search transactions..."
                        value={filters.search}
                        onChange={(e) => setFilters({ search: e.target.value })}
                        data-testid="search-input"
                        />
                    </div>

                    {/* Filters toggle */}
                    <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all",
                    showFilters || activeFiltersCount > 0
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                    data-testid="toggle-filters"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="bg-primary-foreground/20 text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    {/* Export */}
                    <div className="relative">
                        <button
                        onClick={() => setExportMenuOpen(!exportMenuOpen)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all"
                        data-testid="export-button"
                        >
                            <Download className="w-4 h-4" />
                            Export
                            <ChevronDown className="w-3 h-3" />
                        </button>
                        <AnimatePresence>
                            {exportMenuOpen && (
                                <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-1 bg-card border border-card-border rounded-xl shadow-lg py-1 z-10 min-w-30"
                                >
                                    <button
                                        onClick={handleExportCSV}
                                        className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                                        data-testid="export-csv"
                                    >
                                        Export CSV
                                    </button>
                                    <button
                                        onClick={handleExportJSON}
                                        className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
                                        data-testid="export-json"
                                    >
                                        Export JSON
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Add (admin only) */}
                    {role === "admin" && (
                        <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setEditTx(null);
                            setModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
                        data-testid="add-transaction-button"
                        >
                            <Plus className="w-4 h-4" />
                            Add Transaction
                        </motion.button>
                    )}
                </div>

                {/* Expanded Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                        >
                            <div className="pt-4 border-t border-border mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                {/* Type */}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Type</label>
                                    <select
                                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        value={filters.type}
                                        onChange={(e) => setFilters({ type: e.target.value as any })}
                                        data-testid="filter-type"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>
                                {/* Category */}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
                                    <select
                                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    value={filters.category}
                                    onChange={(e) => setFilters({ category: e.target.value })}
                                    data-testid="filter-category"
                                    >
                                        {categoryOptions.map((o) => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Date From */}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">From</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        value={filters.dateFrom}
                                        onChange={(e) => setFilters({ dateFrom: e.target.value })}
                                        data-testid="filter-date-from"
                                    />
                                </div>
                                {/* Date To */}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">To</label>
                                    <input
                                    type="date"
                                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters({ dateTo: e.target.value })}
                                    data-testid="filter-date-to"
                                    />
                                </div>
                                {/* Reset */}
                                    <div className="flex items-end">
                                        <button
                                        onClick={resetFilters}
                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
                                        data-testid="reset-filters"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                            Reset
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Summary row */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Showing", value: `${filteredTransactions.length} transactions`, color: "text-foreground" },
                    { label: "Total Income", value: formatCurrency(totalIncome), color: "text-emerald-600 dark:text-emerald-400" },
                    { label: "Total Expenses", value: formatCurrency(totalExpenses), color: "text-red-500" },
                ].map((item) => (
                    <div key={item.label} className="bg-card border border-card-border rounded-xl px-4 py-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                        <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors text-left" onClick={() => toggleSort("description")}>
                        Description
                        {filters.sortBy === "description" ? (
                            filters.sortOrder === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        ) : null}
                    </button>
                    <span>Category</span>
                    <span>Type</span>
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort("date")}>
                        Date
                        {filters.sortBy === "date" ? (
                            filters.sortOrder === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        ) : null}
                    </button>
                    <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort("amount")}>
                        Amount
                        {filters.sortBy === "amount" ? (
                            filters.sortOrder === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                        ) : null}
                    </button>
                </div>

                {/* Rows */}
                {filteredTransactions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-16 text-center"
                        data-testid="empty-transactions"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                            <Search className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-foreground font-medium">No transactions found</p>
                        <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                        <button
                        onClick={resetFilters}
                        className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                ) : (
                    <div className="divide-y divide-border">
                        <AnimatePresence initial={false}>
                            {filteredTransactions.map((tx, i) => {
                                const config = categoryConfig[tx.category];
                                return (
                                    <motion.div
                                        key={tx.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 8 }}
                                        transition={{ delay: Math.min(i * 0.02, 0.3) }}
                                        className="group hover:bg-muted/30 transition-colors"
                                        data-testid={`transaction-row-${tx.id}`}
                                    >
                                        {/* Mobile layout */}
                                        <div className="md:hidden flex items-center gap-3 px-4 py-3.5">
                                            <div
                                            className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-semibold", config.bgColor)}
                                            style={{ color: config.color }}
                                            >
                                                {tx.description.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-muted-foreground">{formatDate(tx.date)}</span>
                                                    <span className="text-xs text-muted-foreground">•</span>
                                                    <span className="text-xs text-muted-foreground">{config.label}</span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className={cn("text-sm font-semibold", tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>
                                                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                                                </p>
                                                {role === "admin" && (
                                                    <div className="flex items-center gap-1 justify-end mt-1">
                                                        <button onClick={() => handleEdit(tx)} className="p-1 rounded hover:bg-muted transition-colors" data-testid={`edit-tx-${tx.id}`}>
                                                            <Edit2 className="w-3 h-3 text-muted-foreground" />
                                                        </button>
                                                        <button onClick={() => setDeleteConfirm(tx.id)} className="p-1 rounded hover:bg-muted transition-colors" data-testid={`delete-tx-${tx.id}`}>
                                                            <Trash2 className="w-3 h-3 text-muted-foreground" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Desktop layout */}
                                        <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div
                                                className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-semibold", config.bgColor)}
                                                style={{ color: config.color }}
                                                >
                                                    {tx.description.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                                                    {tx.merchant && (
                                                        <p className="text-xs text-muted-foreground truncate">{tx.merchant}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", config.bgColor)} style={{ color: config.color }}>
                                                {config.label}
                                            </span>
                                            <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full capitalize",
                                            tx.type === "income"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            )}>
                                                {tx.type}
                                            </span>
                                            <span className="text-sm text-muted-foreground">{formatDate(tx.date)}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className={cn("text-sm font-semibold", tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>
                                                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                                                    </span>
                                                    {role === "admin" && (
                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEdit(tx)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" data-testid={`edit-tx-${tx.id}`}>
                                                                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                            </button>
                                                            <button onClick={() => setDeleteConfirm(tx.id)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" data-testid={`delete-tx-${tx.id}`}>
                                                                <Trash2 className="w-3.5 h-3.5 text-destructive/70" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Delete Confirm Dialog */}
                <AnimatePresence>
                    {deleteConfirm && (
                    <>
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50"
                        onClick={() => setDeleteConfirm(null)}
                        />
                        <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div className="bg-card border border-card-border rounded-2xl shadow-2xl p-6 max-w-sm w-full pointer-events-auto" data-testid="delete-confirm-dialog">
                                <h3 className="text-base font-semibold text-foreground mb-2">Delete Transaction?</h3>
                                <p className="text-sm text-muted-foreground mb-5">This action cannot be undone. The transaction will be permanently removed.</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                                        data-testid="cancel-delete"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDelete(deleteConfirm)}
                                        className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
                                        data-testid="confirm-delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <TransactionModal
                isOpen={modalOpen}
                onClose={() => {
                setModalOpen(false);
                setEditTx(null);
                }}
                editTransaction={editTx}
            />
        </motion.div>
    );
}
