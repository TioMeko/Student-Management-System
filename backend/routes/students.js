import { Router } from 'express';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/connection.js'

const router = Router();

// POST /api/students - Create a new student
router.post('/', async (req, res) => {
    const { name, email, age } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO students (name, email, age) VALUES (?, ?, ?)', [name, email, age]);
        res.status(201).send({ message: 'Student created', studentId: result.insertId});
    } catch (error) {
        res.status(500).send({ message: 'Error creating student', error: error.message });
    }
});

// GET /api/students - Get all students
router.get('/', async (req, res) => {
    try {
        // Add await here to wait for the query to resolve
        const [students] = await pool.query('SELECT id, name, email FROM students');
        res.send(students);
    } catch (error) {s
        console.error('Error retrieving students:', error); // It's often helpful to log the full error for debugging
        res.status(500).send({ message: 'Error retrieving students', error: error.message });
    }
});

// GET /api/students/:id - Get a single student by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await pool.query('SELECT id, name, email FROM students WHERE id = ?', [id]);
        if (results.length > 0) {
            res.send(results[0]);
        } else {
            res.status(404).send({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving student', error: error.message });
    }
});

// PUT /api/students/:id - Update a student
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    
    // Initialize an array to hold SQL parts and parameter values
    let sqlParts = [];
    let values = [];

    if (name) {
        sqlParts.push('name = ?');
        values.push(name);
    }
    if (email) {
        sqlParts.push('email = ?');
        values.push(email);
    }
    if (age) {
        sqlParts.push('age = ?');
        values.push(age);
    }

    // If no fields are provided, return an error
    if (values.length === 0) {
        return res.status(400).send({ message: 'No valid fields provided for update' });
    }

    // Join the parts to form the full SQL command
    let sql = 'UPDATE students SET ' + sqlParts.join(', ') + ' WHERE id = ?';
    values.push(id); // Add the ID to the values array for the WHERE clause

    try {
        const [result] = await pool.query(sql, values);
        if (result.affectedRows > 0) {
            res.send({ message: 'Student updated' });
        } else {
            res.status(404).send({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).send({ message: 'Error updating student', error: error.message });
    }
});

// DELETE /api/students/:id - Delete a student
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.send({ message: 'Student deleted' });
        } else {
            res.status(404).send({ message: 'Student not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error deleting student', error: error.message });
    }
});

export default router;
