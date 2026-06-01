import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Download, Calendar, FileText, Package, TrendingUp, TrendingDown } from 'lucide-react'

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

            // Ensure the response has all required data
            const data = response.data.data
            setReportData({
                ...data,
                summary: {
                    totalStockIn: data.summary?.totalStockIn || data.totalStockIn || 0,
                    totalStockOut: data.summary?.totalStockOut || data.totalStockOut || 0,
                    availableStock: data.summary?.availableStock || 0,
                    totalTransactions: data.summary?.totalTransactions || data.transactions?.length || 0
                }
            })
            toast.success('Report generated successfully')
        } catch (error) {
            console.error('Report error:', error)
            toast.error(error.response?.data?.message || 'Failed to generate report')
        } finally {
            setLoading(false)
        }
    }

    const downloadCSV = () => {
        if (!reportData || !reportData.transactions) return

        // Create CSV content
        const headers = ['Date', 'Product Code', 'Product Name', 'Warehouse', 'Quantity', 'Type']
        const rows = reportData.transactions.map(t => [
            new Date(t.transactionDate).toLocaleString(),
            t.productCode,
            t.product?.productName || 'N/A',
            t.warehouse?.warehouseName || 'N/A',
            t.quantityMoved,
            t.transactionType === 'IN' ? 'Stock In' : 'Stock Out'
        ])

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${reportType}_report_${Date.now()}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success('Report downloaded successfully')
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Inventory Reports</h1>

            {/* Report Generation Form */}
            <div className="bg-card rounded-lg p-6 border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Generate Report</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                            <label className="block text-sm font-medium text-foreground mb-2">Select Date</label>
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
                                    {['January', 'February', 'March', 'April', 'May', 'June',
                                        'July', 'August', 'September', 'October', 'November', 'December'].map((m, idx) => (
                                        <option key={idx} value={idx + 1}>{m}</option>
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

                <button
                    onClick={fetchReport}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    <FileText className="h-5 w-5" />
                    <span>{loading ? 'Generating...' : 'Generate Report'}</span>
                </button>
            </div>

            {/* Report Results */}
            {reportData && (
                <div className="space-y-6">
                    {/* Summary Cards - Showing Available Stock, Stock In, Stock Out */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-card rounded-lg p-6 border border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm">Available Stock</p>
                                    <p className="text-3xl font-bold text-primary mt-2">{reportData.summary.availableStock}</p>
                                </div>
                                <Package className="h-12 w-12 text-primary opacity-50" />
                            </div>
                        </div>

                        <div className="bg-card rounded-lg p-6 border border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm">Total Stock In</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{reportData.summary.totalStockIn}</p>
                                </div>
                                <TrendingUp className="h-12 w-12 text-green-600 opacity-50" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Units received</p>
                        </div>

                        <div className="bg-card rounded-lg p-6 border border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted-foreground text-sm">Total Stock Out</p>
                                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{reportData.summary.totalStockOut}</p>
                                </div>
                                <TrendingDown className="h-12 w-12 text-red-600 opacity-50" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Units dispatched</p>
                        </div>
                    </div>

                    {/* Report Period Info */}
                    <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-foreground">
                            <strong>Report Period:</strong> {reportData.startDate && reportData.endDate ?
                            `${reportData.startDate} to ${reportData.endDate}` :
                            reportData.date || `${month}/${year}`}
                        </p>
                        <p className="text-sm text-foreground mt-1">
                            <strong>Total Transactions:</strong> {reportData.summary.totalTransactions}
                        </p>
                    </div>

                    {/* Transactions List */}
                    {reportData.transactions && reportData.transactions.length > 0 ? (
                        <div className="bg-card rounded-lg border border-border overflow-hidden">
                            <div className="px-6 py-4 bg-muted border-b border-border">
                                <h3 className="font-semibold text-foreground">Transaction Details</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Date & Time</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Warehouse</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reportData.transactions.map((transaction, idx) => (
                                        <tr key={idx} className="border-b border-border hover:bg-muted/30">
                                            <td className="px-4 py-3 text-sm text-foreground">
                                                {new Date(transaction.transactionDate).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-foreground">
                                                {transaction.product?.productName || transaction.productCode}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-foreground">
                                                {transaction.warehouse?.warehouseName || transaction.warehouseCode}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-foreground">{transaction.quantityMoved}</td>
                                            <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              transaction.transactionType === 'IN'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
                    ) : (
                        <div className="bg-card rounded-lg p-8 text-center border border-border">
                            <p className="text-muted-foreground">No transactions found for this period</p>
                        </div>
                    )}

                    {/* Download Button */}
                    {reportData.transactions && reportData.transactions.length > 0 && (
                        <div className="flex justify-end">
                            <button
                                onClick={downloadCSV}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                                <Download className="h-5 w-5" />
                                <span>Download Report (CSV)</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Help Text */}
            {!reportData && !loading && (
                <div className="bg-muted/50 rounded-lg p-8 text-center border border-border">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                        Select report type and period, then click "Generate Report" to view stock movement summary.<br/>
                        Reports include available stock, stock in, and stock out metrics.
                    </p>
                </div>
            )}
        </div>
    )
}

export default Reports