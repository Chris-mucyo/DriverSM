import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Download, Calendar, FileText } from 'lucide-react'
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const Reports = () => {
    const [reportType, setReportType] = useState('daily')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [year, setYear] = useState(new Date().getFullYear())
    const [reportData, setReportData] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchReport = async () => {
        setLoading(true)
        try {
            let response
            if (reportType === 'daily') {
                response = await axios.get(`/api/reports/daily?date=${date}`)
            } else if (reportType === 'weekly') {
                response = await axios.get('/api/reports/weekly')
            } else {
                response = await axios.get(`/api/reports/monthly?month=${month}&year=${year}`)
            }
            setReportData(response.data.data)
            toast.success('Report generated successfully')
        } catch (error) {
            toast.error('Failed to generate report')
        } finally {
            setLoading(false)
        }
    }

    const downloadReport = () => {
        if (!reportData) return
        const dataStr = JSON.stringify(reportData, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        const exportFileDefaultName = `${reportType}_report_${Date.now()}.json`
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>

            {/* Report Controls */}
            <div className="bg-card rounded-lg p-6 border border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Report Type</label>
                        <select
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="daily">Daily Report</option>
                            <option value="weekly">Weekly Report</option>
                            <option value="monthly">Monthly Report</option>
                        </select>
                    </div>

                    {reportType === 'daily' && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    )}

                    {reportType === 'monthly' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Month</label>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                        <option key={m} value={m}>{new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Year</label>
                                <input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={fetchReport}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <FileText className="h-5 w-5" />
                        <span>{loading ? 'Generating...' : 'Generate Report'}</span>
                    </button>

                    {reportData && (
                        <button
                            onClick={downloadReport}
                            className="flex items-center space-x-2 px-4 py-2 border border-input rounded-md text-foreground hover:bg-accent transition-colors"
                        >
                            <Download className="h-5 w-5" />
                            <span>Download</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Report Display */}
            {reportData && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-card rounded-lg p-6 border border-border">
                            <p className="text-muted-foreground text-sm">Total Stock In</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {reportData.summary?.totalStockIn || reportData.totalStockIn || 0}
                            </p>
                        </div>
                        <div className="bg-card rounded-lg p-6 border border-border">
                            <p className="text-muted-foreground text-sm">Total Stock Out</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">
                                {reportData.summary?.totalStockOut || reportData.totalStockOut || 0}
                            </p>
                        </div>
                        <div className="bg-card rounded-lg p-6 border border-border">
                            <p className="text-muted-foreground text-sm">Available Stock</p>
                            <p className="text-2xl font-bold text-primary mt-1">
                                {reportData.summary?.availableStock || 0}
                            </p>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    {reportData.transactions && reportData.transactions.length > 0 && (
                        <div className="bg-card rounded-lg p-6 border border-border">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Transactions</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">Product</th>
                                        <th className="px-4 py-2 text-left">Warehouse</th>
                                        <th className="px-4 py-2 text-left">Quantity</th>
                                        <th className="px-4 py-2 text-left">Type</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reportData.transactions.map((transaction, idx) => (
                                        <tr key={idx} className="border-b border-border">
                                            <td className="px-4 py-2">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-2">{transaction.product?.productName || transaction.productCode}</td>
                                            <td className="px-4 py-2">{transaction.warehouse?.warehouseName || transaction.warehouseCode}</td>
                                            <td className="px-4 py-2">{transaction.quantityMoved}</td>
                                            <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              transaction.transactionType === 'IN' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {transaction.transactionType === 'IN' ? 'Stock In' : 'Stock Out'}
                          </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Weekly Chart */}
                    {reportType === 'weekly' && reportData.dailyStats && (
                        <div className="bg-card rounded-lg p-6 border border-border">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Weekly Overview</h2>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={Object.entries(reportData.dailyStats).map(([date, stats]) => ({
                                    date,
                                    'Stock In': stats.stockIn,
                                    'Stock Out': stats.stockOut
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Stock In" fill="#22c55e" />
                                    <Bar dataKey="Stock Out" fill="#ef4444" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Reports