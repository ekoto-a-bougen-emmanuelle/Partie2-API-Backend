const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const articleRoutes = require('./routes/articleRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const { initDB } = require('./config/db');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l’API Blog',
    documentation: `http://localhost:${PORT}/api-docs`
  });
});

app.use('/api/articles', articleRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Gestion route non trouvée
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion erreurs serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur' });
});

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
      console.log(`Swagger disponible sur http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Erreur lors de l’initialisation de la base de données :', err);
  });
