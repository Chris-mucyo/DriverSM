import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, User, Lock, LogIn, Eye, EyeOff, UserPlus } from 'lucide-react'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!username || !password) {
            return
        }
        setLoading(true)
        const success = await login(username, password)
        setLoading(false)
        if (success) {
            navigate('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-lg shadow-xl p-8 border border-border">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                            <Package className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">StockHub Ltd</h1>
                        <p className="text-muted-foreground mt-2">Stock Management System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    placeholder="Enter your username"
                                    required
                                    disabled={loading}
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-5 w-5" />
                                    <span>Login</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                Don't have an account?
                            </p>
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center space-x-2 w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-200 font-medium"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span>Create New Account</span>
                            </Link>
                        </div>

                        <div className="mt-4 text-center text-xs text-muted-foreground">
                            <p>Demo credentials:</p>
                            <p>Username: admin | Password: admin123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login