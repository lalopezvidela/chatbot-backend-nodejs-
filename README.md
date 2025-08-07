# Chatbot Backend

Backend para chatbot desarrollado con Node.js y modelo LLM gratuito, optimizado para despliegue en Render.

## Características

- **Endpoints principales**: halt, doc, mensajes, context
- **Manejo de eventos**: Soporte para "evento uno" y "evento dos"
- **Contexto del usuario**: Proporcionado por el usuario, no generado por el LLM
- **Modelo LLM gratuito**: Integración con Hugging Face Inference API
- **Despliegue**: Optimizado para Render

## Estructura del Proyecto

```
backendd/
├── server.js              # Servidor principal
├── package.json           # Dependencias y scripts
├── .env.example          # Variables de entorno de ejemplo
├── routes/               # Rutas de la API
│   ├── chat.js          # Endpoint de mensajes
│   ├── context.js       # Gestión de contexto
│   └── doc.js           # Documentación
└── services/            # Servicios
    └── chatService.js   # Lógica del chatbot y LLM
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

3. Editar el archivo `.env` con tus configuraciones:
   - `GEMINI_API_KEY`: Tu clave de API de Google Gemini (gratuita)
   - `PORT`: Puerto del servidor (3000 por defecto)
   - `NODE_ENV`: Ambiente de ejecución

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Endpoints de la API

### 1. Estado del servidor
- **GET** `/api/halt`
- Verifica si el servidor está activo

### 2. Documentación
- **GET** `/api/doc`
- Obtiene la documentación completa de la API

### 3. Mensajes del chatbot
- **POST** `/api/chat/mensajes`
- Envía mensajes al chatbot
- Body:
  ```json
  {
    "message": "Tu mensaje aquí",
    "context": {
      "user": "lucia",
      "topic": "chatbot"
    },
    "eventType": "evento_uno"
  }
  ```

### 4. Gestión de contexto
- **POST** `/api/context/context` - Establecer contexto
- **GET** `/api/context/context/:userId` - Obtener contexto
- **PUT** `/api/context/context/:userId` - Actualizar contexto
- **DELETE** `/api/context/context/:userId` - Eliminar contexto

## Eventos

El sistema maneja dos tipos de eventos diferenciados:

- **evento_uno**: Primer bloque de información del usuario
- **evento_dos**: Segundo bloque de información del usuario

## Modelos LLM Soportados

### Google Gemini (Gratuito)
- `gemini-pro` (recomendado)
- `gemini-1.5-flash`
- `gemini-1.5-pro`

### Alternativas Locales
- Ollama con modelos como `llama2` (requiere instalación local)

## Despliegue en Render

1. Conecta tu repositorio en Render
2. Configura las variables de entorno en el dashboard de Render
3. El comando de inicio será: `npm start`
4. Puerto automático detectado por Render

### Variables de entorno para Render:
- `NODE_ENV=production`
- `GEMINI_API_KEY=tu_clave_aqui`
- `LLM_MODEL=gemini-pro`

## Ejemplo de Uso

```javascript
// Enviar mensaje con contexto
const response = await fetch('/api/chat/mensajes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: '¿Cómo puedes ayudarme?',
    context: {
      user: 'lucia',
      preferences: ['tech', 'ai']
    },
    eventType: 'evento_uno'
  })
});

const data = await response.json();
console.log(data.response);
```

## Flujo de Datos

1. El usuario envía información en dos bloques diferenciados
2. El sistema procesa cada evento según su tipo
3. El contexto es proporcionado por el usuario
4. El LLM genera respuestas basadas en el mensaje y contexto
5. Se devuelve la respuesta formateada al cliente

## Contribución

Este proyecto fue desarrollado para Lucía, explicado por el equipo y optimizado para compatibilidad con Render usando Node.js en lugar de Python 3.11.

## Licencia

ISC
