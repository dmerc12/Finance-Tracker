import { Download, FileText } from 'lucide-react';
import { Button, Badge, Separator } from '../ui';
import { useRef, useEffect } from 'react';

interface ExportMenuProps {
    isExporting: boolean;
    showExportMenu: boolean;
    selectedCount: number;
    filteredCount: number;
    onToggleMenu: () => void;
    onExportPDF: () => void;
    onExportCSV: () => void;
}

export default function ExportMenu({
    isExporting,
    showExportMenu,
    selectedCount,
    filteredCount,
    onToggleMenu,
    onExportPDF,
    onExportCSV,
}: ExportMenuProps) {
    const exportMenuRef = useRef<HTMLDivElement>(null);

    // Close export menu on outside click
    useEffect(() => {
        if (!showExportMenu) return;
        const handler = (e: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
                onToggleMenu();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showExportMenu, onToggleMenu]);

    return (
        <div className="relative" ref={exportMenuRef}>
            <Button
                variant="outline"
                disabled={isExporting}
                onClick={onToggleMenu}
                className="gap-2"
            >
                {isExporting ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900" />
                        <span className="hidden md:inline">Exporting…</span>
                    </>
                ) : (
                    <>
                        <Download size={18} />
                        <span className="hidden md:inline">
                            Export
                            {selectedCount > 0 && (
                                <Badge
                                    variant="default"
                                    className="ml-2 rounded-full px-2 py-0.5 text-xs"
                                >
                                    {selectedCount}
                                </Badge>
                            )}
                        </span>
                    </>
                )}
            </Button>
            {showExportMenu && (
                <div className="absolute top-full right-0 mt-1 z-50 min-w-52.5 bg-white rounded-md border shadow-md">
                    <div className="p-1">
                        <div className="px-2 py-1.5 text-xs text-slate-600">
                            {selectedCount > 0
                                ? `${selectedCount} selected transaction${selectedCount !== 1 ? 's' : ''}`
                                : `All ${filteredCount} filtered transaction${filteredCount !== 1 ? 's' : ''}`}
                        </div>
                        <Separator className="my-1" />
                        <button
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm 
                            hover:bg-slate-100 cursor-pointer"
                            onClick={onExportPDF}
                        >
                            <FileText size={16} />
                            Export as PDF
                        </button>
                        <button
                            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm 
                            hover:bg-slate-100 cursor-pointer"
                            onClick={onExportCSV}
                        >
                            <Download size={16} />
                            Export as CSV
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
