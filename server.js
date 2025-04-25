import express from "express";
import http from 'http'
import authRoutes from './Routes/auth.js'
import db from './models/index.js'
const app = express()

const server = http.createServer(app)
db.sequelize
    .authenticate()
    .then(async () => {
        console.log("Database connected!");
        await db.sequelize.sync({ alter: true })//dev only for production use migrations
    })
    .catch((err) => console.error("DB connection error:", err));

app.use('/auth', authRoutes)
server.listen(3000, () => {
    console.log('server listening on port 3000')
})
