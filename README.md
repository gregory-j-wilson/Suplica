# Súplica Frontend - React Application

Modern React application for the Súplica Baptist missionary prayer platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PHP backend running (see ../backend)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── src/
    ├── main.jsx           # Application entry point
    ├── App.jsx            # Main React component
    └── index.css          # Global styles
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Configuration

The API endpoint is configured in `src/App.jsx`:

```javascript
const API_BASE_URL = 'http://localhost/supplica/backend/api.php';
```

Change this to match your backend URL.

## 🎨 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **PostCSS** - CSS processing

## 📦 Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder. Deploy these files to your web server.

## 🌐 Deployment

### Option 1: Deploy with PHP Backend

Copy the contents of `dist/` to your web server's public folder alongside the backend.

### Option 2: Deploy Separately

Deploy the `dist/` folder to a static hosting service (Netlify, Vercel, etc.) and update the API_BASE_URL to point to your backend server.

## 🔧 Environment Variables

Create a `.env` file for environment-specific configuration:

```
VITE_API_URL=http://localhost/supplica-app/backend/api.php
```

Then update App.jsx to use:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

## 📝 Development Notes

- Hot Module Replacement (HMR) is enabled for fast development
- Tailwind JIT mode compiles only used classes
- Icons are tree-shaken automatically
- Production builds are optimized and minified

## 🐛 Common Issues

### Port 3000 already in use
Change the port in `vite.config.js`:
```javascript
server: {
  port: 3001
}
```

### CORS errors
Ensure your PHP backend has proper CORS headers set in `api.php`.

### Build errors
Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
