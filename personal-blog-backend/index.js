const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = 8000;
const authRoute = require('./Route/Auth')
const blogRoute = require('./Route/Blog');
const imageUploadRoutes = require('./Route/imageUploadRoute');
require('dotenv').config();
require('./db')
const User = require('./Models/UserSchema');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const allowedOrigins = ['http://localhost:3000'];

// CORS CONFIG
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
);


// REQUIRED: allow credentials in headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

//app.options('*', cors());

app.use(cookieParser());
app.use('/auth', authRoute);
app.use('/blog', blogRoute);
app.use('/image', imageUploadRoutes);


app.get('/', (req, res) => {
    res.json({ message: `This API is working`})
});

app.get('/blogcategories', async (req, res) => {
    const blogCategories = [
        "Technology Trends",
        "Health and Wellness",
        "Travel Destinations",
        "Food and Cooking",
        "Personal Finance",
        "Career Development",
        "Parenting Tips",
        "Self-Improvement",
        "Home Decor and DIY",
        "Book Reviews",
        "Environmental Sustainability",
        "Fitness and Exercise",
        "Movie and TV Show Reviews",
        "Entrepreneurship",
        "Mental Health",
        "Fashion and Style",
        "Hobby and Crafts",
        "Pet Care",
        "Education and Learning",
        "Sports and Recreation"
    ];
    res.json(
        {
            message: 'Categories fetched successfully',
            categories: blogCategories
        }
    )
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})