import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Package, Warehouse, ArrowLeftRight, TrendingUp, TrendingDown, PackageOpen } from 'lucide-react'
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalWarehouses: 0,
        totalTransactions: 0,
        totalStock: 0
    })
    const [recentTransactions, setRecentTransactions] = useState([])
    const [stockData, setStockData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [productsRes, warehousesRes, transactionsRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/warehouses'),
                axios.get('/api/transactions')
            ])

            const products = productsRes.data.data
            const warehouses = warehousesRes.data.data
            const transactions = transactionsRes.data.data

            const totalStock = products.reduce((sum, p) => sum + p.quantityInStock, 0)

            setStats({
                totalProducts: products.length,
                totalWarehouses: warehouses.length,
                totalTransactions: transactions.length,
                totalStock: totalStock
            })

            setRecentTransactions(transactions.slice(0, 5))

            // Prepare stock data for chart
            const stockByCategory = {}
            products.forEach(product => {
                if (stockByCategory[product.category]) {
                    stockByCategory[product.category] += product.quantityInStock
                } else {
                    stockByCategory[product.category] = product.quantityInStock
                }
            })

            const pieData = Object.entries(stockByCategory).map(([name, value]) => ({ name, value }))
            setStockData(pieData)

            setLoading(false)
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            setLoading(false)
        }
    }

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card rounded-lg p-6 border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm">Total Products</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{stats.totalProducts}</p>
                        </div>
                        <Package className="h-10 w-10 text-primary opacity-50" />
                    </div>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm">Total Warehouses</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{stats.totalWarehouses}</p>
                        </div>
                        <Warehouse className="h-10 w-10 text-primary opacity-50" />
                    </div>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm">Total Transactions</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{stats.totalTransactions}</p>
                        </div>
                        <ArrowLeftRight className="h-10 w-10 text-primary opacity-50" />
                    </div>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm">Total Stock</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{stats.totalStock}</p>
                        </div>
                        <PackageOpen className="h-10 w-10 text-primary opacity-50" />
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-lg p-6 border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Stock Distribution by Category</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stockData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {stockData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-card rounded-lg p-6 border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
                    <div className="space-y-3">
                        {recentTransactions.map((transaction, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <div>
                                    <p className="font-medium text-foreground">{transaction.product?.productName || 'N/A'}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(transaction.transactionDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {transaction.transactionType === 'IN' ? (
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                    ) : (
                                        <TrendingDown className="h-5 w-5 text-red-600" />
                                    )}
                                    <span className={`font-semibold ${transaction.transactionType === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.transactionType === 'IN' ? '+' : '-'}{transaction.quantityMoved}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard