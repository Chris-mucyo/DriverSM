import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Warehouse = sequelize.define('Warehouse', {
    warehouseCode: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        validate: {
            notEmpty: true
        }
    },
    warehouseName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    warehouseLocation: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
}, {
    tableName: 'warehouses',
    timestamps: true
});

export default Warehouse;