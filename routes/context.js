const express = require('express');
const router = express.Router();

// Almacenamiento temporal del contexto (en producción usar una base de datos)
let contextStorage = new Map();

// Endpoint para establecer contexto
router.post('/context', (req, res) => {
  try {
    const { userId, context, sessionId } = req.body;

    if (!userId || !context) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'userId y context son requeridos'
      });
    }

    const key = sessionId ? `${userId}_${sessionId}` : userId;
    
    contextStorage.set(key, {
      context: context,
      timestamp: new Date().toISOString(),
      userId: userId,
      sessionId: sessionId
    });

    res.json({
      success: true,
      message: 'Contexto establecido correctamente',
      key: key
    });

  } catch (error) {
    console.error('Error estableciendo contexto:', error);
    res.status(500).json({
      success: false,
      error: 'Error estableciendo contexto',
      message: error.message
    });
  }
});

// Endpoint para obtener contexto
router.get('/context/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { sessionId } = req.query;

    const key = sessionId ? `${userId}_${sessionId}` : userId;
    const contextData = contextStorage.get(key);

    if (!contextData) {
      return res.status(404).json({
        success: false,
        error: 'Contexto no encontrado',
        message: 'No existe contexto para el usuario especificado'
      });
    }

    res.json({
      success: true,
      context: contextData.context,
      timestamp: contextData.timestamp,
      userId: contextData.userId,
      sessionId: contextData.sessionId
    });

  } catch (error) {
    console.error('Error obteniendo contexto:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo contexto',
      message: error.message
    });
  }
});

// Endpoint para actualizar contexto
router.put('/context/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { context, sessionId } = req.body;

    if (!context) {
      return res.status(400).json({
        error: 'Contexto requerido',
        message: 'El campo "context" es obligatorio'
      });
    }

    const key = sessionId ? `${userId}_${sessionId}` : userId;
    const existingContext = contextStorage.get(key);

    if (!existingContext) {
      return res.status(404).json({
        success: false,
        error: 'Contexto no encontrado',
        message: 'No existe contexto para el usuario especificado'
      });
    }

    contextStorage.set(key, {
      ...existingContext,
      context: context,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Contexto actualizado correctamente'
    });

  } catch (error) {
    console.error('Error actualizando contexto:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando contexto',
      message: error.message
    });
  }
});

// Endpoint para eliminar contexto
router.delete('/context/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { sessionId } = req.query;

    const key = sessionId ? `${userId}_${sessionId}` : userId;
    const deleted = contextStorage.delete(key);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Contexto no encontrado',
        message: 'No existe contexto para el usuario especificado'
      });
    }

    res.json({
      success: true,
      message: 'Contexto eliminado correctamente'
    });

  } catch (error) {
    console.error('Error eliminando contexto:', error);
    res.status(500).json({
      success: false,
      error: 'Error eliminando contexto',
      message: error.message
    });
  }
});

module.exports = router;
