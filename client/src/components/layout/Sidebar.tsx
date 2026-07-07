import { LayoutDashboard, Wallet, CreditCard, ChartPie, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn, Separator } from '../ui';
import { motion } from 'motion/react';

interface SidebarProps {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { id: 'dashboard', path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'accounts', path: '/accounts', icon: Wallet, label: 'Accounts' },
        { id: 'transactions', path: '/transactions', icon: CreditCard, label: 'Transactions' },
        { id: 'analytics', path: '/analytics', icon: ChartPie, label: 'Analytics' },
    ];

    const bottomItems = [{ path: '/settings', icon: Settings, label: 'Settings' }];

    const isActive = (path: string) => {
        if (path === '/') return currentPath === '/';
        return currentPath.startsWith(path);
    };

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isOpen ? 250 : 0,
                opacity: isOpen ? 1 : 0,
            }}
            transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
            }}
            className="bg-slate-900 text-white flex flex-col overflow-hidden shrink-0 sticky top-0 h-screen overflow-y-auto"
            style={{ height: '100vh' }}
        >
            <div className="p-4 border-b border-slate-700" style={{ minWidth: '250px' }}>
                <h4 className="text-lg font-semibold m-0">Finance-Tracker</h4>
            </div>

            <nav className="flex-1 p-3" style={{ minWidth: '250px' }}>
                <ul className="flex flex-col gap-2 list-none p-0 m-0">
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.path}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 rounded-md transition-colors no-underline whitespace-nowrap',
                                    isActive(item.path)
                                        ? 'text-white bg-blue-600 font-medium'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-3" style={{ minWidth: '250px' }}>
                <Separator className="mb-3 bg-slate-700" />
                <ul className="flex flex-col gap-2 list-none p-0 m-0">
                    {bottomItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-2 rounded-md transition-colors no-underline whitespace-nowrap',
                                    isActive(item.path)
                                        ? 'text-white bg-blue-600 font-medium'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-red-400 
                            hover:bg-slate-800 hover:text-red-300 no-underline"
                        >
                            <LogOut size={20} />
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </motion.aside>
    );
}
