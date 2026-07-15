import { motion, AnimatePresence } from 'motion/react';
import { Tag, Trash2, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface BulkActionsBarProps {
    selectedCount: number;
    onChangeCategoryClick: () => void;
    onDeleteClick: () => void;
    onClearSelection: () => void;
}

export default function BulkActionsBar({
    selectedCount,
    onChangeCategoryClick,
    onDeleteClick,
    onClearSelection,
}: BulkActionsBarProps) {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <Card className="mb-4 border-blue-300">
                        <CardContent className="py-2">
                            <div className="flex items-center justify-between">
                                <div className="text-blue-700 font-medium">
                                    {selectedCount} transaction{selectedCount !== 1 ? 's' : ''}{' '}
                                    selected
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={onChangeCategoryClick}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                                    >
                                        <Tag size={16} />
                                        Change Category
                                    </Button>
                                    <Button
                                        onClick={onDeleteClick}
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 size={16} />
                                        Delete Selected
                                    </Button>
                                    <Button onClick={onClearSelection} variant="outline" size="sm">
                                        <X size={16} />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
