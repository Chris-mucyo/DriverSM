import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (userId, username) => {
    return jwt.sign(
        { userId, username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already exists'
            });
        }

        const user = await User.create({ username, password });

        const token = generateToken(user.userId, user.username);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                userId: user.userId,
                username: user.username,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user.userId, user.username);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                userId: user.userId,
                username: user.username,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};