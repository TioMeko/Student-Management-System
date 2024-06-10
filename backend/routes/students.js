import { Router } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/connection.js';

const router = Router();

// POST /api/students - Create a new student
router.post('/', async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO students (name, email, age) VALUES (?, ?, ?)',
      [name, email, age]
    );
    res
      .status(201)
      .send({ message: 'Student created', studentId: result.insertId });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error creating student', error: error.message });
  }
});

// GET /api/students - Get all students
router.get('/', async (req, res) => {
  try {
    // Add await here to wait for the query to resolve
    const [students] = await pool.query('SELECT id, name, email FROM students');
    res.send(students);
  } catch (error) {
    s;
    console.error('Error retrieving students:', error);
    res
      .status(500)
      .send({ message: 'Error retrieving students', error: error.message });
  }
});

// GET /api/students/:id - Get a single student by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query(
      `
            SELECT s.id AS student_id, s.name AS student_name, s.email, s.age, c.id AS class_id, c.name AS class_name
            FROM students s
            JOIN student_classes sc ON s.id = sc.student_id
            JOIN classes c ON sc.class_id = c.id
            WHERE s.id = ?
        `,
      [id]
    );

    if (results.length > 0) {
      const studentInfo = {
        id: results[0].student_id,
        name: results[0].student_name,
        email: results[0].email,
        age: results[0].age,
        classes: results.map((row) => ({
          id: row.class_id,
          name: row.class_name,
        })),
      };
      res.send(studentInfo);
    } else {
      res.status(404).send({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error fetching student and classes:', error);
    res
      .status(500)
      .send({
        message: 'Error retrieving student and classes',
        error: error.message,
      });
  }
});

// PUT /api/students/:id - Update a student
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

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

  if (values.length === 0) {
    return res
      .status(400)
      .send({ message: 'No valid fields provided for update' });
  }

  // Join the parts to form the full SQL command
  let sql = 'UPDATE students SET ' + sqlParts.join(', ') + ' WHERE id = ?';
  values.push(id);

  try {
    const [result] = await pool.query(sql, values);
    if (result.affectedRows > 0) {
      res.send({ message: 'Student updated' });
    } else {
      res.status(404).send({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error updating student:', error);
    res
      .status(500)
      .send({ message: 'Error updating student', error: error.message });
  }
});

// DELETE /api/students/:id - Delete a student
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [
      id,
    ]);
    if (result.affectedRows > 0) {
      res.send({ message: 'Student deleted' });
    } else {
      res.status(404).send({ message: 'Student not found' });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Error deleting student', error: error.message });
  }
});

export default router;
