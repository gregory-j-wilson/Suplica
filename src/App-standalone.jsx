// Súplica - Community Prayer App
// This version works with CDN React (no build step needed)

const { useState, useEffect } = React;
const { Home, PlusCircle, Users, BarChart3, Book, Bell, Menu, X } = lucide;

// API Configuration - CHANGE THIS TO YOUR SERVER URL
const API_BASE_URL = 'https://selahcreativeservices.com/suplica-backend/api.php';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser] = useState({ id: 1, nombre: 'María González' }); // Mock user
  const [misiones, setMisiones] = useState([]);
  const [circulos, setCirculos] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadMisiones();
    loadCirculos();
    loadEstadisticas();
  }, []);

  const loadMisiones = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/misiones?publico=1`);
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
      const response = await fetch(`${API_BASE_URL}/circulos?usuario_id=${currentUser.id}`);
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
      const response = await fetch(`${API_BASE_URL}/estadisticas/${currentUser.id}`);
      const data = await response.json();
      if (data.success) {
        setEstadisticas(data.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
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
              <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
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
    </div>
  );
}

// Navigation Components
const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
      active 
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const MobileNavButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"
  >
    <Icon className="w-5 h-5 text-gray-600" />
    <span className="font-medium text-gray-700">{label}</span>
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
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Oremos juntos por nuestras misiones</h2>
        <p className="text-purple-100 text-lg">
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
          <p className="text-gray-500 text-lg">No hay misiones en esta categoría</p>
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
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
    }`}
  >
    {label}
  </button>
);

const MisionCard = ({ mision, currentUser, onUpdate }) => {
  const [orando, setOrando] = useState(false);

  const urgenciaColors = {
    baja: 'bg-green-100 text-green-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-orange-100 text-orange-800',
    critica: 'bg-red-100 text-red-800'
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
      const response = await fetch(`${API_BASE_URL}/oraciones`, {
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{categoriaIcons[mision.categoria]}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgenciaColors[mision.nivel_urgencia]}`}>
            {mision.nivel_urgencia}
          </span>
        </div>
        <span className="text-sm text-gray-500">{mision.total_oraciones} 🙏</span>
      </div>

      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">{mision.titulo}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{mision.descripcion}</p>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
          {mision.nombre_usuario.charAt(0)}
        </div>
        <span>{mision.nombre_usuario}</span>
      </div>

      <button
        onClick={handleOrar}
        disabled={orando}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          orando
            ? 'bg-green-500 text-white'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
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
      const response = await fetch(`${API_BASE_URL}/misiones`, {
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
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Comparte tu misión de oración</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título de tu petición</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Ej: Renovación de visa misionera"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Comparte los detalles de tu petición..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Urgencia</label>
              <select
                value={formData.nivel_urgencia}
                onChange={(e) => setFormData({...formData, nivel_urgencia: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="publico" className="text-sm text-gray-700">
              Compartir públicamente (todos podrán orar por esta misión)
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
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
        <h2 className="text-2xl font-bold text-gray-900">Mis Círculos de Oración</h2>
        <button
          onClick={() => setShowNewCircle(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition"
        >
          + Crear Círculo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {circulos.map(circulo => (
          <div key={circulo.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-xl text-gray-900">{circulo.nombre}</h3>
                <p className="text-gray-600 text-sm mt-1">{circulo.descripcion}</p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                {circulo.total_miembros} miembros
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-gray-500">Código: {circulo.codigo_invitacion}</span>
              <button className="px-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition">
                Ver círculo →
              </button>
            </div>
          </div>
        ))}
      </div>

      {circulos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aún no tienes círculos de oración</p>
          <p className="text-gray-400 mt-2">Crea uno para comenzar a orar en comunidad</p>
        </div>
      )}
    </div>
  );
};

// Estadisticas View
const EstadisticasView = ({ stats }) => {
  if (!stats) return <div className="text-center">Cargando estadísticas...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Mis Estadísticas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon="🙏"
          label="Oraciones"
          value={stats.total_oraciones || 0}
          color="from-purple-500 to-purple-700"
        />
        <StatCard
          icon="🎯"
          label="Mis Misiones"
          value={stats.total_misiones || 0}
          color="from-blue-500 to-blue-700"
        />
        <StatCard
          icon="✅"
          label="Respondidas"
          value={stats.misiones_respondidas || 0}
          color="from-green-500 to-green-700"
        />
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-bold text-lg mb-4">Progreso de Oración</h3>
        <div className="space-y-3">
          <ProgressBar label="Oraciones este mes" current={stats.total_oraciones} goal={100} color="purple" />
          <ProgressBar label="Meta anual" current={stats.total_oraciones} goal={365} color="blue" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg`}>
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
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-500">{current} / {goal}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`bg-gradient-to-r from-${color}-500 to-${color}-700 h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
