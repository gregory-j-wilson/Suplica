import React, { useState, useEffect } from 'react';
import { Home, PlusCircle, Users, BarChart3, Book, Bell, Menu, X, LogOut } from 'lucide-react';

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

  // Check if user is logged in on mount
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
  };

  // Show login/signup if not authenticated
  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-blue-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-xl">
                <Book className="w-6 h-6 text-yellow-200" />
              </div>
              <h1 className="text-2xl font-bold text-yellow-200">
                Súplica
              </h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <NavButton icon={Home} label="Inicio" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
              <NavButton icon={PlusCircle} label="Nueva Misión" active={currentView === 'nueva'} onClick={() => setCurrentView('nueva')} />
              <NavButton icon={Users} label="Círculos" active={currentView === 'circulos'} onClick={() => setCurrentView('circulos')} />
              <NavButton icon={BarChart3} label="Estadísticas" active={currentView === 'stats'} onClick={() => setCurrentView('stats')} />
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-yellow-200 text-sm hidden md:block">{currentUser?.nombre}</span>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-blue-800 rounded-full transition text-yellow-200"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
              {/* <button className="relative p-2 hover:bg-blue-800 rounded-full transition">
                <Bell className="w-5 h-5 text-yellow-200" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button> */}
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-yellow-200" /> : <Menu className="w-6 h-6 text-yellow-200" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-800">
              <div className="flex flex-col space-y-2">
                <MobileNavButton icon={Home} label="Inicio" onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }} />
                <MobileNavButton icon={PlusCircle} label="Nueva Misión" onClick={() => { setCurrentView('nueva'); setMobileMenuOpen(false); }} />
                <MobileNavButton icon={Users} label="Círculos" onClick={() => { setCurrentView('circulos'); setMobileMenuOpen(false); }} />
                <MobileNavButton icon={BarChart3} label="Estadísticas" onClick={() => { setCurrentView('stats'); setMobileMenuOpen(false); }} />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && <HomeView misiones={misiones} currentUser={currentUser} onUpdate={loadMisiones} />}
        {currentView === 'nueva' && <NuevaMisionView currentUser={currentUser} onCreated={() => { loadMisiones(); setCurrentView('home'); }} />}
        {currentView === 'circulos' && <CirculosView circulos={circulos} currentUser={currentUser} onUpdate={loadCirculos} />}
        {currentView === 'stats' && <EstadisticasView stats={estadisticas} />}
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-yellow-200 text-sm">
          <p>Súplica - Comunidad de Oración para Misioneros Bautistas</p>
          <p className="mt-2 text-yellow-300 opacity-75">🙏 Orando juntos por las misiones 🌍</p>
        </div>
      </footer>
    </div>
  );
}

// Authentication View
const AuthView = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await fetch(`${API_BASE_URL}?endpoint=usuarios`);
        const data = await response.json();
        
        if (data.success) {
          const user = data.data.find(u => u.email === formData.email);
          
          if (user) {
            // In production, you'd verify password hash here
            onLogin(user);
          } else {
            setError('Email o contraseña incorrectos');
          }
        }
      } else {
        // Signup
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
          // Auto-login after signup
          const newUser = {
            id: data.id,
            nombre: formData.nombre,
            email: formData.email
          };
          onLogin(newUser);
        } else {
          setError(data.message || 'Error al crear cuenta');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Verifica que el backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-2xl mb-4">
            <Book className="w-12 h-12 text-yellow-200" />
          </div>
          <h1 className="text-4xl font-bold text-yellow-200 mb-2">Súplica</h1>
          <p className="text-yellow-300 text-lg">Comunidad de Oración Misionera</p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 font-semibold rounded-lg transition ${
                isLogin
                  ? 'bg-blue-800 text-yellow-200'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 font-semibold rounded-lg transition ml-2 ${
                !isLogin
                  ? 'bg-blue-800 text-yellow-200'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-yellow-200 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-yellow-200 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-yellow-200 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-200 font-bold rounded-lg hover:from-blue-600 hover:to-blue-800 transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-yellow-300 hover:text-yellow-200 font-semibold"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Plataforma de oración para misioneros bautistas fundamentales
        </p>
      </div>
    </div>
  );
};

// Navigation Components
const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
      active 
        ? 'bg-blue-700 text-yellow-200' 
        : 'text-yellow-300 hover:bg-blue-800'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const MobileNavButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition"
  >
    <Icon className="w-5 h-5 text-yellow-300" />
    <span className="font-medium text-yellow-200">{label}</span>
  </button>
);

// Home View
const HomeView = ({ misiones, currentUser, onUpdate }) => {
  const [filter, setFilter] = useState('todas');

  const filteredMisiones = misiones.filter(m => {
    if (filter === 'todas') return true;
    if (filter === 'mis-misiones') return m.usuario_id === currentUser.id;
    return m.categoria === filter;
  });

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-800 rounded-2xl p-8 shadow-xl border border-blue-700">
        <h2 className="text-3xl font-bold mb-2 text-yellow-200">Oremos juntos por nuestras misiones</h2>
        <p className="text-yellow-300 text-lg">
          {misiones.length} peticiones activas esperando tu intercesión
        </p>
      </div>

      {/* Filters */}
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

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMisiones.map(mision => (
          <MisionCard key={mision.id} mision={mision} currentUser={currentUser} onUpdate={onUpdate} />
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
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full font-medium transition ${
      active
        ? 'bg-blue-800 text-yellow-200 shadow-md border border-blue-600'
        : 'bg-gray-800 text-yellow-300 hover:bg-gray-700 border border-gray-700'
    }`}
  >
    {label}
  </button>
);

const MisionCard = ({ mision, currentUser, onUpdate }) => {
  const [orando, setOrando] = useState(false);

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

  const handleOrar = async () => {
    setOrando(true);
    try {
      const response = await fetch(`${API_BASE_URL}?endpoint=oraciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mision_id: mision.id,
          usuario_id: currentUser.id,
          mensaje: `Orando por: ${mision.titulo}`
        })
      });
      
      const data = await response.json();
      if (data.success) {
        onUpdate();
        setTimeout(() => setOrando(false), 2000);
      }
    } catch (error) {
      console.error('Error al orar:', error);
      setOrando(false);
    }
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

      <button
        onClick={handleOrar}
        disabled={orando}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          orando
            ? 'bg-green-800 text-green-200 border border-green-600'
            : 'bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-200 hover:from-blue-600 hover:to-blue-800 border border-blue-600'
        }`}
      >
        {orando ? '¡Oración enviada! ✨' : 'Orar por esta misión'}
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
        body: JSON.stringify({
          ...formData,
          usuario_id: currentUser.id
        })
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
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Ej: Renovación de visa misionera"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-yellow-200 mb-2">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows="4"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Comparte los detalles de tu petición..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-yellow-200 mb-2">Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
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
              <select
                value={formData.nivel_urgencia}
                onChange={(e) => setFormData({...formData, nivel_urgencia: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-yellow-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="publico"
              checked={formData.publico}
              onChange={(e) => setFormData({...formData, publico: e.target.checked})}
              className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="publico" className="text-sm text-yellow-200">
              Compartir públicamente (todos podrán orar por esta misión)
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-200 font-bold rounded-lg hover:from-blue-600 hover:to-blue-800 transition shadow-lg border border-blue-600"
          >
            Crear Misión de Oración
          </button>
        </form>
      </div>
    </div>
  );
};

// Circulos View
const CirculosView = ({ circulos, currentUser, onUpdate }) => {
  const [showNewCircle, setShowNewCircle] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-yellow-200">Mis Círculos de Oración</h2>
        <button
          onClick={() => setShowNewCircle(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-900 text-yellow-200 font-semibold rounded-lg hover:from-blue-600 hover:to-blue-800 transition border border-blue-600"
        >
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
              <button className="px-4 py-2 text-blue-300 font-medium hover:bg-gray-700 rounded-lg transition">
                Ver círculo →
              </button>
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
        <StatCard
          icon="🙏"
          label="Oraciones"
          value={stats.total_oraciones || 0}
          color="from-blue-700 to-blue-900"
        />
        <StatCard
          icon="🎯"
          label="Mis Misiones"
          value={stats.total_misiones || 0}
          color="from-blue-800 to-gray-900"
        />
        <StatCard
          icon="✅"
          label="Respondidas"
          value={stats.misiones_respondidas || 0}
          color="from-green-800 to-green-950"
        />
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
        <div
          className={`bg-gradient-to-r from-${color}-600 to-${color}-800 h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default App;