import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus } from 'lucide-react'

const Transactions = () => {
    const [transactions, setTransactions] = useState([])
    const [products, setProducts] = useState([])
    const [warehouses, setWarehouses] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)
    const [formData, setFormData] = useState({
        productCode: '',
        warehouseCode: '',
        quantityMoved: '',
        transactionType: 'IN',
        transactionDate: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [transactionsRes, productsRes, warehousesRes] = await Promise.all([
                axios.get('/api/transactions'),
                axios.get('/api/products'),
                axios.get('/api/warehouses')
            ])
            setTransactions(transactionsRes.data.data)
            setProducts(productsRes.data.data)
            setWarehouses(warehousesRes.data.data)
            setLoading(false)
        } catch (error) {
            toast.error('Failed to fetch data')
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingTransaction) {
                await axios.put(`/api/transactions/${editingTransaction.transactionId}`, formData)
                toast.success('Transaction updated successfully')
            } else {
                await axios.post('/api/transactions', formData)
                toast.success('Transaction created successfully')
            }
            fetchData()
            closeModal()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed')
        }
    }

    const handleDelete = async (transaction) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await axios.delete(`/api/transactions/${transaction.transactionId}`)
                toast.success('Transaction deleted successfully')
                fetchData()
            } catch (error) {
                toast.error('Failed to delete transaction')
            }
        }
    }

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction)
        setFormData({
            productCode: transaction.productCode,
            warehouseCode: transaction.warehouseCode,
            quantityMoved: transaction.quantityMoved,
            transactionType: transaction.transactionType,
            transactionDate: transaction.transactionDate.split('T')[0]
        })
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingTransaction(null)
        setFormData({
            productCode: '',
            warehouseCode: '',
            quantityMoved: '',
            transactionType: 'IN',
            transactionDate: ''
        })
    }

    const columns = [
        { key: 'transactionId', label: 'ID' },
        { key: 'transactionDate', label: 'Date', render: (value) => new Date(value).toLocaleString() },
        { key: 'product', label: 'Product', render: (value) => value?.productName || 'N/A' },
        { key: 'warehouse', label: 'Warehouse', render: (value) => value?.warehouseName || 'N/A' },
        { key: 'quantityMoved', label: 'Quantity' },
        { key: 'transactionType', label: 'Type', render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    value === 'IN' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
        {value === 'IN' ? 'Stock In' : 'Stock Out'}
      </span>
            ) }
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">Stock Transactions</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Transaction</span>
                </button>
            </div>

            <DataTable
                columns={columns}
                data={transactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Product *</label>
                        <select
                            value={formData.productCode}
                            onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map(product => (
                                <option key={product.productCode} value={product.productCode}>
                                    {product.productName} (Stock: {product.quantityInStock})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Warehouse *</label>
                        <select
                            value={formData.warehouseCode}
                            onChange={(e) => setFormData({ ...formData, warehouseCode: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        >
                            <option value="">Select Warehouse</option>
                            {warehouses.map(warehouse => (
                                <option key={warehouse.warehouseCode} value={warehouse.warehouseCode}>
                                    {warehouse.warehouseName} - {warehouse.warehouseLocation}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Transaction Type *</label>
                        <select
                            value={formData.transactionType}
                            onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        >
                            <option value="IN">Stock In (Receive)</option>
                            <option value="OUT">Stock Out (Dispatch)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Quantity *</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.quantityMoved}
                            onChange={(e) => setFormData({ ...formData, quantityMoved: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Transaction Date</label>
                        <input
                            type="date"
                            value={formData.transactionDate}
                            onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 border border-input rounded-md text-foreground hover:bg-accent transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            {editingTransaction ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Transactions