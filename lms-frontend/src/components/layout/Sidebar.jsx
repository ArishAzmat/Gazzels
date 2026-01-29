import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    LogOut,
    GraduationCap,
    BarChart3
} from 'lucide-react';
import clsx from 'clsx';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link
        to={to}
        className={clsx(
            "flex items-center px-6 py-3.5 text-sm font-medium transition-all duration-200 group relative",
            active
                ? "text-surface bg-primary-light border-r-4 border-highlight"
                : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
    >
        <Icon className={clsx("w-5 h-5 mr-3 transition-colors", active ? "text-highlight" : "text-gray-500 group-hover:text-white")} />
        <span>{label}</span>
        {active && (
            <div className="absolute inset-y-0 left-0 w-1 bg-highlight rounded-r-full shadow-[0_0_10px_2px_rgba(189,195,199,0.3)]" />
        )}
    </Link>
);

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isAdmin = user?.role === 'Admin';

    const adminLinks = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
        { icon: Users, label: 'Employees', to: '/admin/employees' },
        { icon: BookOpen, label: 'Courses', to: '/admin/courses' },
        { icon: Calendar, label: 'Assignments', to: '/admin/assignments' },
        { icon: BarChart3, label: 'Reports', to: '/admin/reports' },
    ];

    const employeeLinks = [
        { icon: LayoutDashboard, label: 'My Dashboard', to: '/dashboard' },
        { icon: GraduationCap, label: 'My Trainings', to: '/my-trainings' },
    ];

    const links = isAdmin ? adminLinks : employeeLinks;

    return (
        <>
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-40 w-72 bg-primary shadow-2xl transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col border-r border-white/5",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-20 flex items-center px-8 border-b border-white/10 bg-gradient-to-r from-primary to-primary-light">
                    <div className="p-2 bg-gradient-to-br from-secondary to-primary rounded-lg shadow-lg mr-3">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Gazelles LMS</span>
                </div>

                <nav className="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Menu
                    </div>
                    {links.map((link) => (
                        <SidebarItem
                            key={link.to}
                            {...link}
                            active={location.pathname === link.to}
                        />
                    ))}
                </nav>

                <div className="p-6 border-t border-white/10 bg-primary-light/50">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white/10">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
};

export default Sidebar;
