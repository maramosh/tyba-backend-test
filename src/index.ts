import 'reflect-metadata'
import dotenv from 'dotenv'
import express  from 'express'
import morgan from 'morgan'
import cors from 'cors'

import {createConnection} from 'typeorm' 

import userRoutes from './routes/userRoutes'
import mapRoutes from './routes/mapRoutes'

dotenv.config();

const app = express();
createConnection();

//middlewares

app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); 

//routes

app.use(userRoutes);
app.use(mapRoutes);


app.listen(3000);
console.log("Server on port", 3000)