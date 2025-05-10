import express from "express";
import { connectToDatabase } from "../services/connection";
import authRouter from "./routes/auth";
import cors from "cors";
import spaceRouter from "./routes/space";
import userRouter from "./routes/user";
import { createServer } from "http";
import { setupWebSocketServer } from "../websocket";


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());


app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'DELETE'],  
    allowedHeaders: ['Content-type', 'Authorization'] 
}));


app.options('*', cors());  

// REST endpoints // 
app.use("/auth", authRouter);
app.use("/space", spaceRouter);
app.use("/user", userRouter);


async function startServer() {

    try {
        await connectToDatabase();  

        // Create HTTP server // 
        const server = createServer(app);
        
        // Setup WebSocket server
        setupWebSocketServer(server);

        server.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        });

    } catch (error: unknown) {

        if (error instanceof Error) {
            console.error("Database connection failed", error.message);
        } else {
            console.error("Database connection failed", error);
        }

        process.exit(1);
    }
}

startServer(); 