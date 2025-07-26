# Chat App - Aplicación de Chat en Tiempo Real

Una aplicación de chat moderna y profesional construida con Node.js, Express, Socket.IO y un diseño dark minimalista con glassmorphism.

## 🚀 Características

### ✨ **Funcionalidades Principales**
- **Chat en tiempo real** con Socket.IO
- **Diseño moderno y dark** con efectos glassmorphism
- **Interfaz responsive** para móviles y desktop
- **Indicador de escritura** en tiempo real
- **Notificaciones de usuarios** (conexión/desconexión)
- **Contador de usuarios** conectados
- **Mensajes del sistema** con diferentes tipos (join, leave, info)

### 🔒 **Seguridad y Robustez**
- **Manejo de errores** robusto con try-catch
- **Reconexión automática** del cliente con configuración
- **Seguridad mejorada** con Helmet y CORS
- **Rate limiting** para prevenir spam
- **Compresión** de respuestas HTTP
- **Validación y sanitización** de inputs
- **Escape de HTML** para prevenir XSS

### 🎨 **Experiencia de Usuario**
- **Animaciones suaves** y transiciones elegantes
- **Indicadores de estado** de conexión
- **Mensajes de error** con animación shake
- **Auto-scroll** inteligente
- **Focus automático** en el input
- **Soporte para Enter** para enviar mensajes

## 🛠️ Tecnologías

- **Backend**: Node.js 18+, Express.js 4.18.2
- **WebSockets**: Socket.IO 4.8.1
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Optimización**: Compression, Cache Headers
- **Desarrollo**: ESLint, Prettier, Nodemon

## 📦 Instalación

### Prerrequisitos
- Node.js 18.0.0 o superior
- npm o yarn

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tuusuario/chat-app.git
   cd chat-app
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   ```
   http://localhost:3000
   ```

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor en producción |
| `npm run dev` | Inicia el servidor en modo desarrollo con nodemon |
| `npm run lint` | Ejecuta ESLint para verificar el código |
| `npm run lint:fix` | Corrige automáticamente errores de linting |
| `npm run format` | Formatea el código con Prettier |
| `npm run clean` | Limpia e reinstala las dependencias |

## 🌐 Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Página principal del chat |
| `GET` | `/health` | Health check del servidor |
| `WS` | `/socket.io` | WebSocket para comunicación en tiempo real |

## 🔒 Seguridad Implementada

- **Helmet**: Headers de seguridad HTTP configurados
- **CORS**: Control de acceso entre dominios
- **Rate Limiting**: 100 requests por 15 minutos por IP
- **Input Sanitization**: Validación y límites en mensajes
- **XSS Protection**: Escape de HTML en el cliente
- **Content Security Policy**: Configurado para fuentes y scripts

## 📱 Características del Cliente

### **Gestión de Conexión**
- Reconexión automática con 5 intentos máximos
- Timeout de 20 segundos para conexión
- Indicadores visuales de estado de conexión
- Manejo de errores de red

### **Interfaz de Usuario**
- Mensaje de bienvenida personalizado
- Prompt para ingresar nombre de usuario
- Validación de longitud de mensajes (máximo 1000 caracteres)
- Indicador de escritura con timeout de 1 segundo

### **Funcionalidades Avanzadas**
- Mensajes del sistema con diferentes tipos
- Contador de usuarios en tiempo real
- Auto-scroll al enviar/recibir mensajes
- Estados disabled/enabled del input según conexión

## 🎨 Diseño y UX

### **Estilo Visual**
- **Tema dark** con gradientes elegantes
- **Glassmorphism** con backdrop-filter blur
- **Tipografía Inter** de Google Fonts
- **Animaciones CSS** suaves y profesionales
- **Responsive design** para todos los dispositivos

### **Componentes UI**
- Mensajes con bordes redondeados y sombras
- Botones con efectos hover y active
- Scrollbar personalizada
- Indicadores de estado con colores semánticos

## 📊 Monitoreo y Logging

El servidor incluye:
- **Logging detallado** de todas las operaciones
- **Health check** endpoint con métricas
- **Métricas** de usuarios conectados
- **Manejo de errores** global con try-catch
- **Graceful shutdown** para cierre limpio

## 🚀 Despliegue

### **Docker (Recomendado)**
```bash
# Construir imagen
docker build -t chat-app .

# Ejecutar contenedor
docker run -p 3000:3000 chat-app

# O usar docker-compose
docker-compose up -d
```

### **Heroku**
```bash
heroku create tu-chat-app
git push heroku main
```

### **Vercel**
```bash
vercel --prod
```

### **Variables de Entorno**
```bash
PORT=3000
NODE_ENV=production
```

## 🏗️ Arquitectura del Proyecto

```
chat-app/
├── config/
│   └── index.js          # Configuración del servidor
├── public/
│   ├── css/
│   │   └── style.css     # Estilos principales
│   ├── js/
│   │   └── client.js     # Cliente JavaScript
│   └── index.html        # Página principal
├── utils/
│   └── messageFormatter.js # Utilidades de formateo
├── server.mjs            # Servidor principal
├── package.json          # Dependencias y scripts
├── Dockerfile           # Configuración Docker
├── docker-compose.yml   # Orquestación Docker
└── README.md            # Documentación
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### **Guías de Contribución**
- Usa ESLint y Prettier para mantener el estilo del código
- Añade tests para nuevas funcionalidades
- Documenta cambios importantes
- Sigue las convenciones de commit

## 🐛 Solución de Problemas

### **Error de Express 5.x**
Si encuentras errores de compatibilidad, el proyecto usa Express 4.18.2 que es más estable.

### **Problemas de Conexión**
- Verifica que el puerto 3000 esté disponible
- Revisa los logs del servidor
- Comprueba la configuración de CORS

### **Problemas de Dependencias**
```bash
npm run clean
npm install
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE.TXT) para detalles.

## 👨‍💻 Autor

**Patterson**
- GitHub: [@KevPatterson](https://github.com/KevPatterson)
- Email: kevinpatterson618@gmail.com

## 🙏 Agradecimientos

- [Socket.IO](https://socket.io/) por la librería de WebSockets
- [Express.js](https://expressjs.com/) por el framework web
- [Inter Font](https://rsms.me/inter/) por la tipografía
- [Google Fonts](https://fonts.google.com/) por el hosting de fuentes

## 📞 Soporte

Si tienes alguna pregunta o problema:

1. **Revisa la documentación** en este README
2. **Busca en los issues** existentes
3. **Crea un nuevo issue** con detalles del problema
4. **Incluye logs** y pasos para reproducir el error

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!

**Versión**: 1.0.0  
**Última actualización**: Julio 2025
