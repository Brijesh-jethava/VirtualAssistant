import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js'
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import geminiResponse from './gemini.js';

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:'https://brijeshs-virtualassistant.onrender.com', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}
))

app.use('/api/auth', authRouter)
app.use('/api/user',userRouter)

app.get('/', async(req, res) => {
    const prompt = req.query.prompt

   const result =  await geminiResponse(prompt);
   res.json(result)
})

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${port}`);
});
