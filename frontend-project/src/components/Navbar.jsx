import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    Package,
    Warehouse,
    ArrowLeftRight,
    BarChart3,
    LayoutDashboard,
    LogOut,
    Sun,
    Moon
} from 'lucide-react'

const Navbar = ({ toggleTheme, isDark }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout, user } = useAuth()

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/products', label: 'Products', icon: Package },
        { path: '/warehouses', label: 'Warehouses', icon: Warehouse },
        { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
        { path: '/reports', label: 'Reports', icon: BarChart3 },
    ]

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav className="bg-card border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <Package className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl text-foreground">StockHub</span>
                        </Link>

                        <div className="hidden md:flex space-x-1">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const isActive = location.pathname === item.path
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-foreground">{user?.username}</p>
                                <p className="text-xs text-muted-foreground">Store Manager</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex justify-around py-2 border-t border-border">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center p-2 rounded-md transition-colors
                  ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs mt-1">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

export default Navbar