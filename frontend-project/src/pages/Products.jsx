import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus } from 'lucide-react'

const Products = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [formData, setFormData] = useState({
        productCode: '',
        productName: '',
        category: '',
        quantityInStock: '',
        unitPrice: '',
        supplierName: '',
        dateReceived: ''
    })

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products')
            setProducts(response.data.data)
            setLoading(false)
        } catch (error) {
            toast.error('Failed to fetch products')
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct.productCode}`, formData)
                toast.success('Product updated successfully')
            } else {
                await axios.post('/api/products', formData)
                toast.success('Product created successfully')
            }
            fetchProducts()
            closeModal()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed')
        }
    }

    const handleDelete = async (product) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`/api/products/${product.productCode}`)
                toast.success('Product deleted successfully')
                fetchProducts()
            } catch (error) {
                toast.error('Failed to delete product')
            }
        }
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        setFormData({
            productCode: product.productCode,
            productName: product.productName,
            category: product.category,
            quantityInStock: product.quantityInStock,
            unitPrice: product.unitPrice,
            supplierName: product.supplierName,
            dateReceived: product.dateReceived.split('T')[0]
        })
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingProduct(null)
        setFormData({
            productCode: '',
            productName: '',
            category: '',
            quantityInStock: '',
            unitPrice: '',
            supplierName: '',
            dateReceived: ''
        })
    }

    const columns = [
        { key: 'productCode', label: 'Product Code' },
        { key: 'productName', label: 'Product Name' },
        { key: 'category', label: 'Category' },
        { key: 'quantityInStock', label: 'Stock Qty' },
        { key: 'unitPrice', label: 'Unit Price', render: (value) => `$${value}` },
        { key: 'supplierName', label: 'Supplier' },
        { key: 'dateReceived', label: 'Date Received', render: (value) => new Date(value).toLocaleDateString() }
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
                <h1 className="text-3xl font-bold text-foreground">Products</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Product</span>
                </button>
            </div>

            <DataTable
                columns={columns}
                data={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? 'Edit Product' : 'Add Product'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Product Code *</label>
                        <input
                            type="text"
                            value={formData.productCode}
                            onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                            disabled={!!editingProduct}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
                        <input
                            type="text"
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Quantity in Stock</label>
                        <input
                            type="number"
                            value={formData.quantityInStock}
                            onChange={(e) => setFormData({ ...formData, quantityInStock: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Unit Price *</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.unitPrice}
                            onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Supplier Name *</label>
                        <input
                            type="text"
                            value={formData.supplierName}
                            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Date Received</label>
                        <input
                            type="date"
                            value={formData.dateReceived}
                            onChange={(e) => setFormData({ ...formData, dateReceived: e.target.value })}
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
                            {editingProduct ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Products