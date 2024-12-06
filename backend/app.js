const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sequelize = require('./db/database');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./models/associations');

// Rutas
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const optionClassRoutes = require('./routes/OptionClass');
const adminRouter = require('./routes/adminRoutes');
const passengerRoutes = require('./routes/passengerRoutes');
const flightRoutes = require('./routes/flightRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
const port = process.env.PORT || 8080;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/airlines', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Configuración de sesiones
const sessionMiddleware = session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://127.0.0.1:27017/airlines',
        collectionName: 'userSession',
        ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    },
});

app.use(cookieParser());
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Rutas públicas
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/options', optionClassRoutes);
app.use('/passengers', passengerRoutes);
app.use('/api/flights', flightRoutes);

// Rutas administrativas
app.use('/api/admin', adminRouter);

// WebSocket
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
    console.log('Usuario conectado a la sala General');

    socket.join('General');

    socket.on('send_message', ({ message }) => {
        if (!message.trim()) return;
        io.to('General').emit('receive_message', message);
    });

    socket.on('error', (err) => {
        console.error('Error en WebSocket:', err);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado de la sala General');
    });
});

// Sincronización de base de datos
(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Failed to sync database:', error);
    }
})();

// Ruta principal
app.get('/', (req, res) => {
    res.send('Welcome to the airline API!');
});

// Iniciar servidor
server.listen(port, () => console.log(`Listening on port ${port}`));
