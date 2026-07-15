import { Menu, X, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../ui/button';

interface PageHeaderProps {
    title: string;
    sidebarOpen: boolean;
    onToggleSidebar: () => void;
    userName?: string;
    actions?: ReactNode;
}

export default function Header({
    title,
    sidebarOpen,
    onToggleSidebar,
    userName = 'User',
    actions,
}: PageHeaderProps) {
    return (
        <header className="bg-white border-b p-3 flex items-center gap-3 flex-wrap">
            <Button variant="outline" size="icon" onClick={onToggleSidebar} className="shrink-0">
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            <h5 className="text-lg font-semibold m-0 flex-1">{title}</h5>

            {actions && <div className="flex items-center gap-2">{actions}</div>}

            {!actions && (
                <div className="flex items-center gap-2">
                    <span className="text-slate-600 hidden md:inline">
                        Welcome back, {userName}!
                    </span>
                    <div
                        className="bg-blue-600 text-white rounded-full flex items-center justify-center w-10 h-10 
                        shrink-0"
                    >
                        <User size={20} />
                    </div>
                </div>
            )}
        </header>
    );
}
