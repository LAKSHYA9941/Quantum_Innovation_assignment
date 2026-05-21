import express from 'express';

const router = express.Router();

import {
  register,
  login,
  getMe
} from '../controllers/authcontroller.js';

import { protect }
from '../middleware/authmiddleware.js';


// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', protect, getMe);


export default router;