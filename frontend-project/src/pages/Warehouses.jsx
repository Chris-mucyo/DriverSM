import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { Plus } from 'lucide-react'

const Warehouses = () => {
    const [warehouses, setWarehouses] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingWarehouse, setEditingWarehouse] = useState(null)
    const [formData, setFormData] = useState({
        warehouseCode: '',
        warehouseName: '',
        warehouseLocation: ''
    })

    useEffect(() => {
        fetchWarehouses()
    }, [])

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get('/api/warehouses')
            setWarehouses(response.data.data)
            setLoading(false)
        } catch (error) {
            toast.error('Failed to fetch warehouses')
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingWarehouse) {
                await axios.put(`/api/warehouses/${editingWarehouse.warehouseCode}`, formData)
                toast.success('Warehouse updated successfully')
            } else {
                await axios.post('/api/warehouses', formData)
                toast.success('Warehouse created successfully')
            }
            fetchWarehouses()
            closeModal()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed')
        }
    }

    const handleDelete = async (warehouse) => {
        if (window.confirm('Are you sure you want to delete this warehouse?')) {
            try {
                await axios.delete(`/api/warehouses/${warehouse.warehouseCode}`)
                toast.success('Warehouse deleted successfully')
                fetchWarehouses()
            } catch (error) {
                toast.error('Failed to delete warehouse')
            }
        }
    }

    const handleEdit = (warehouse) => {
        setEditingWarehouse(warehouse)
        setFormData({
            warehouseCode: warehouse.warehouseCode,
            warehouseName: warehouse.warehouseName,
            warehouseLocation: warehouse.warehouseLocation
        })
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingWarehouse(null)
        setFormData({
            warehouseCode: '',
            warehouseName: '',
            warehouseLocation: ''
        })
    }

    const columns = [
        { key: 'warehouseCode', label: 'Warehouse Code' },
        { key: 'warehouseName', label: 'Warehouse Name' },
        { key: 'warehouseLocation', label: 'Location' }
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
                <h1 className="text-3xl font-bold text-foreground">Warehouses</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Warehouse</span>
                </button>
            </div>

            <DataTable
                columns={columns}
                data={warehouses}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Warehouse Code *</label>
                        <input
                            type="text"
                            value={formData.warehouseCode}
                            onChange={(e) => setFormData({ ...formData, warehouseCode: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                            disabled={!!editingWarehouse}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Warehouse Name *</label>
                        <input
                            type="text"
                            value={formData.warehouseName}
                            onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Warehouse Location *</label>
                        <input
                            type="text"
                            value={formData.warehouseLocation}
                            onChange={(e) => setFormData({ ...formData, warehouseLocation: e.target.value })}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            required
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
                            {editingWarehouse ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Warehouses