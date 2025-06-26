import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectDB } from './db/database.js';
import router from './routes/user.route.js';

const app = express();
dotenv.config();

connectDB()


app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use('/api/v1/user',router)
app.use('/api/v1/user',router)

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})