import React, { useState, useEffect, useRef } from 'react';
import { Home, PlusCircle, Users, BarChart3, Book, Bell, Menu, X, LogOut, Send, ArrowLeft, MapPin } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';


// API Configuration
const API_BASE_URL = 'https://selahcreativeservices.com/suplica-backend/api.php';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [misiones, setMisiones] = useState([]);
  const [circulos, setCirculos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMision, setSelectedMision] = useState(null);
  const [misioneros, setMisioneros] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('supplica_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      loadMisiones();
      loadCirculos();
      loadEstadisticas();
      loadMisioneros()
    }
  }, [isAuthenticated, currentUser]);

  const loadMisiones = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?endpoint=misiones&publico=1`);
      const data = await response.json();
      if (data.success) {
        setMisiones(data.data);
      }
    } catch (error) {
      console.error('Error cargando misiones:', error);
    }
  };

  const loadMisioneros = async () => {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${API_BASE_URL}?endpoint=misioneros&_t=${timestamp}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    const data = await response.json();
    if (data.success) {
      setMisioneros(data.data);
    }
  } catch (error) {
    console.error('Error cargando misioneros:', error);
  }
};

  const loadCirculos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?endpoint=circulos&usuario_id=${currentUser.id}`);
      const data = await response.json();
      if (data.success) {
        setCirculos(data.data);
      }
    } catch (error) {
      console.error('Error cargando círculos:', error);
    }
  };

  const loadEstadisticas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}?endpoint=estadisticas&id=${currentUser.id}`);
      const data = await response.json();
      if (data.success) {
        setEstadisticas(data.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('supplica_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('supplica_user');
    setCurrentView('home');
    setSelectedMision(null);
  };

  const handleOpenPrayerRoom = (mision) => {
    setSelectedMision(mision);
    setCurrentView('prayer-room');
  };

  const handleClosePrayerRoom = () => {
    setSelectedMision(null);
    setCurrentView('home');
    loadMisiones();
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  if (currentView === 'prayer-room' && selectedMision) {
    return (
      <PrayerRoomView 
        mision={selectedMision} 
        currentUser={currentUser} 
        onClose={handleClosePrayerRoom}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-blue-900 shadow-lg sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-4">
      {/* Logo */}
      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-1.5 sm:p-2 rounded-xl">
          <Book className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" />
        </div>
        <h1 className="text-lg sm:text-2xl font-bold text-yellow-200">
          Súplica
        </h1>
      </div>
      
      {/* Desktop Navigation - Hidden on medium and below */}
      <nav className="hidden lg:flex space-x-4 xl:space-x-8">
        <NavButton icon={Home} label="Inicio" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
           <NavButton icon={MapPin} label="Misioneros" active={currentView === 'misioneros'} onClick={() => setCurrentView('misioneros')} />
        <NavButton icon={PlusCircle} label="Nueva Misión" active={currentView === 'nueva'} onClick={() => setCurrentView('nueva')} />
        <NavButton icon={Users} label="Círculos" active={currentView === 'circulos'} onClick={() => setCurrentView('circulos')} />
        <NavButton icon={BarChart3} label="Estadísticas" active={currentView === 'stats'} onClick={() => setCurrentView('stats')} />
       
      </nav>

      {/* Right side actions */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Username - only on larger screens */}
        <span className="text-yellow-200 text-xs sm:text-sm hidden xl:block">{currentUser?.nombre}</span>
        
        {/* Logout button */}
        <button 
          onClick={handleLogout}
          className="p-1.5 sm:p-2 hover:bg-blue-800 rounded-full transition text-yellow-200"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        {/* Notifications
        <button className="relative p-1.5 sm:p-2 hover:bg-blue-800 rounded-full transition">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-200" />
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}
        
        {/* Mobile menu button - shows on lg and below */}
        <button 
          className="lg:hidden p-1.5 sm:p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" />}
        </button>
      </div>
    </div>

    {/* Mobile Menu */}
    {mobileMenuOpen && (
      <div className="lg:hidden py-4 border-t border-blue-800">
        <div className="flex flex-col space-y-2">
          <MobileNavButton icon={Home} label="Inicio" onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }} />
            <MobileNavButton icon={MapPin} label="Nuestros Misioneros" onClick={() => { setCurrentView('misioneros'); setMobileMenuOpen(false); }} />
          <MobileNavButton icon={PlusCircle} label="Nueva Misión" onClick={() => { setCurrentView('nueva'); setMobileMenuOpen(false); }} />
          <MobileNavButton icon={Users} label="Círculos" onClick={() => { setCurrentView('circulos'); setMobileMenuOpen(false); }} />
          <MobileNavButton icon={BarChart3} label="Estadísticas" onClick={() => { setCurrentView('stats'); setMobileMenuOpen(false); }} />
          
          
          {/* User info in mobile menu */}
          <div className="pt-4 mt-2 border-t border-blue-800">
            <div className="px-4 py-2 text-yellow-200 text-sm">
              👤 {currentUser?.nombre}
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
</header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && <HomeView misiones={misiones} currentUser={currentUser} onUpdate={loadMisiones} onOpenPrayerRoom={handleOpenPrayerRoom} />}
        {currentView === 'nueva' && <NuevaMisionView currentUser={currentUser} onCreated={() => { loadMisiones(); setCurrentView('home'); }} />}
        {currentView === 'circulos' && <CirculosView circulos={circulos} currentUser={currentUser} onUpdate={loadCirculos} />}
        {currentView === 'stats' && <EstadisticasView stats={estadisticas} />}
        {currentView === 'misioneros' && <MisionerosView misioneros={misioneros} onRefresh={loadMisioneros} />}
      </main>

      <footer className="bg-blue-900 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-yellow-200 text-sm">
          <p>Súplica - Comunidad de Oración para Misioneros Bautistas</p>
          <p className="mt-2 text-yellow-300 opacity-75">🙏 Orando juntos por las misiones 🌍</p>
        </div>
      </footer>
    </div>
  );
}

// Prayer Room View
const PrayerRoomView = ({ mision, currentUser, onClose, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pollIntervalRef = useRef(null);
  const isSendingRef = useRef(false); // Track if we're sending

const loadMessages = async () => {
  if (isSendingRef.current) {
    return;
  }

  try {
    // Add timestamp to bust cache
    const timestamp = Date.now();
    const url = `${API_BASE_URL}?endpoint=prayer_room&id=${mision.id}&_t=${timestamp}`;

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.data)) {
      setMessages(data.data);
    }
    setIsLoading(false);
  } catch (error) {
    console.error('Error loading messages:', error);
    setIsLoading(false);
  }
};

  useEffect(() => {
    loadMessages();
    const interval = setInterval(() => {
      // Only poll if not sending
      if (!isSendingRef.current) {
        loadMessages();
      }
    }, 2000);
    pollIntervalRef.current = interval;
    
    return () => clearInterval(interval);
  }, [mision.id]);

  const handleSendMessage = async (e) => {
  e.preventDefault();
  if (!newMessage.trim() || sending) return;

  const messageText = newMessage.trim();
  setSending(true);
  isSendingRef.current = true;
  setNewMessage('');

  try {
    // Add timestamp to POST request too
    const timestamp = Date.now();
    const response = await fetch(`${API_BASE_URL}?endpoint=prayer_room&_t=${timestamp}`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({
        mision_id: mision.id,
        usuario_id: currentUser.id,
        mensaje: messageText
      })
    });

    const data = await response.json();
    
    if (data.success && data.data) {
      // Add message to state immediately
      setMessages(prev => [...prev, data.data]);
      
      // Wait 1 second for backend to fully commit, then force reload
      setTimeout(() => {
        isSendingRef.current = false;
        loadMessages();
      }, 1000);
    } else {
      isSendingRef.current = false;
      alert('Error al enviar oración');
      setNewMessage(messageText);
    }
  } catch (error) {
    isSendingRef.current = false;
    console.error('Error:', error);
    alert('Error de conexión');
    setNewMessage(messageText);
  } finally {
    setSending(false);
  }
};

  const categoriaIcons = {
    apoyo_financiero: '💰',
    visa_permiso: '📋',
    salud_seguridad: '🏥',
    plantacion_iglesia: '⛪',
    idioma_cultura: '🗣️',
    ninos_educacion: '👨‍👩‍👧‍👦',
    socios_oracion: '🙏',
    otro: '✝️'
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-blue-900 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onClose} className="flex items-center space-x-2 text-yellow-200 hover:text-yellow-100 transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Volver</span>
            </button>
            <button onClick={onLogout} className="p-2 hover:bg-blue-800 rounded-full transition text-yellow-200" title="Cerrar sesión">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-blue-800 to-blue-900 border-b border-blue-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-start space-x-3">
            <span className="text-4xl">{categoriaIcons[mision.categoria]}</span>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-yellow-200 mb-2">{mision.titulo}</h2>
              <p className="text-yellow-300 text-sm opacity-90">{mision.descripcion}</p>
              <div className="mt-3 flex items-center space-x-4 text-sm text-yellow-300">
                <span>👤 {mision.nombre_usuario}</span>
                <span>🙏 {messages.length} oraciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-yellow-300">Cargando oraciones...</p>
            </div>
          )}

          {!isLoading && messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-yellow-300 text-lg mb-2">Sé el primero en orar por esta misión</p>
              <p className="text-yellow-400 opacity-75 text-sm">Escribe tu oración abajo para comenzar</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.usuario_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md rounded-2xl px-4 py-3 ${msg.usuario_id === currentUser.id ? 'bg-blue-800 text-yellow-200' : 'bg-gray-800 text-yellow-200'}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center text-yellow-200 text-xs font-bold border border-blue-500">
                    {msg.nombre_usuario.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold opacity-90">{msg.nombre_usuario}</span>
                </div>
                <p className="text-sm leading-relaxed">{msg.mensaje}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(msg.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu oración aquí..."
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-200 font-semibold rounded-lg hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">{sending ? 'Enviando...' : 'Enviar'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


// Auth View
const AuthView = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await fetch(`${API_BASE_URL}?endpoint=usuarios`);
        const data = await response.json();
        
        if (data.success) {
          const user = data.data.find(u => u.email === formData.email);
          if (user) {
            onLogin(user);
          } else {
            setError('Email o contraseña incorrectos');
          }
        }
      } else {
        const response = await fetch(`${API_BASE_URL}?endpoint=usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            biografia: ''
          })
        });

        const data = await response.json();
        
        if (data.success) {
          onLogin({ id: data.id, nombre: formData.nombre, email: formData.email });
        } else {
          setError(data.message || 'Error al crear cuenta');
        }
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-2xl mb-4">
            <Book className="w-12 h-12 text-yellow-200" />
          </div>
          <h1 className="text-4xl font-bold text-yellow-200 mb-2">Súplica</h1>
          <p className="text-yellow-300 text-lg">Comunidad de Oración Misionera</p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="flex mb-6">
            <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 font-semibold rounded-lg transition ${isLogin ? 'bg-blue-800 text-yellow-200' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
              Iniciar Sesión
            </button>
            <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 font-semibold rounded-lg transition ml-2 ${!isLogin ? 'bg-blue-800 text-yellow-200' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}>
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-yellow-200 mb-2">Nombre Completo</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Juan Pérez" required />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-yellow-200 mb-2">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="tu@email.com" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-yellow-200 mb-2">Contraseña</label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="••••••••" required />
            </div>

            {error && <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-200 font-bold rounded-lg hover:from-blue-600 hover:to-blue-800 transition shadow-lg disabled:opacity-50">
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-yellow-300 hover:text-yellow-200 font-semibold">
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">Plataforma de oración para misioneros bautistas fundamentales</p>
      </div>
    </div>
  );
};

// Navigation Components
const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${active ? 'bg-blue-700 text-yellow-200' : 'text-yellow-300 hover:bg-blue-800'}`}>
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const MobileNavButton = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition">
    <Icon className="w-5 h-5 text-yellow-300" />
    <span className="font-medium text-yellow-200">{label}</span>
  </button>
);

// Home View
const HomeView = ({ misiones, currentUser, onUpdate, onOpenPrayerRoom }) => {
  const [filter, setFilter] = useState('todas');

  const filteredMisiones = misiones.filter(m => {
    if (filter === 'todas') return true;
    if (filter === 'mis-misiones') return m.usuario_id === currentUser.id;
    return m.categoria === filter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-800 rounded-2xl p-8 shadow-xl border border-blue-700">
        <h2 className="text-3xl font-bold mb-2 text-yellow-200">Oremos juntos por nuestras misiones</h2>
        <p className="text-yellow-300 text-lg">{misiones.length} peticiones activas esperando tu intercesión</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterButton label="Todas" active={filter === 'todas'} onClick={() => setFilter('todas')} />
        <FilterButton label="Mis Misiones" active={filter === 'mis-misiones'} onClick={() => setFilter('mis-misiones')} />
        <FilterButton label="Apoyo Financiero" active={filter === 'apoyo_financiero'} onClick={() => setFilter('apoyo_financiero')} />
        <FilterButton label="Visa/Permiso" active={filter === 'visa_permiso'} onClick={() => setFilter('visa_permiso')} />
        <FilterButton label="Salud/Seguridad" active={filter === 'salud_seguridad'} onClick={() => setFilter('salud_seguridad')} />
        <FilterButton label="Plantación Iglesia" active={filter === 'plantacion_iglesia'} onClick={() => setFilter('plantacion_iglesia')} />
        <FilterButton label="Idioma/Cultura" active={filter === 'idioma_cultura'} onClick={() => setFilter('idioma_cultura')} />
        <FilterButton label="Niños/Educación" active={filter === 'ninos_educacion'} onClick={() => setFilter('ninos_educacion')} />
        <FilterButton label="Socios Oración" active={filter === 'socios_oracion'} onClick={() => setFilter('socios_oracion')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMisiones.map(mision => (
          <MisionCard key={mision.id} mision={mision} currentUser={currentUser} onUpdate={onUpdate} onOpenPrayerRoom={onOpenPrayerRoom} />
        ))}
      </div>

      {filteredMisiones.length === 0 && (
        <div className="text-center py-12">
          <p className="text-yellow-300 text-lg">No hay misiones en esta categoría</p>
        </div>
      )}
    </div>
  );
};

const FilterButton = ({ label, active, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-full font-medium transition ${active ? 'bg-blue-800 text-yellow-200 shadow-md border border-blue-600' : 'bg-gray-800 text-yellow-300 hover:bg-gray-700 border border-gray-700'}`}>
    {label}
  </button>
);

const MisionCard = ({ mision, currentUser, onUpdate, onOpenPrayerRoom }) => {
  const urgenciaColors = {
    baja: 'bg-green-900 text-green-200 border-green-700',
    media: 'bg-yellow-900 text-yellow-200 border-yellow-700',
    alta: 'bg-orange-900 text-orange-200 border-orange-700',
    critica: 'bg-red-900 text-red-200 border-red-700'
  };

  const categoriaIcons = {
    apoyo_financiero: '💰',
    visa_permiso: '📋',
    salud_seguridad: '🏥',
    plantacion_iglesia: '⛪',
    idioma_cultura: '🗣️',
    ninos_educacion: '👨‍👩‍👧‍👦',
    socios_oracion: '🙏',
    otro: '✝️'
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition p-6 space-y-4 border border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{categoriaIcons[mision.categoria]}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${urgenciaColors[mision.nivel_urgencia]}`}>
            {mision.nivel_urgencia}
          </span>
        </div>
        <span className="text-sm text-yellow-300">{mision.total_oraciones} 🙏</span>
      </div>

      <div>
        <h3 className="font-bold text-lg text-yellow-200 mb-2">{mision.titulo}</h3>
        <p className="text-yellow-300 text-sm line-clamp-3 opacity-90">{mision.descripcion}</p>
      </div>

      <div className="flex items-center space-x-2 text-sm text-yellow-300">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center text-yellow-200 font-bold border border-blue-600">
          {mision.nombre_usuario.charAt(0)}
        </div>
        <span>{mision.nombre_usuario}</span>
      </div>

      <button onClick={() => onOpenPrayerRoom(mision)} className="w-full py-3 rounded-lg font-semibold transition bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-200 hover:from-blue-600 hover:to-blue-800 border border-blue-600">
        Orar por esta misión
      </button>
    </div>
  );
};

// Nueva Mision View
const NuevaMisionView = ({ currentUser, onCreated }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'otro',
    nivel_urgencia: 'media',
    publico: true,
    fecha_inicio: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE_URL}?endpoint=misiones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, usuario_id: currentUser.id })
      });
      
      const data = await response.json();
      if (data.success) {
        onCreated();
      }
    } catch (error) {
      console.error('Error creando misión:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-yellow-200">Comparte tu misión de oración</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">Título de tu petición</label>
            <input type="text" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Ej: Renovación de visa misionera" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">Descripción</label>
            <textarea value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} rows="4" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent" placeholder="Comparte los detalles de tu petición..." required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-yellow-200 mb-2">Categoría</label>
              <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <option value="apoyo_financiero">💰 Apoyo Financiero</option>
                <option value="visa_permiso">📋 Visa/Permiso</option>
                <option value="salud_seguridad">🏥 Salud/Seguridad</option>
                <option value="plantacion_iglesia">⛪ Plantación de Iglesia</option>
                <option value="idioma_cultura">🗣️ Idioma/Cultura</option>
                <option value="ninos_educacion">👨‍👩‍👧‍👦 Niños/Educación</option>
                <option value="socios_oracion">🙏 Socios de Oración</option>
                <option value="otro">✝️ Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-yellow-200 mb-2">Urgencia</label>
              <select value={formData.nivel_urgencia} onChange={(e) => setFormData({...formData, nivel_urgencia: e.target.value})} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="publico" checked={formData.publico} onChange={(e) => setFormData({...formData, publico: e.target.checked})} className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
            <label htmlFor="publico" className="text-sm text-yellow-200">Compartir públicamente (todos podrán orar por esta misión)</label>
          </div>

          <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-200 font-bold rounded-lg hover:from-blue-600 hover:to-blue-800 transition shadow-lg border border-blue-600">
            Crear Misión de Oración
          </button>
        </form>
      </div>
    </div>
  );
};

// Circulos View
const CirculosView = ({ circulos }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-yellow-200">Mis Círculos de Oración</h2>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-200 font-semibold rounded-lg hover:from-blue-600 hover:to-blue-800 transition border border-blue-600">
          + Crear Círculo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {circulos.map(circulo => (
          <div key={circulo.id} className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-xl text-yellow-200">{circulo.nombre}</h3>
                <p className="text-yellow-300 text-sm mt-1 opacity-90">{circulo.descripcion}</p>
              </div>
              <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs font-medium border border-blue-700">
                {circulo.total_miembros} miembros
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <span className="text-sm text-yellow-300">Código: {circulo.codigo_invitacion}</span>
              <button className="px-4 py-2 text-blue-300 font-medium hover:bg-gray-700 rounded-lg transition">Ver círculo →</button>
            </div>
          </div>
        ))}
      </div>

      {circulos.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-yellow-300 text-lg">Aún no tienes círculos de oración</p>
          <p className="text-yellow-400 opacity-75 mt-2">Crea uno para comenzar a orar en comunidad</p>
        </div>
      )}
    </div>
  );
};

// Estadisticas View
const EstadisticasView = ({ stats }) => {
  if (!stats) return <div className="text-center text-yellow-200">Cargando estadísticas...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-200">Mis Estadísticas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon="🙏" label="Oraciones" value={stats.total_oraciones || 0} color="from-blue-700 to-blue-900" />
        <StatCard icon="🎯" label="Mis Misiones" value={stats.total_misiones || 0} color="from-blue-800 to-gray-900" />
        <StatCard icon="✅" label="Respondidas" value={stats.misiones_respondidas || 0} color="from-green-800 to-green-950" />
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <h3 className="font-bold text-lg mb-4 text-yellow-200">Progreso de Oración</h3>
        <div className="space-y-3">
          <ProgressBar label="Oraciones este mes" current={stats.total_oraciones} goal={100} color="blue" />
          <ProgressBar label="Meta anual" current={stats.total_oraciones} goal={365} color="blue" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-yellow-200 shadow-lg border border-blue-700`}>
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm opacity-90">{label}</div>
  </div>
);

const ProgressBar = ({ label, current, goal, color }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-yellow-200 font-medium">{label}</span>
        <span className="text-yellow-300">{current} / {goal}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div className={`bg-gradient-to-r from-${color}-600 to-${color}-800 h-3 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};



const ContactLink = ({ type, value, icon, truncate }) => {
  const prefix = type === 'email' ? 'mailto:' : 'tel:';
  const url = prefix.concat(value);
  return (
    <a href={url} className="flex items-center space-x-2 text-sm text-blue-300 hover:text-yellow-200 transition">
      <span>{icon}</span>
      <span className={truncate ? 'truncate' : ''}>{value}</span>
    </a>
  );
};

// Misioneros View
const MisionerosView = ({ misioneros, onRefresh }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [hoveredPin, setHoveredPin] = useState(null);
  const [selectedMisionero, setSelectedMisionero] = useState(null);
  const [showModal, setShowModal] = useState(false);


  const cardRefs = useRef({});

  const filteredMisioneros = misioneros.filter(m =>
    m.nombre.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (m.ubicacion_nombre && m.ubicacion_nombre.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const handlePinClick = (misionero) => {
    setSelectedMisionero(misionero.id);
    // Scroll to card
    setTimeout(() => {
      if (cardRefs.current[misionero.id]) {
        cardRefs.current[misionero.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };



  return (
    <>
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-800 rounded-2xl p-8 shadow-xl border border-blue-700">
        <h2 className="text-3xl font-bold mb-2 text-yellow-200">Nuestros Misioneros</h2>
        <p className="text-yellow-300 text-lg">{misioneros.length} misioneros sirviendo alrededor del mundo</p>

        <div className="flex mb-3 mt-3">
  <button
    onClick={() => setShowModal(true)}
    className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-semibold hover:bg-yellow-300 transition"
  >
    + Registrarse como Misionero
  </button>
</div>

      </div>

      {/* Google Map */}
<div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
  <div className="p-4 border-b border-gray-700">
    <h3 className="text-yellow-200 font-bold text-lg">🌍 Mapa Mundial</h3>
    <p className="text-yellow-300 text-sm opacity-75">
      Haz clic en un pin para ver el perfil del misionero
    </p>
  </div>

  <div style={{ height: '450px', width: '100%' }}>
    <LoadScript
  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
  libraries={['places']}   // 👈 THIS IS REQUIRED
>

      <GoogleMap
  mapContainerStyle={{ width: '100%', height: '100%' }}
  center={{ lat: 20, lng: 0 }}
  zoom={2}
  options={{
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeId: "roadmap"
  }}
>

        {filteredMisioneros.map((misionero) => (
          <Marker
            key={misionero.id}
            position={{ lat: parseFloat(misionero.lat), lng: parseFloat(misionero.lng) }}
            onClick={() => handlePinClick(misionero)}
          >
            {selectedMisionero === misionero.id && (
              <InfoWindow
                onCloseClick={() => setSelectedMisionero(null)}
              >
                <div style={{ color: '#000' }}>
                  <h4>{misionero.nombre}</h4>
                  <p>{misionero.ubicacion_nombre}</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  </div>
</div>


      {/* Search Filter */}
      <div className="relative">
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Buscar por nombre o ubicación..."
          className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-xl text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent text-lg"
        />
        <span className="absolute right-4 top-4 text-gray-500 text-lg">🔍</span>
      </div>

      

      {/* Missionary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMisioneros.map(misionero => (
          <div
            key={misionero.id}
            ref={el => cardRefs.current[misionero.id] = el}
            className={`bg-gray-800 rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${
              selectedMisionero === misionero.id
                ? 'border-yellow-400 shadow-yellow-400/20 shadow-2xl'
                : 'border-gray-700 hover:border-blue-600 hover:shadow-xl'
            }`}
          >
            {/* Card Header with Photo */}
            <div className="relative bg-gradient-to-br from-blue-800 to-blue-950 p-6">
              <div className="flex items-start space-x-4">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  {misionero.foto_url ? (
                    <img
                      src={misionero.foto_url}
                      alt={misionero.nombre}
                      className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 border-2 border-yellow-400 flex items-center justify-center text-yellow-200 text-2xl font-bold"
                    style={{ display: misionero.foto_url ? 'none' : 'flex' }}
                  >
                    {misionero.nombre.charAt(0)}
                  </div>
                </div>

                {/* Name and Location */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-yellow-200 mb-1">{misionero.nombre}</h3>
                  {misionero.ubicacion_nombre && (
                    <div className="flex items-center space-x-1 text-blue-300 text-sm mb-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>{misionero.ubicacion_nombre}</span>
                    </div>
                  )}
                  {misionero.iglesia && (
                    <div className="text-yellow-300 text-xs opacity-75">⛪ {misionero.iglesia}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              {/* Family */}
              {misionero.familia && (
                <div>
                  <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">👨‍👩‍👧‍👦 Familia</h4>
                  <p className="text-yellow-300 text-sm">{misionero.familia}</p>
                </div>
              )}

              {/* Description */}
              {misionero.descripcion && (
                <div>
                  <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">✝️ Ministerio</h4>
                  <p className="text-yellow-300 text-sm leading-relaxed">{misionero.descripcion}</p>
                </div>
              )}

            {/* Contact Info */}
            <div className="pt-4 border-t border-gray-700 space-y-2">
              {misionero.email && (
                <ContactLink type="email" value={misionero.email} icon="📧" truncate={true} />
              )}
              {misionero.telefono && (
                <ContactLink type="tel" value={misionero.telefono} icon="📞" truncate={false} />
              )}
            </div>

              {/* View on Map Button */}
              {misionero.latitud && misionero.longitud && (
                <button
                  onClick={() => {
                    setSelectedMisionero(misionero.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setHoveredPin(misionero.id);
                    setTimeout(() => setHoveredPin(null), 3000);
                  }}
                  className="w-full py-2 rounded-lg text-sm font-semibold bg-blue-900 text-yellow-200 hover:bg-blue-800 transition border border-blue-700"
                >
                  📍 Ver en mapa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMisioneros.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-yellow-300 text-lg">No se encontraron misioneros</p>
          <p className="text-yellow-400 opacity-75 mt-2 text-sm">Intenta con otro nombre o ubicación</p>
        </div>
      )}

       
    
    </div>

    {showModal && (
  <MissionaryModal
    onClose={() => setShowModal(false)}
    onSuccess={() => {
      onRefresh(); // Call the refresh function passed from parent
      setShowModal(false);
    }}
  />
)}

</>
  );
};

// Missionary Registration Modal with Google Places Autocomplete
const MissionaryModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    familia: '',
    descripcion: '',
    iglesia: '',
    foto_url: '',
    telefono: '',
    email: '',
    lat: '',
    lng: '',
    ubicacion_nombre: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (window.google && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'],
        fields: ['address_components', 'geometry', 'formatted_address', 'name']
      });

      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    }
  }, []);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      setFormData(prev => ({
        ...prev,
        ubicacion_nombre: place.formatted_address || place.name,
        lat: lat.toString(),
        lng: lng.toString()
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  // Validate coordinates before submitting
  if (!formData.lat || !formData.lng) {
    setError('Debes seleccionar una ubicación de la lista de sugerencias');
    setLoading(false);
    return;
  }

  try {
    console.log('Submitting missionary data:', formData); // DEBUG

    const response = await fetch(`${API_BASE_URL}?endpoint=misioneros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.nombre,
        familia: formData.familia,
        descripcion: formData.descripcion,
        iglesia: formData.iglesia,
        foto_url: formData.foto_url,
        telefono: formData.telefono,
        email: formData.email,
        latitud: formData.lat ? parseFloat(formData.lat) : null,
        longitud: formData.lng ? parseFloat(formData.lng) : null,
        ubicacion_nombre: formData.ubicacion_nombre,
        code: formData.code
      })
    });

    console.log('Response status:', response.status); // DEBUG

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response:', text); // DEBUG
      throw new Error(`Server error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log('Response data:', data); // DEBUG

    if (data.success) {
      alert('¡Registro exitoso! Tu perfil de misionero ha sido creado.');
      onSuccess();
      onClose();
    } else {
      setError(data.message || 'Error al registrar');
    }
  } catch (error) {
    console.error('Error completo:', error);
    setError('Error de conexión: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      
      <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-800 to-blue-900 p-6 border-b border-blue-700 rounded-t-2xl z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-yellow-200">Registrarse como Misionero</h2>
            <button
              onClick={onClose}
              className="text-yellow-200 hover:text-yellow-100 transition text-3xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-yellow-300 text-sm mt-2">
            Completa este formulario para aparecer en el mapa de misioneros
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Juan García"
              required
            />
          </div>

          {/* Family */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Familia
            </label>
            <input
              type="text"
              value={formData.familia}
              onChange={(e) => setFormData({ ...formData, familia: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="María García, Sofia (8), Pablo (5)"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="juan.garcia@mision.org"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="+502 5555-1234"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Descripción del Ministerio *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows="3"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Plantando iglesias en comunidades rurales..."
              required
            />
          </div>

          {/* Church */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Iglesia Enviadora
            </label>
            <input
              type="text"
              value={formData.iglesia}
              onChange={(e) => setFormData({ ...formData, iglesia: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Primera Iglesia Bautista"
            />
          </div>

          {/* Location with Google Autocomplete */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Ubicación (Busca tu ciudad) *
            </label>
            <input
              ref={inputRef}
              type="text"
              value={formData.ubicacion_nombre}
              onChange={(e) => setFormData({ ...formData, ubicacion_nombre: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Empieza a escribir tu ciudad..."
              required
            />
            <p className="text-xs text-yellow-400 opacity-75 mt-1">
              🔍 Empieza a escribir y selecciona tu ciudad de la lista
            </p>
          </div>

          {/* Coordinates Display (Read-only) */}
          {formData.lat && formData.lng && (
            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
              <p className="text-sm text-yellow-200 font-semibold mb-2">
                📍 Coordenadas detectadas:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-300">Latitud:</span>
                  <span className="text-yellow-300 ml-2">{parseFloat(formData.lat).toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-blue-300">Longitud:</span>
                  <span className="text-yellow-300 ml-2">{parseFloat(formData.lng).toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              URL de Foto (opcional)
            </label>
            <input
              type="url"
              value={formData.foto_url}
              onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </div>

          {/* Registration Code */}
          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">
              Código de Registro *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Código proporcionado por administrador"
              required
            />
            <p className="text-xs text-yellow-400 opacity-75 mt-1">
              Este código es necesario para verificar tu identidad como misionero
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.lat || !formData.lng}
            className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-200 font-bold rounded-lg hover:from-blue-600 hover:to-blue-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border border-blue-600"
          >
            {loading ? 'Registrando...' : 'Registrarse como Misionero'}
          </button>
          
          {!formData.lat && !formData.lng && (
            <p className="text-xs text-yellow-400 opacity-75 text-center">
              ⚠️ Debes seleccionar una ubicación de la lista para continuar
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default App;