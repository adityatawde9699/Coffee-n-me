import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, PenSquare, Bookmark, Settings, LogOut, Coffee } from 'lucide-react';

export function AdminLayout() {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/write', icon: PenSquare, label: 'Write Blog' },
        { path: '/admin/bookmarks', icon: Bookmark, label: 'Bookmarks' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-[#3C2415] text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-[#5C3A21]">
                    <div className="flex items-center gap-2 text-[#D2691E]">
                        <Coffee className="h-8 w-8" />
                        <span className="text-xl font-bold font-serif">Coffee'n me</span>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                        Welcome, {user?.username}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-[#D2691E] text-white'
                                        : 'text-gray-300 hover:bg-[#5C3A21] hover:text-white'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#5C3A21]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-[#5C3A21] hover:text-white rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
