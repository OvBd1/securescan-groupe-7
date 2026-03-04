import db from '../config/db.config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: "Tous les champs sont requis." });
        }

        if (password.length < 12) {
            return res.status(400).json({ message: "Le mot de passe doit contenir au moins 12 caractères." });
        }

        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = uuidv4();
        await db.query(
            'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)',
            [userId, email, passwordHash, name]
        );

        res.status(201).json({ message: "Utilisateur créé avec succès !", userId });

    } catch (error) {
        console.error("Erreur Inscription :", error);
        res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email et mot de passe requis." });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Identifiants incorrects." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret_hackathon_ipssi_2026',
            { expiresIn: '96h' }
        );

        res.status(200).json({
            message: "Connexion réussie",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("Erreur Connexion :", error);
        res.status(500).json({ message: "Erreur serveur lors de la connexion." });
    }
};