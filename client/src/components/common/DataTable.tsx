import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, cn } from '../ui';
import { CheckSquare, Square } from 'lucide-react';
import type { ReactNode } from 'react';
import { motion } from 'motion/react';

export interface ColumnDef<T> {
    key: string;
    header: string | ReactNode;
    render: (item: T) => ReactNode;
    className?: string;
    headerClassName?: string;
}

export interface DataTableAction<T> {
    label: string;
    icon?: ReactNode;
    onClick: (item: T) => void;
    variant?: 'default' | 'outline' | 'destructive' | 'ghost' | 'link' | 'secondary';
    className?: string;
    title?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    keyExtractor: (item: T) => string | number;

    // Selection
    selectable?: boolean;
    selectedKeys?: Set<string | number>;
    onToggleSelect?: (key: string | number) => void;
    onToggleSelectAll?: () => void;

    // Actions
    actions?: DataTableAction<T>[];
    actionsHeader?: string;
    actionsClassName?: string;

    // Empty state
    emptyState?: ReactNode;
    emptyStateMessage?: string;
    emptyStateIcon?: ReactNode;

    // Row styling
    getRowClassName?: (item: T) => string;

    // Animation
    animated?: boolean;
    animationDelay?: number;

    // Other
    className?: string;
}

export default function DataTable<T>({
    data,
    columns,
    keyExtractor,
    selectable = false,
    selectedKeys = new Set(),
    onToggleSelect,
    onToggleSelectAll,
    actions,
    actionsHeader = 'Actions',
    actionsClassName = 'w-32 text-center',
    emptyState,
    emptyStateMessage = 'No data available',
    emptyStateIcon,
    getRowClassName,
    animated = false,
    animationDelay = 0,
    className,
}: DataTableProps<T>) {
    const allSelected = data.length > 0 && selectedKeys.size === data.length;
    const hasActions = actions && actions.length > 0;

    return (
        <div className={cn('rounded-md border', className)}>
            <Table>
                <TableHeader>
                    <TableRow>
                        {selectable && (
                            <TableHead className="w-10">
                                <Button
                                    onClick={onToggleSelectAll}
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0"
                                >
                                    {allSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                </Button>
                            </TableHead>
                        )}
                        {columns.map((column) => (
                            <TableHead key={column.key} className={column.headerClassName}>
                                {column.header}
                            </TableHead>
                        ))}
                        {hasActions && (
                            <TableHead className={actionsClassName}>{actionsHeader}</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={
                                    columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0)
                                }
                                className="text-center py-12"
                            >
                                {emptyState || (
                                    <div className="flex flex-col items-center">
                                        {emptyStateIcon && (
                                            <div className="mb-3">{emptyStateIcon}</div>
                                        )}
                                        <p className="text-slate-600 mb-0">{emptyStateMessage}</p>
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, index) => {
                            const key = keyExtractor(item);
                            const isSelected = selectedKeys.has(key);
                            const rowClassName = getRowClassName ? getRowClassName(item) : '';

                            const RowComponent = animated ? motion.tr : 'tr';
                            const rowProps = animated
                                ? {
                                      initial: { opacity: 0, x: -20 },
                                      animate: { opacity: 1, x: 0 },
                                      transition: {
                                          delay: animationDelay + index * 0.05,
                                          duration: 0.3,
                                      },
                                  }
                                : {};

                            return (
                                <RowComponent
                                    key={key}
                                    className={cn(
                                        isSelected && selectable ? 'bg-slate-100' : '',
                                        'border-b hover:bg-slate-50',
                                        rowClassName
                                    )}
                                    {...rowProps}
                                >
                                    {selectable && (
                                        <TableCell>
                                            <Button
                                                onClick={() => onToggleSelect?.(key)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0"
                                            >
                                                {isSelected ? (
                                                    <CheckSquare size={18} />
                                                ) : (
                                                    <Square size={18} />
                                                )}
                                            </Button>
                                        </TableCell>
                                    )}
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${key}-${column.key}`}
                                            className={column.className}
                                        >
                                            {column.render(item)}
                                        </TableCell>
                                    ))}
                                    {hasActions && (
                                        <TableCell>
                                            <div className="flex justify-center gap-1">
                                                {actions.map((action, actionIndex) => (
                                                    <Button
                                                        key={actionIndex}
                                                        onClick={() => action.onClick(item)}
                                                        variant={action.variant || 'outline'}
                                                        size="sm"
                                                        title={action.title || action.label}
                                                        className={action.className}
                                                    >
                                                        {action.icon || action.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </TableCell>
                                    )}
                                </RowComponent>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
