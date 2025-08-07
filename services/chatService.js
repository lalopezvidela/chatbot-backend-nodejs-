const axios = require('axios');

class ChatService {
  constructor() {
    // Configuración para Google Gemini API
    this.llmConfig = {
      baseURL: process.env.LLM_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
      apiKey: process.env.GEMINI_API_KEY || '',
      model: process.env.LLM_MODEL || 'gemini-pro'
    };
  }

  async callLLM(prompt, context = null) {
    try {
      // Construir el prompt con contexto si está disponible
      let fullPrompt = prompt;
      if (context) {
        fullPrompt = `Contexto: ${JSON.stringify(context)}\n\nUsuario: ${prompt}`;
      }

      // Llamada a Google Gemini API
      const response = await axios.post(
        `${this.llmConfig.baseURL}/models/${this.llmConfig.model}:generateContent?key=${this.llmConfig.apiKey}`,
        {
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
            topP: 0.8,
            topK: 10
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      // Procesar respuesta del modelo Gemini
      if (response.data && response.data.candidates && response.data.candidates[0] && 
          response.data.candidates[0].content && response.data.candidates[0].content.parts[0]) {
        return this.cleanResponse(response.data.candidates[0].content.parts[0].text);
      }

      // Fallback si no hay respuesta del modelo
      return this.getFallbackResponse();

    } catch (error) {
      console.error('Error llamando al modelo Gemini:', error.message);
      
      // Si no hay API key configurada o hay error de conectividad
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.warn('API key de Gemini no válida o no configurada, usando respuesta simulada');
      }
      
      return this.getFallbackResponse();
    }
  }

  cleanResponse(text) {
    // Limpiar la respuesta del modelo
    return text
      .replace(/^.*Usuario:.*?\n\n?/i, '') // Remover el prompt original
      .replace(/^.*Contexto:.*?\n\n?/i, '') // Remover contexto si aparece
      .trim();
  }

  getFallbackResponse() {
    const responses = [
      "Entiendo tu consulta. Como modelo de chat, estoy aquí para ayudarte.",
      "Gracias por tu mensaje. ¿En qué más puedo asistirte?",
      "He procesado tu solicitud. ¿Necesitas información adicional?",
      "Comprendo lo que necesitas. Permíteme ayudarte con eso.",
      "Recibido tu mensaje. Estoy procesando la información para responderte adecuadamente."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async processMessage(message, context = null) {
    try {
      console.log('Procesando mensaje:', { message, context });
      
      const response = await this.callLLM(message, context);
      
      return {
        text: response,
        processed_at: new Date().toISOString(),
        model_used: this.llmConfig.model
      };
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      throw new Error('No se pudo procesar el mensaje');
    }
  }

  async handleEventOne(message, context = null) {
    try {
      console.log('Manejando evento uno:', { message, context });
      
      // Agregar instrucciones específicas para evento uno
      const enhancedPrompt = `[EVENTO_UNO] ${message}`;
      const enhancedContext = {
        ...context,
        event_type: 'evento_uno',
        processing_mode: 'primary_block'
      };

      const response = await this.callLLM(enhancedPrompt, enhancedContext);
      
      return {
        text: response,
        event_type: 'evento_uno',
        processed_at: new Date().toISOString(),
        model_used: this.llmConfig.model
      };
    } catch (error) {
      console.error('Error manejando evento uno:', error);
      throw new Error('No se pudo procesar el evento uno');
    }
  }

  async handleEventTwo(message, context = null) {
    try {
      console.log('Manejando evento dos:', { message, context });
      
      // Agregar instrucciones específicas para evento dos
      const enhancedPrompt = `[EVENTO_DOS] ${message}`;
      const enhancedContext = {
        ...context,
        event_type: 'evento_dos',
        processing_mode: 'secondary_block'
      };

      const response = await this.callLLM(enhancedPrompt, enhancedContext);
      
      return {
        text: response,
        event_type: 'evento_dos',
        processed_at: new Date().toISOString(),
        model_used: this.llmConfig.model
      };
    } catch (error) {
      console.error('Error manejando evento dos:', error);
      throw new Error('No se pudo procesar el evento dos');
    }
  }
}

// Crear instancia única del servicio
const chatService = new ChatService();

module.exports = {
  processMessage: (message, context) => chatService.processMessage(message, context),
  handleEventOne: (message, context) => chatService.handleEventOne(message, context),
  handleEventTwo: (message, context) => chatService.handleEventTwo(message, context)
};
