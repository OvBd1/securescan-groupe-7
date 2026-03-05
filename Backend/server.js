import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import projetsRoutes from './src/routes/projets.routes.js';
import owaspRoutes from './src/routes/owasp.routes.js';

const app = express();
app.use(cors({
  origin:  '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: 'Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization',
}));

app.use(express.static('.'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Serveur démarré'));

app.use('/auth', authRoutes);
app.use('/project', projetsRoutes);
app.use('/owasp', owaspRoutes);
//app.use('/scan', _router);

//app.get('*', (req, res) => res.status(404).send('Not Found'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const serverPort = process.env.SERVER_PORT;

app.listen(serverPort, () => console.log(`Serveur démarré sur le port ${serverPort}`));