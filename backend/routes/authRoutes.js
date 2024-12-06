const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const router = express.Router();

// Configuración de Multer para subir imágenes de perfil
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../imagenes/perfiles'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Configuración de transporte para Nodemailer
const SMTP_CONFIG = {
    host: process.env.SMTP_HOST || "mail.keiseruniversity.edu.ni",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || "se.student@keiseruniversity.edu.ni",
        pass: process.env.SMTP_PASS || "35ChRz)$ieeg", // Reemplazar con variable de entorno
    },
};
const transporter = nodemailer.createTransport(SMTP_CONFIG);

// Middleware para verificar la sesión
const authenticateSession = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }
    next();
};

// Ruta para registrar un usuario
router.post('/register', upload.single('profilePicture'), async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        console.log('Datos recibidos en /register:', req.body);

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }

        // Crear hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profilePicture,
        });

        // Enviar correo de bienvenida
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: '¡Bienvenido a nuestra plataforma!',
            html: `
                <h2>Hola, ${firstName} ${lastName}!</h2>
                <p>¡Gracias por registrarte en nuestra plataforma! Estamos emocionados de tenerte con nosotros.</p>
                <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
                <p>¡Disfruta tu experiencia!</p>
            `,
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente. Se envió un correo de bienvenida.', user: newUser });
    } catch (error) {
        console.error('Error en /register:', error.message, error.stack);
        res.status(500).json({ message: 'Error al registrar el usuario.', error: error.message });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        req.session.user = { id: user.id, isadmin: user.isadmin };
        res.status(200).json({ message: 'Inicio de sesión exitoso', user: req.session.user });
    } catch (error) {
        console.error('Error en /login:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error cerrando sesión:', err);
            return res.status(500).json({ message: 'Error cerrando sesión.' });
        }
        res.clearCookie('connect.sid', { path: '/' }); // Limpiar la cookie de sesión
        res.status(200).json({ message: 'Sesión cerrada correctamente.' });
    });
});

// Ruta para obtener el perfil del usuario
router.get('/profile/me', authenticateSession, async (req, res) => {
    try {
        const user = await User.findByPk(req.session.user.id, {
            attributes: ['firstName', 'lastName', 'email', 'profilePicture', 'isadmin'],
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error obteniendo el perfil del usuario:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

// Ruta para solicitar el enlace de recuperación
router.post('/password-reset', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'El correo es obligatorio.' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Generar un token único
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Crear enlace de restablecimiento
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        // Enviar correo al usuario
        await transporter.sendMail({
            from: 'quintanillaairlines1@gmail.com',
            to: email,
            subject: 'Solicitud de restablecimiento de contraseña',
            html: `
                <h2>Solicitud de restablecimiento de contraseña</h2>
                <p>Hola, ${user.firstName}</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla:</p>
                <p><a href="${resetLink}">Restablecer contraseña</a></p>
                <p>Si no realizaste esta solicitud, puedes ignorar este correo.</p>
            `,
        });

        res.status(200).json({ message: 'Correo de recuperación enviado.' });
    } catch (error) {
        console.error('Error en /password-reset:', error);
        res.status(500).json({ message: 'Error al enviar el correo de recuperación.' });
    }
});

// Ruta para restablecer la contraseña
router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ message: 'Token y nueva contraseña son obligatorios.' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validar si el usuario existe
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
    } catch (error) {
        console.error('Error en /reset-password:', error);
        res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
});

router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({ message: 'Token no proporcionado.' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validar si el usuario existe
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Respuesta indicando que el token es válido
        res.status(200).json({ message: 'Token válido. Puedes restablecer tu contraseña.' });
    } catch (error) {
        console.error('Error en /reset-password/:token:', error);
        res.status(400).json({ message: 'Token inválido o expirado.' });
    }
});

module.exports = router;
