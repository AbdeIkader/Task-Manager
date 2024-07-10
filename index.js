import * as dotenv from "dotenv";
dotenv.config();
import express from 'express'
import { dbConnection } from "./DB/dbConnection.js";
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

dbConnection()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))