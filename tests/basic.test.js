// Pruebas simples para verificar el funcionamiento del backend
// Ejecutar con: node tests/basic.test.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3002';

async function runTests() {
  console.log('🧪 Iniciando pruebas básicas del backend...\n');

  try {
    // Test 1: Verificar estado del servidor
    console.log('Test 1: Estado del servidor');
    const haltResponse = await axios.get(`${BASE_URL}/api/halt`);
    console.log('✅ Estado:', haltResponse.data.status);
    console.log('✅ Mensaje:', haltResponse.data.message);
    console.log('');

    // Test 2: Obtener documentación
    console.log('Test 2: Documentación');
    const docResponse = await axios.get(`${BASE_URL}/api/doc`);
    console.log('✅ Título:', docResponse.data.title);
    console.log('✅ Versión:', docResponse.data.version);
    console.log('');

    // Test 3: Enviar mensaje básico
    console.log('Test 3: Enviar mensaje');
    const messageResponse = await axios.post(`${BASE_URL}/api/chat/mensajes`, {
      message: 'Hola, este es un mensaje de prueba',
      context: { test: true }
    });
    console.log('✅ Respuesta exitosa:', messageResponse.data.success);
    console.log('✅ Respuesta del bot:', messageResponse.data.response.text);
    console.log('');

    // Test 4: Enviar mensaje con evento_uno
    console.log('Test 4: Mensaje con evento_uno');
    const eventOneResponse = await axios.post(`${BASE_URL}/api/chat/mensajes`, {
      message: 'Mensaje para evento uno',
      context: { user: 'lucia' },
      eventType: 'evento_uno'
    });
    console.log('✅ Tipo de evento:', eventOneResponse.data.eventType);
    console.log('✅ Respuesta del bot:', eventOneResponse.data.response.text);
    console.log('');

    // Test 5: Establecer contexto
    console.log('Test 5: Establecer contexto');
    const setContextResponse = await axios.post(`${BASE_URL}/api/context/context`, {
      userId: 'test_user_123',
      context: {
        name: 'Usuario de prueba',
        preferences: ['tech', 'ai'],
        session: 'test_session'
      }
    });
    console.log('✅ Contexto establecido:', setContextResponse.data.success);
    console.log('✅ Key:', setContextResponse.data.key);
    console.log('');

    // Test 6: Obtener contexto
    console.log('Test 6: Obtener contexto');
    const getContextResponse = await axios.get(`${BASE_URL}/api/context/context/test_user_123`);
    console.log('✅ Contexto obtenido:', getContextResponse.data.success);
    console.log('✅ Usuario:', getContextResponse.data.context.name);
    console.log('');

    console.log('🎉 Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    console.log('\n💡 Asegúrate de que el servidor esté ejecutándose en', BASE_URL);
  }
}

// Ejecutar las pruebas
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
