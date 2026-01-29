import { Menu, Bell, Search, ChevronDown, User, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import clsx from 'clsx';

const Header = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get current page title
    const getPageTitle = (pathname) => {
        const path = pathname.split('/').filter(Boolean).pop();
        if (!path) return 'Dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    };

    return (
        <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30 px-4lg:px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 mr-4 text-primary hover:bg-gray-200 rounded-md transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Breadcrumbs */}
                <div className="hidden sm:flex flex-col p-2">
                    <h2 className="text-xl font-bold text-primary leading-tight">
                        {getPageTitle(location.pathname)}
                    </h2>
                    <nav className="flex items-center space-x-2 text-xs text-gray-400 mt-0.5">
                        <Link to="/dashboard" className="hover:text-primary transition-colors">Home</Link>
                        {location.pathname.split('/').filter(Boolean).map((path, index, array) => (
                            <div key={path} className="flex items-center">
                                <span className="mx-1">/</span>
                                <span
                                    className={clsx(
                                        "capitalize",
                                        index === array.length - 1 ? "text-secondary font-medium" : "hover:text-primary transition-colors cursor-pointer"
                                    )}
                                // Make intermediate crumbs clickable if needed (logic can be added)
                                >
                                    {path.replace(/-/g, ' ')}
                                </span>
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Search - Hidden on mobile for now */}
                <div className="hidden md:flex relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
                    />
                </div>

                <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-3 p-1.5 pl-3 border border-gray-200 rounded-full hover:bg-white hover:shadow-sm transition-all bg-white/50"
                    >
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-semibold text-primary leading-tight">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.role}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md">
                            {user?.name?.charAt(0) || <User className="w-4 h-4" />}
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden animation-fade-in-up origin-top-right">
                            <div className="px-4 py-3 border-b border-gray-50 md:hidden">
                                <p className="text-sm font-semibold text-primary">{user?.name}</p>
                                <p className="text-xs text-secondary">{user?.email}</p>
                            </div>
                            <button
                                className="flex items-center w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </button>
                            <div className="h-px bg-gray-50 my-1"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
