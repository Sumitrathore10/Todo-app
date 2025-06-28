import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectDB } from './src/db/database.js';
import router from './src/routes/user.route.js';
import todoRouter from './src/routes/todo.route.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

connectDB()


app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());


app.use('/api/v1/user',router)
app.use('/api/v1/user',router)
app.use('/api/v1/user',router)

app.use('/api/v1/todo',todoRouter)
app.use('/api/v1/todo',todoRouter)
app.use('/api/v1/todo',todoRouter)
app.use('/api/v1/todo',todoRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})