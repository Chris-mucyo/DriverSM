import sequelize from '../config/database.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Warehouse from '../models/Warehouse.js';
import StockTransaction from '../models/StockTransaction.js';
import '../models/associations.js';

const initDatabase = async () => {
    try {
        // Force sync (drop and recreate tables)
        await sequelize.sync({ force: true });
        console.log('✅ Database tables created successfully');

        // Create default admin user
        const adminUser = await User.create({
            username: 'admin',
            password: 'admin123'
        });
        console.log('✅ Default admin user created: username=admin, password=admin123');

        // Create sample products
        const products = await Product.bulkCreate([
            {
                productCode: 'PROD001',
                productName: 'Laptop Dell XPS',
                category: 'Electronics',
                quantityInStock: 50,
                unitPrice: 1200.00,
                supplierName: 'Tech Suppliers Ltd',
                dateReceived: '2026-01-15'
            },
            {
                productCode: 'PROD002',
                productName: 'Wireless Mouse',
                category: 'Accessories',
                quantityInStock: 200,
                unitPrice: 25.99,
                supplierName: 'Office Mart',
                dateReceived: '2026-01-20'
            },
            {
                productCode: 'PROD003',
                productName: 'Mechanical Keyboard',
                category: 'Accessories',
                quantityInStock: 100,
                unitPrice: 89.99,
                supplierName: 'Tech Suppliers Ltd',
                dateReceived: '2026-01-25'
            }
        ]);
        console.log('✅ Sample products created');

        // Create sample warehouses
        const warehouses = await Warehouse.bulkCreate([
            {
                warehouseCode: 'WH001',
                warehouseName: 'Main Warehouse Kigali',
                warehouseLocation: 'Kigali City, Gasabo District'
            },
            {
                warehouseCode: 'WH002',
                warehouseName: 'Secondary Warehouse',
                warehouseLocation: 'Kigali City, Nyarugenge District'
            }
        ]);
        console.log('✅ Sample warehouses created');

        // Create sample transactions
        const transactions = await StockTransaction.bulkCreate([
            {
                transactionDate: new Date('2026-02-01'),
                quantityMoved: 30,
                transactionType: 'IN',
                productCode: 'PROD001',
                warehouseCode: 'WH001'
            },
            {
                transactionDate: new Date('2026-02-05'),
                quantityMoved: 10,
                transactionType: 'OUT',
                productCode: 'PROD001',
                warehouseCode: 'WH001'
            },
            {
                transactionDate: new Date('2026-02-10'),
                quantityMoved: 50,
                transactionType: 'IN',
                productCode: 'PROD002',
                warehouseCode: 'WH002'
            }
        ]);
        console.log('✅ Sample transactions created');

        console.log('🎉 Database initialization completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

initDatabase();