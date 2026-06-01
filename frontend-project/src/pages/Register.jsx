import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Package, User, Lock, UserPlus, Eye, EyeOff } from 'lucide-react'

const Register = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.username || !formData.password) {
            toast.error('Please fill in all fields')
            return
        }

        if (formData.username.length < 3) {
            toast.error('Username must be at least 3 characters long')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const response = await axios.post('/api/auth/register', {
                username: formData.username,
                password: formData.password
            })

            if (response.data.success) {
                toast.success('Registration successful! Please login.')
                navigate('/login')
            }
        } catch (error) {
            console.error('Registration error:', error)
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
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
                        <p className="text-muted-foreground mt-2">Create New Account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Username *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    placeholder="Enter username (min 3 characters)"
                                    disabled={loading}
                                    autoComplete="off"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Username must be at least 3 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    placeholder="Enter password (min 6 characters)"
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
                            <p className="text-xs text-muted-foreground mt-1">
                                Password must be at least 6 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                                    placeholder="Confirm your password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-5 w-5" />
                                    <span>Register</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register