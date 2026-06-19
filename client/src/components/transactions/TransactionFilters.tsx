import { mockAccountsSimple } from '../../data';
import { type Transaction } from '../../types';
import { ArrowUpDown, X } from 'lucide-react';
import { Search } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Button,
    Label,
    Input,
    Card,
    CardContent,
} from '../ui';

type SortOption = 'date' | 'amount' | 'category' | 'description';

interface TransactionFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filterType: Transaction['type'] | 'All';
    onFilterTypeChange: (type: Transaction['type'] | 'All') => void;
    filterCategory: string;
    onFilterCategoryChange: (category: string) => void;
    filterAccount: number | 'All';
    onFilterAccountChange: (account: number | 'All') => void;
    dateRange: { start: string; end: string };
    onDateRangeChange: (range: { start: string; end: string }) => void;
    sortBy: SortOption;
    onSortByChange: (sortBy: SortOption) => void;
    sortDirection: 'asc' | 'desc';
    onSortDirectionChange: (direction: 'asc' | 'desc') => void;
    allCategories: string[];
    hasActiveFilters: boolean;
    onClearFilters: () => void;
}

export default function TransactionFilters({
    searchQuery,
    onSearchChange,
    filterType,
    onFilterTypeChange,
    filterCategory,
    onFilterCategoryChange,
    filterAccount,
    onFilterAccountChange,
    dateRange,
    onDateRangeChange,
    sortBy,
    onSortByChange,
    sortDirection,
    onSortDirectionChange,
    allCategories,
    hasActiveFilters,
    onClearFilters,
}: TransactionFiltersProps) {
    return (
        <Card className="mb-4">
            <CardContent className="pt-6 pb-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    {/* Search */}
                    <div className="lg:col-span-12">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                                size={18}
                            />
                            <Input
                                type="text"
                                className="pl-10"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Type Filter */}
                    <div className="lg:col-span-3">
                        <Label className="text-xs text-slate-600 mb-1">Type</Label>
                        <Select
                            value={filterType}
                            onValueChange={(value) =>
                                onFilterTypeChange(value as Transaction['type'] | 'All')
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Category Filter */}
                    <div className="lg:col-span-3">
                        <Label className="text-xs text-slate-600 mb-1">Category</Label>
                        <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Categories</SelectItem>
                                {allCategories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Account Filter */}
                    <div className="lg:col-span-3">
                        <Label className="text-xs text-slate-600 mb-1">Account</Label>
                        <Select
                            value={filterAccount.toString()}
                            onValueChange={(value) =>
                                onFilterAccountChange(value === 'All' ? 'All' : Number(value))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Accounts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Accounts</SelectItem>
                                {mockAccountsSimple.map((acc) => (
                                    <SelectItem key={acc.id} value={acc.id.toString()}>
                                        {acc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort By */}
                    <div className="lg:col-span-3">
                        <Label className="text-xs text-slate-600 mb-1">Sort By</Label>
                        <div className="flex gap-2">
                            <Select
                                value={sortBy}
                                onValueChange={(value) => onSortByChange(value as SortOption)}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="amount">Amount</SelectItem>
                                    <SelectItem value="category">Category</SelectItem>
                                    <SelectItem value="description">Description</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')
                                }
                            >
                                <ArrowUpDown size={18} />
                            </Button>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="lg:col-span-3">
                        <Label className="text-xs text-slate-600 mb-1">From Date</Label>
                        <Input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) =>
                                onDateRangeChange({ ...dateRange, start: e.target.value })
                            }
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <Label className="text-xs text-slate-600 mb-1">To Date</Label>
                        <Input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) =>
                                onDateRangeChange({ ...dateRange, end: e.target.value })
                            }
                        />
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <div className="lg:col-span-12">
                            <Button
                                onClick={onClearFilters}
                                variant="outline"
                                size="sm"
                                className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
                            >
                                <X size={16} />
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
