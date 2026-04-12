import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Button } from '../ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TransactionsPaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

export default function TransactionsPagination({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
}: TransactionsPaginationProps) {
    return (
        <div className="bg-white border-t p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Items per page:</span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => onItemsPerPageChange(Number(value))}
                    >
                        <SelectTrigger className="w-20" size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-slate-600 text-sm">
                    {totalItems === 0
                        ? 'Showing 0 of 0'
                        : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                              currentPage * itemsPerPage,
                              totalItems
                          )} of ${totalItems}`}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-1">
                        <Button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            variant="outline"
                            size="sm"
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            size="sm"
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
