import React, { useState } from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'

const DataTable = ({
                       columns,
                       data,
                       onEdit,
                       onDelete,
                       onView,
                       itemsPerPage = 10
                   }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredData = data.filter(item =>
        columns.some(col => {
            const value = col.render ? col.render(item[col.key], item) : item[col.key]
            return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        })
    )

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    Total: {filteredData.length} records
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full">
                    <thead className="bg-muted">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                                {col.label}
                            </th>
                        ))}
                        {(onEdit || onDelete || onView) && (
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + ((onEdit || onDelete || onView) ? 1 : 0)}
                                className="px-4 py-8 text-center text-muted-foreground"
                            >
                                No data found
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((item, index) => (
                            <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3 text-sm text-foreground">
                                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                                    </td>
                                ))}
                                {(onEdit || onDelete || onView) && (
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex space-x-2">
                                            {onView && (
                                                <button
                                                    onClick={() => onView(item)}
                                                    className="p-1 rounded hover:bg-accent text-blue-600 dark:text-blue-400 transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-1 rounded hover:bg-accent text-yellow-600 dark:text-yellow-400 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-1 rounded hover:bg-accent text-red-600 dark:text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded border border-input hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded border border-input hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default DataTable