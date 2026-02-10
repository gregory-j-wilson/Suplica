# Súplica Frontend

Modern React application for the Súplica Baptist missionary prayer platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── index.html           # HTML entry point
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
├── .gitignore          # Git ignore rules
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx         # Main application
    └── index.css       # Global styles
```

## 🔧 Configuration

### Change API URL

Edit `src/App.jsx` line 5:

```javascript
const API_BASE_URL = 'http://localhost/supplica-app/backend/api.php';
```

Update to your backend URL:

```javascript
const API_BASE_URL = 'https://yourdomain.com/api/api.php';
```

## 📦 Dependencies

### Runtime
- `react` - React library
- `react-dom` - React DOM
- `lucide-react` - Icon components

### Development
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `@vitejs/plugin-react` - React plugin
- `autoprefixer` - CSS processing
- `postcss` - CSS transformation

## 🎨 Technologies

- **React 18** - UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Lucide Icons** - Beautiful icons

## 🚀 Deployment

### Development
```bash
npm run dev
# Opens at http://localhost:3000
```

### Production Build
```bash
npm run build
# Output in dist/ folder
```

### Deploy dist/ folder
Upload the `dist/` folder contents to your web server.

## 📝 Notes

- Node.js 18+ required
- Backend must be running for full functionality
- Update API_BASE_URL before building for production
