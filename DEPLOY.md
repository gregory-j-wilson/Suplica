# 🚀 Súplica Frontend - Quick Deploy Guide

## ✅ EASY DEPLOYMENT (No Build Required)

Just open `index.html` in your browser - that's it!

**URL:** `http://localhost/supplica-app/frontend/index.html`

---

## 📁 Important Files

### For Deployment (No npm needed):
- `index.html` - **Main file - Open this!**
- `src/App-standalone.jsx` - React app (CDN version)

### For Development (npm build):
- `src/App.jsx` - React app (ES6 imports version)
- `src/main.jsx` - Vite entry point
- `package.json` - npm dependencies
- `vite.config.js` - Build configuration

---

## 🔧 Configuration

### Change API URL

Edit `src/App-standalone.jsx` line 8:

```javascript
const API_BASE_URL = 'http://localhost/supplica-app/backend/api.php';
```

Change to your server:
```javascript
const API_BASE_URL = 'http://yourdomain.com/backend/api.php';
```

---

## 🎯 Two Deployment Options

### Option 1: Simple Deployment (Recommended for most users)
1. Copy `frontend/` folder to your server
2. Edit API URL in `src/App-standalone.jsx`
3. Open `index.html` in browser
4. Done! ✅

### Option 2: npm Build (For advanced users)
1. Install Node.js 18+
2. Run `npm install`
3. Run `npm run build`
4. Deploy `dist/` folder
5. Faster performance ⚡

---

## ✅ Quick Checklist

- [ ] Backend is running (check `http://localhost/supplica-app/backend/api.php/misiones`)
- [ ] API URL is correct in `src/App-standalone.jsx`
- [ ] Open `index.html` in browser
- [ ] See missions on the page

---

## 🐛 Troubleshooting

**Blank screen?**
1. Open browser console (F12)
2. Check for errors
3. Verify API URL is correct
4. Make sure backend is running

**No missions showing?**
1. Check database has data
2. Verify CORS headers in backend
3. Check network tab in browser console

**Icons not showing?**
- Make sure you have internet connection (icons load from CDN)

---

That's it! For more details, see the main documentation in the project root.
