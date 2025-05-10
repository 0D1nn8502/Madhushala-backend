"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = require("../services/connection");
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const space_1 = __importDefault(require("./routes/space"));
const user_1 = __importDefault(require("./routes/user"));
const http_1 = require("http");
const websocket_1 = require("../websocket");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-type', 'Authorization']
}));
app.options('*', (0, cors_1.default)());
// REST endpoints // 
app.use("/auth", auth_1.default);
app.use("/space", space_1.default);
app.use("/user", user_1.default);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, connection_1.connectToDatabase)();
            // Create HTTP server // 
            const server = (0, http_1.createServer)(app);
            // Setup WebSocket server
            (0, websocket_1.setupWebSocketServer)(server);
            server.listen(PORT, () => {
                console.log(`Server started at http://localhost:${PORT}`);
            });
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Database connection failed", error.message);
            }
            else {
                console.error("Database connection failed", error);
            }
            process.exit(1);
        }
    });
}
startServer();
