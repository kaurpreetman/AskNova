import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';  // <-- import your connection function
import './config/passport.js'; 
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);

// Connect to MongoDB then start the server
const PORT = 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
