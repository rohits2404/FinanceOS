import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { type Transaction, type TransactionCategory } from "../../data/mockData";
import { cn } from "../../lib/utils";
import { CategorySelect } from "./category-select";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    editTransaction?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, editTransaction }: TransactionModalProps) {
  
    const { addTransaction, updateTransaction } = useApp();
    const isEdit = !!editTransaction;

    const [form, setForm] = useState({
        description: "",
        amount: "",
        category: "food" as TransactionCategory,
        type: "expense" as "income" | "expense",
        date: new Date().toISOString().split("T")[0],
        merchant: "",
        notes: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editTransaction) {
            setForm({
                description: editTransaction.description,
                amount: String(editTransaction.amount),
                category: editTransaction.category,
                type: editTransaction.type,
                date: editTransaction.date,
                merchant: editTransaction.merchant || "",
                notes: editTransaction.notes || "",
            });
        } else {
            setForm({
                description: "",
                amount: "",
                category: "food",
                type: "expense",
                date: new Date().toISOString().split("T")[0],
                merchant: "",
                notes: "",
            });
        }
        setErrors({});
    }, [editTransaction, isOpen]);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.description.trim()) e.description = "Description is required";
        if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
        e.amount = "Enter a valid positive amount";
        if (!form.date) e.date = "Date is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const txData = {
            description: form.description.trim(),
            amount: parseFloat(form.amount),
            category: form.category,
            type: form.type,
            date: form.date,
            merchant: form.merchant.trim() || undefined,
            notes: form.notes.trim() || undefined,
        };

        if (isEdit && editTransaction) {
            updateTransaction({ ...txData, id: editTransaction.id });
        } else {
            addTransaction(txData);
        }
        onClose();
    };

    const inputClass = (field: string) => cn(
        "w-full px-3 py-2.5 rounded-xl border text-sm bg-background text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all",
        errors[field] ? "border-destructive" : "border-border"
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                        className="bg-card border border-card-border rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                        data-testid="transaction-modal"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                                <h2 className="text-base font-semibold text-foreground">
                                    {isEdit ? "Edit Transaction" : "Add Transaction"}
                                </h2>
                                <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                data-testid="modal-close"
                                >
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                {/* Type toggle */}
                                <div className="flex rounded-xl border border-border overflow-hidden">
                                    {(["expense", "income"] as const).map((t) => (
                                        <button
                                        key={t}
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                                        data-testid={`type-toggle-${t}`}
                                        className={cn(
                                            "flex-1 py-2.5 text-sm font-medium capitalize transition-all",
                                            form.type === t
                                            ? t === "income"
                                                ? "bg-emerald-500 text-white"
                                                : "bg-destructive text-white"
                                            : "text-muted-foreground hover:bg-muted"
                                        )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                        Description *
                                    </label>
                                    <input
                                        className={inputClass("description")}
                                        value={form.description}
                                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                        placeholder="e.g. Grocery Shopping"
                                        data-testid="input-description"
                                    />
                                    {errors.description && (
                                        <p className="text-xs text-destructive mt-1">{errors.description}</p>
                                    )}
                                </div>

                                {/* Amount + Date */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                            Amount *
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                            <input
                                            className={cn(inputClass("amount"), "pl-6")}
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={form.amount}
                                            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                                            placeholder="0.00"
                                            data-testid="input-amount"
                                            />
                                        </div>
                                        {errors.amount && (
                                            <p className="text-xs text-destructive mt-1">{errors.amount}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                            Date *
                                        </label>
                                        <input
                                        type="date"
                                        className={inputClass("date")}
                                        value={form.date}
                                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                                        data-testid="input-date"
                                        />
                                        {errors.date && (
                                            <p className="text-xs text-destructive mt-1">{errors.date}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Category */}
                                <CategorySelect
                                value={form.category}
                                onChange={(val) =>
                                    setForm((f) => ({ ...f, category: val }))
                                }
                                />

                                {/* Merchant */}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                        Merchant (optional)
                                    </label>
                                    <input
                                        className={inputClass("merchant")}
                                        value={form.merchant}
                                        onChange={(e) => setForm((f) => ({ ...f, merchant: e.target.value }))}
                                        placeholder="e.g. Whole Foods"
                                        data-testid="input-merchant"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                        Notes (optional)
                                    </label>
                                    <textarea
                                        className={cn(inputClass("notes"), "resize-none")}
                                        rows={2}
                                        value={form.notes}
                                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                        placeholder="Any additional notes..."
                                        data-testid="input-notes"
                                    />
                                </div>

                                <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                                data-testid="submit-transaction"
                                >
                                    <Save className="w-4 h-4" />
                                    {isEdit ? "Save Changes" : "Add Transaction"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
