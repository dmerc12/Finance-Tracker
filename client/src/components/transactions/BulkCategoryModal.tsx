import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { allCategories } from '../../data';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Button,
} from '../ui';

interface BulkCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCount: number;
    onConfirm: (category: string) => void;
}

export default function BulkCategoryModal({
    open,
    onOpenChange,
    selectedCount,
    onConfirm,
}: BulkCategoryModalProps) {
    const [category, setCategory] = useState('');

    const handleConfirm = () => {
        if (!category) return;
        onConfirm(category);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent key={String(open)}>
                <DialogHeader>
                    <DialogTitle>Change Category</DialogTitle>
                    <DialogDescription>
                        Update the category for all selected transactions.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <p>
                        Select a new category for <strong>{selectedCount}</strong> selected
                        transaction{selectedCount !== 1 ? 's' : ''}:
                    </p>
                    <Select value={category} onValueChange={(value) => setCategory(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {allCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} disabled={!category}>
                        Update Category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
