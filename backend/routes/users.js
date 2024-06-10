import { Router } from 'express';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/connection.js'

const router = Router();

// POST /api/users - Create a new student
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await hash(password, 10);
    try {
        const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).send({ message: 'User created', userId: result.insertId});
    } catch (error) {
        res.status(500).send({ message: 'Error creating user', error: error.message });
    }
});

// GET /api/users - Get all users
router.get('/', async (req, res) => {
    try {
        // Add await here to wait for the query to resolve
        const [users] = await pool.query('SELECT id, username FROM users');
        res.send(users);
    } catch (error) {s
        console.error('Error retrieving users:', error); // It's often helpful to log the full error for debugging
        res.status(500).send({ message: 'Error retrieving users', error: error.message });
    }
});

// GET /api/users/:id - Get a single student by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await pool.query('SELECT id, username FROM users WHERE id = ?', [id]);
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving user', error: error.message });
    }
});

// PUT /api/users/:id - Update a student
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    
    // Initialize an array to hold SQL parts and parameter values
    let sqlParts = [];
    let values = [];

    if (username) {
        sqlParts.push('username = ?');
        values.push(username);
    }
    if (password) {
        const hashedPassword = await hash(password, 10);
        sqlParts.push('password = ?');
        values.push(hashedPassword);
    }

    // If no fields are provided, return an error
    if (values.length === 0) {
        return res.status(400).send({ message: 'No valid fields provided for update' });
    }

    // Join the parts to form the full SQL command
    let sql = 'UPDATE users SET ' + sqlParts.join(', ') + ' WHERE id = ?';
    values.push(id); // Add the ID to the values array for the WHERE clause

    try {
        const [result] = await pool.query(sql, values);
        if (result.affectedRows > 0) {
            res.send({ message: 'User updated' });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ message: 'Error updating user', error: error.message });
    }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.send({ message: 'User deleted' });
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error deleting user', error: error.message });
    }
});

export default router;
