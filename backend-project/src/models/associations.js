import Product from './Product.js';
import Warehouse from './Warehouse.js';
import StockTransaction from './StockTransaction.js';

// Product - StockTransaction (One-to-Many)
Product.hasMany(StockTransaction, {
    foreignKey: 'productCode',
    sourceKey: 'productCode',
    as: 'transactions'
});

StockTransaction.belongsTo(Product, {
    foreignKey: 'productCode',
    targetKey: 'productCode',
    as: 'product'
});

// Warehouse - StockTransaction (One-to-Many)
Warehouse.hasMany(StockTransaction, {
    foreignKey: 'warehouseCode',
    sourceKey: 'warehouseCode',
    as: 'transactions'
});

StockTransaction.belongsTo(Warehouse, {
    foreignKey: 'warehouseCode',
    targetKey: 'warehouseCode',
    as: 'warehouse'
});

export { Product, Warehouse, StockTransaction };