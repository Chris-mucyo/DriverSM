import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [3, 50]
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

// Instance method to check password
User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export default User;