import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import cookieParser from 'cookie-parser';
dotenv.config(
    {
        path: './.env'
    }
);
const app = express();
const PORT= process.env.PORT ;

// database connection
connectDB();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));


//routes
app.get('/', (req, res) => {
    res.send('API is running');
});
// routes
import userRoute from './routes/userRoute.js';

app.use('/api/v1', userRoute);





//server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})

