/**
 * Formatea un mensaje de chat con validaciones y mejor formato de tiempo
 * @param {string} username - Nombre del usuario
 * @param {string} text - Texto del mensaje
 * @returns {Object} Mensaje formateado
 */
export function formatMessage(username, text) {
  // Validaciones
  if (!username || typeof username !== 'string') {
    throw new Error('Username es requerido y debe ser una cadena');
  }
  
  if (!text || typeof text !== 'string') {
    throw new Error('Text es requerido y debe ser una cadena');
  }

  // Sanitizar inputs
  const sanitizedUsername = username.trim().substring(0, 50);
  const sanitizedText = text.trim().substring(0, 1000);

  // Formato de tiempo más detallado
  const now = new Date();
  const timeString = now.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return {
    username: sanitizedUsername,
    text: sanitizedText,
    time: timeString,
    timestamp: now.toISOString(),
    id: generateMessageId()
  };
}

/**
 * Genera un ID único para el mensaje
 * @returns {string} ID único
 */
function generateMessageId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Formatea un mensaje del sistema
 * @param {string} text - Texto del mensaje
 * @param {string} type - Tipo de mensaje (info, warning, error)
 * @returns {Object} Mensaje del sistema formateado
 */
export function formatSystemMessage(text, type = 'info') {
  if (!text || typeof text !== 'string') {
    throw new Error('Text es requerido y debe ser una cadena');
  }

  const now = new Date();
  return {
    text: text.trim(),
    type,
    time: now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    timestamp: now.toISOString(),
    isSystem: true
  };
}
  