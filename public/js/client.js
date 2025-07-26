class ChatClient {
  constructor() {
    this.socket = null;
    this.username = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    
    this.messagesDiv = document.getElementById('messages');
    this.typingDiv = document.getElementById('typing-indicator');
    this.chatForm = document.getElementById('chat-form');
    this.msgInput = document.getElementById('msg');
    this.sendButton = document.querySelector('button[type="submit"]');
    
    this.typingTimeout = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.connect();
    this.showWelcomeMessage();
  }

  setupEventListeners() {
    // Formulario de chat
    this.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    // Indicador de escritura
    this.msgInput.addEventListener('input', () => {
      this.handleTyping();
    });

    // Manejo de teclas
    this.msgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Focus automático
    this.msgInput.addEventListener('focus', () => {
      this.scrollToBottom();
    });
  }

  connect() {
    try {
      this.socket = io({
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      });

      this.setupSocketListeners();
    } catch (error) {
      console.error('Error al conectar:', error);
      this.showError('Error de conexión. Reintentando...');
      setTimeout(() => this.connect(), 3000);
    }
  }

  setupSocketListeners() {
    // Conexión establecida
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.updateConnectionStatus('Conectado', 'success');
      this.enableInput();
      
      if (this.username) {
        this.socket.emit('join', this.username);
      }
    });

    // Desconexión
    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.updateConnectionStatus('Desconectado', 'error');
      this.disableInput();
      
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    // Error de conexión
    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
      this.reconnectAttempts++;
      this.updateConnectionStatus('Error de conexión', 'error');
      this.disableInput();
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.showError('No se pudo conectar al servidor. Recarga la página.');
      }
    });

    // Mensajes
    this.socket.on('message', (msg) => {
      this.addMessage(msg);
    });

    // Usuario se unió
    this.socket.on('userJoined', (data) => {
      this.addSystemMessage(`${data.username} se unió al chat`, 'join');
      this.updateUserCount(data.userCount);
    });

    // Usuario se fue
    this.socket.on('userLeft', (data) => {
      this.addSystemMessage(`${data.username} se desconectó`, 'leave');
      this.updateUserCount(data.userCount);
    });

    // Indicador de escritura
    this.socket.on('typing', (user) => {
      this.showTypingIndicator(user);
    });

    this.socket.on('stopTyping', () => {
      this.hideTypingIndicator();
    });
  }

  showWelcomeMessage() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
      <h2>¡Bienvenido al Chat!</h2>
      <p>Ingresa tu nombre para comenzar a chatear</p>
    `;
    this.messagesDiv.appendChild(welcomeDiv);
  }

  promptUsername() {
    const name = prompt('¿Cómo te llamas?', 'Anónimo');
    if (name && name.trim()) {
      this.username = name.trim();
      if (this.isConnected) {
        this.socket.emit('join', this.username);
      }
      return true;
    }
    return false;
  }

  sendMessage() {
    if (!this.username) {
      if (!this.promptUsername()) {
        return;
      }
    }

    const text = this.msgInput.value.trim();
    if (!text || !this.isConnected) return;

    // Validar longitud del mensaje
    if (text.length > 1000) {
      this.showError('El mensaje es demasiado largo (máximo 1000 caracteres)');
      return;
    }

    // Enviar mensaje
    this.socket.emit('chatMessage', { username: this.username, text });
    
    // Limpiar input
    this.msgInput.value = '';
    this.msgInput.focus();
    
    // Detener indicador de escritura
    this.socket.emit('stopTyping');
    this.hideTypingIndicator();
  }

  handleTyping() {
    if (!this.isConnected || !this.username) return;

    clearTimeout(this.typingTimeout);
    
    if (this.msgInput.value.trim()) {
      this.socket.emit('typing', this.username);
    } else {
      this.socket.emit('stopTyping');
    }

    this.typingTimeout = setTimeout(() => {
      this.socket.emit('stopTyping');
    }, 1000);
  }

  addMessage(msg) {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `
      <p class="meta">
        ${this.escapeHtml(msg.username)} 
        <span>${msg.time}</span>
      </p>
      <p class="text">${this.escapeHtml(msg.text)}</p>
    `;
    
    this.messagesDiv.appendChild(div);
    this.scrollToBottom();
  }

  addSystemMessage(text, type = 'info') {
    const div = document.createElement('div');
    div.className = `system-message ${type}`;
    div.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
    
    this.messagesDiv.appendChild(div);
    this.scrollToBottom();
  }

  showTypingIndicator(user) {
    this.typingDiv.textContent = `${this.escapeHtml(user)} está escribiendo...`;
    this.typingDiv.style.display = 'block';
  }

  hideTypingIndicator() {
    this.typingDiv.style.display = 'none';
  }

  updateConnectionStatus(status, type) {
    // Crear o actualizar indicador de estado
    let statusDiv = document.getElementById('connection-status');
    if (!statusDiv) {
      statusDiv = document.createElement('div');
      statusDiv.id = 'connection-status';
      statusDiv.className = 'connection-status';
      document.body.appendChild(statusDiv);
    }
    
    statusDiv.textContent = status;
    statusDiv.className = `connection-status ${type}`;
    
    setTimeout(() => {
      statusDiv.style.opacity = '0';
    }, 3000);
  }

  updateUserCount(count) {
    // Actualizar contador de usuarios si existe
    let userCountDiv = document.getElementById('user-count');
    if (!userCountDiv) {
      userCountDiv = document.createElement('div');
      userCountDiv.id = 'user-count';
      userCountDiv.className = 'user-count';
      document.querySelector('#chat-container').appendChild(userCountDiv);
    }
    userCountDiv.textContent = `${count} usuarios conectados`;
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    this.messagesDiv.appendChild(errorDiv);
    this.scrollToBottom();
    
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  enableInput() {
    this.msgInput.disabled = false;
    this.sendButton.disabled = false;
    this.msgInput.placeholder = 'Escribe tu mensaje...';
  }

  disableInput() {
    this.msgInput.disabled = true;
    this.sendButton.disabled = true;
    this.msgInput.placeholder = 'Conectando...';
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
    }, 100);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ChatClient();
});
