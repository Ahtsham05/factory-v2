# Factory Management MERN Application

A complete factory management system built with MongoDB, Express.js, React (Vite), and Node.js with voice-to-text functionality.

## 🚀 Quick Start (Single Click Launch)

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (for database) - [Download here](https://www.mongodb.com/try/download/community)

### Single Click Launch Options

#### Option 1: GUI Launcher (Recommended)
Double-click on `launcher.py` or run:
```bash
python3 launcher.py
```

This will open a GUI application that allows you to:
- ✅ Start the application with one click
- 📊 Monitor logs in real-time  
- 🌐 Automatically open in browser
- ⏹️ Stop the application cleanly

#### Option 2: Shell Script (Linux/macOS)
Double-click on `start-app.sh` or run:
```bash
./start-app.sh
```

#### Option 3: Batch File (Windows)
Double-click on `start-app.bat`

#### Option 4: Desktop Shortcut (Linux)
Double-click on `Factory-App.desktop`

### Manual Launch
If you prefer to run manually:
```bash
npm run dev
```

## 🎙️ Voice-to-Text Features

This application includes voice-to-text functionality using the **native browser Speech Recognition API**:
- ✅ **Chrome/Chromium** - Full support with excellent accuracy
- ✅ **Microsoft Edge** - Full support with excellent accuracy  
- ✅ **Safari (WebKit)** - Good support on macOS/iOS
- ❌ **Firefox** - Limited support (experimental)
- ✅ **Multi-language** - Supports English and Urdu (Pakistan)

### Voice Recognition Support
- **Web Browsers**: Best experience in Chrome and Edge
- **Languages**: 
  - English (Pakistan) - `en-PK`
  - Urdu (Pakistan) - `ur-PK`
- **Internet Required**: For best accuracy (uses Google's speech service)
- **Microphone Permissions**: Required for voice input

### Why Browser-based Speech Recognition?
- **Better Accuracy**: Uses Google's advanced speech recognition
- **Real-time Processing**: Instant transcription
- **No Additional Dependencies**: Uses built-in browser capabilities
- **Reliable**: Proven technology used by millions of web applications
- **Regular Updates**: Automatically improved by browser vendors

## 📁 Project Structure

```
factory-v.2/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── hooks/
│   │   │   └── use-voice-input.tsx    # Voice recognition hook
│   │   └── utils/
│   │       └── speech-polyfill.ts     # Speech recognition polyfill
│   └── package.json
├── server/                 # Express.js backend
│   ├── src/
│   └── package.json
├── launcher.py            # GUI launcher (cross-platform)
├── start-app.sh          # Shell script launcher (Linux/macOS)
├── start-app.bat         # Batch file launcher (Windows)
├── Factory-App.desktop   # Desktop shortcut (Linux)
└── package.json          # Root package with scripts
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run start` - Start both frontend and backend in production mode
- `npm run build` - Build both client and server
- `npm run install-all` - Install dependencies for all projects
- `npm run setup` - Install all dependencies and build

### Client (Frontend)
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server (Backend)
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run start` - Start production server
- `npm run build` - Build for production

## 🌐 Application URLs

When running:
- **Frontend (React)**: http://localhost:5173
- **Backend (Express)**: http://localhost:3000

## 🔌 Offline Capabilities

### Voice Recognition Offline
The application uses the browser's native Speech Recognition API:

1. **Chrome/Edge** - Uses Google's speech service (requires internet)
2. **Safari** - Uses Apple's speech service (requires internet)  
3. **Fallback** - Graceful error handling for unsupported browsers
4. **Local Processing** - Speech recognition runs in the browser (no server needed)

### Database Offline
- MongoDB runs locally for offline database access
- All data is stored locally on your machine

### Application Offline
- Frontend assets are served locally
- Backend API runs locally
- No internet connection required for the application itself (only for voice recognition)

## 🛠️ Development Setup

If you want to set up the development environment manually:

1. **Clone and Install**
```bash
git clone <repository-url>
cd "factory v.2"
npm run install-all
```

2. **Environment Setup**
Create `.env` files in both client and server directories as needed.

3. **Start Development**
```bash
npm run dev
```

## 📱 Voice Input Usage

In any input field with voice support:
1. Click the microphone icon
2. Grant microphone permissions if prompted
3. Speak clearly in English or Urdu
4. The text will automatically appear in the input field

### Voice Input Features
- **Automatic language detection** based on app language
- **Error handling** with user-friendly messages
- **Permission management** with clear instructions
- **Offline fallback** for limited internet connectivity

## 🚨 Troubleshooting

### Voice Recognition Issues
- **No microphone access**: Check browser permissions (click the lock icon in address bar)
- **Not working**: Ensure you're using Chrome, Edge, or Safari
- **Poor accuracy**: Speak clearly and ensure good internet connection
- **Firefox users**: Voice recognition has limited support in Firefox

### Application Won't Start
- **Check Node.js version**: Must be v16 or higher
- **Check MongoDB**: Ensure MongoDB is installed and running
- **Port conflicts**: Make sure ports 3000 and 5173 are available

### Dependencies Issues
- **Run**: `npm run install-all` to reinstall all dependencies
- **Clear cache**: `npm cache clean --force`
- **Delete node_modules**: Remove all `node_modules` folders and reinstall

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially voice features)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console logs in the launcher GUI
3. Ensure all prerequisites are installed correctly

---

**Happy coding! 🎉**
