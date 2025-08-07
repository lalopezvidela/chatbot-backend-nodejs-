const express = require('express');
const router = express.Router();
const { processMessage, handleEventOne, handleEventTwo } = require('../services/chatService');

// Endpoint principal para mensajes del chatbot
router.post('/mensajes', async (req, res) => {
  try {
    const { message, context, eventType } = req.body;

    // Validación de datos de entrada
    if (!message) {
      return res.status(400).json({
        error: 'Mensaje requerido',
        message: 'El campo "message" es obligatorio'
      });
    }

    let response;

    // Procesar según el tipo de evento
    switch (eventType) {
      case 'evento_uno':
        response = await handleEventOne(message, context);
        break;
      case 'evento_dos':
        response = await handleEventTwo(message, context);
        break;
      default:
        response = await processMessage(message, context);
    }

    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString(),
      eventType: eventType || 'default'
    });

  } catch (error) {
    console.error('Error procesando mensaje:', error);
    res.status(500).json({
      success: false,
      error: 'Error procesando mensaje',
      message: error.message
    });
  }
});

// Endpoint para obtener historial de mensajes
router.get('/mensajes/historial', (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    
    // Aquí se implementaría la lógica para obtener historial
    // Por ahora retornamos un ejemplo
    res.json({
      success: true,
      messages: [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: 0
      }
    });
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo historial',
      message: error.message
    });
  }
});

module.exports = router;
