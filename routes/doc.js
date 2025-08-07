const express = require('express');
const router = express.Router();

// Endpoint para documentación de la API
router.get('/doc', (req, res) => {
  res.json({
    title: 'Chatbot Backend API Documentation',
    version: '1.0.0',
    description: 'Backend para chatbot con modelo LLM gratuito desplegado en Render',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    endpoints: {
      status: {
        url: '/api/halt',
        method: 'GET',
        description: 'Verificar estado del servidor',
        response: {
          status: 'string',
          timestamp: 'string',
          message: 'string'
        }
      },
      documentation: {
        url: '/api/doc',
        method: 'GET',
        description: 'Obtener documentación de la API',
        response: 'object'
      },
      sendMessage: {
        url: '/api/chat/mensajes',
        method: 'POST',
        description: 'Enviar mensaje al chatbot',
        body: {
          message: 'string (requerido)',
          context: 'object (opcional)',
          eventType: 'string (opcional: "evento_uno" | "evento_dos")'
        },
        response: {
          success: 'boolean',
          response: 'string',
          timestamp: 'string',
          eventType: 'string'
        }
      },
      messageHistory: {
        url: '/api/chat/mensajes/historial',
        method: 'GET',
        description: 'Obtener historial de mensajes',
        params: {
          limit: 'number (opcional, default: 10)',
          offset: 'number (opcional, default: 0)'
        },
        response: {
          success: 'boolean',
          messages: 'array',
          pagination: 'object'
        }
      },
      setContext: {
        url: '/api/context/context',
        method: 'POST',
        description: 'Establecer contexto para usuario',
        body: {
          userId: 'string (requerido)',
          context: 'object (requerido)',
          sessionId: 'string (opcional)'
        },
        response: {
          success: 'boolean',
          message: 'string',
          key: 'string'
        }
      },
      getContext: {
        url: '/api/context/context/:userId',
        method: 'GET',
        description: 'Obtener contexto de usuario',
        params: {
          userId: 'string (requerido en URL)',
          sessionId: 'string (opcional en query)'
        },
        response: {
          success: 'boolean',
          context: 'object',
          timestamp: 'string',
          userId: 'string',
          sessionId: 'string'
        }
      },
      updateContext: {
        url: '/api/context/context/:userId',
        method: 'PUT',
        description: 'Actualizar contexto de usuario',
        params: {
          userId: 'string (requerido en URL)'
        },
        body: {
          context: 'object (requerido)',
          sessionId: 'string (opcional)'
        },
        response: {
          success: 'boolean',
          message: 'string'
        }
      },
      deleteContext: {
        url: '/api/context/context/:userId',
        method: 'DELETE',
        description: 'Eliminar contexto de usuario',
        params: {
          userId: 'string (requerido en URL)',
          sessionId: 'string (opcional en query)'
        },
        response: {
          success: 'boolean',
          message: 'string'
        }
      }
    },
    examples: {
      sendMessage: {
        request: {
          url: '/api/chat/mensajes',
          method: 'POST',
          body: {
            message: '¿Cómo puedo ayudarte?',
            context: {
              user: 'lucia',
              topic: 'chatbot'
            },
            eventType: 'evento_uno'
          }
        }
      },
      setContext: {
        request: {
          url: '/api/context/context',
          method: 'POST',
          body: {
            userId: 'user123',
            context: {
              name: 'Lucía',
              preferences: ['tech', 'ai'],
              lastTopic: 'chatbot development'
            },
            sessionId: 'session456'
          }
        }
      }
    },
    events: {
      description: 'El sistema maneja dos tipos de eventos diferenciados',
      eventOne: {
        type: 'evento_uno',
        description: 'Primer bloque de información del usuario'
      },
      eventTwo: {
        type: 'evento_dos',
        description: 'Segundo bloque de información del usuario'
      }
    }
  });
});

module.exports = router;
