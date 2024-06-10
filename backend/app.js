import express from 'express';
import studentRoutes from './routes/students.js'
import userRoutes from './routes/users.js'
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/students', studentRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is now running on port: ${PORT}`)
})