const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 solicitudes por ventana de tiempo
});
app.use(limiter);

// Importar rutas
const chatRoutes = require('./routes/chat');
const contextRoutes = require('./routes/context');
const docRoutes = require('./routes/doc');

// Usar rutas
app.use('/api/chat', chatRoutes);
app.use('/api/context', contextRoutes);
app.use('/api', docRoutes);

// Ruta de estado del servidor
app.get('/api/halt', (req, res) => {
  res.json({
    status: 'active',
    timestamp: new Date().toISOString(),
    message: 'Chatbot backend está funcionando correctamente'
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Chatbot Backend API',
    version: '1.0.0',
    endpoints: [
      '/api/halt - Estado del servidor',
      '/api/doc - Documentación',
      '/api/mensajes - Envío de mensajes',
      '/api/context - Gestión de contexto'
    ]
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: 'La ruta solicitada no existe'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
