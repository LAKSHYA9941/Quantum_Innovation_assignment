import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import xss from 'xss-clean';
import hpp from 'hpp';


import authRoutes from './routes/authroutes.js';

const app = express();
app.set('trust proxy', 1);


//helmet-sets secure HTTP headers
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
);

app.use(xss());
app.use(hpp());

//only allow the React dev server (and production URL)
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:3000',
];

app.use(
    cors({
        origin: (origin, callback) => {
            // allow requests with no origin for testing with mobile apps, curl, Postman
            if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
            callback(new Error(`CORS policy: Origin ${origin} not allowed`));
        },
        credentials: true,
    })
);

// Global limiter: 100 requests per 15 minutes per IP

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Auth limiter: stricter — 10 attempts per 15 minutes per IP

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please wait 15 minutes and try again.',
    },
    skipSuccessfulRequests: true, // don't count successful logins
});

app.use('/api', globalLimiter);

// Request Parsing
app.use(express.json({ limit: '10kb' })); // limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Mongo sanitize prevent NoSQL injection by removing $ and . from req.body/query/params
app.use(mongoSanitize());

// HTTP request logger for development only
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// ROUTES

//Auth route
app.use('/api/auth', authLimiter, authRoutes);


// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Quantum Auth API');
})


// 404 handler
app.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});


//Global Error Handler
app.use('/api', (err, req, res, next) => {
    console.error('Unhandled error:', err);

    if (err.message && err.message.startsWith('CORS')) {
        return res.status(403).json({ success: false, message: err.message });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
});


//Database + Server Start
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quantum_auth';

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });