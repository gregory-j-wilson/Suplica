import { useState } from "react";

export default function MissionaryModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    code: "",
    nombre: "",
    familia: "",
    descripcion: "",
    iglesia: "",
    telefono: "",
    email: "",
    ciudad: "",
    estado: "",
    pais: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const SECRET_CODE = "HLJFHLKJHLJKD";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const geocodeLocation = async () => {
    const address = `${form.ciudad}, ${form.estado}, ${form.pais}`;
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_GOOGLE_MAPS_API_KEY`,
    );
    const data = await res.json();

    if (data.results.length === 0) {
      throw new Error("Ubicación no encontrada");
    }

    return data.results[0].geometry.location;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.code !== SECRET_CODE) {
      setError("Código incorrecto");
      return;
    }

    try {
      setLoading(true);

      const coords = await geocodeLocation();

      const payload = {
        nombre: form.nombre,
        familia: form.familia,
        descripcion: form.descripcion,
        iglesia: form.iglesia,
        telefono: form.telefono,
        email: form.email,
        latitud: coords.lat,
        longitud: coords.lng,
        ubicacion_nombre: `${form.ciudad}, ${form.estado}, ${form.pais}`,
      };

      await fetch("/api/misioneros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError("Error al guardar. Verifica la ubicación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Registro de Misionero</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="code"
            placeholder="Código de invitación"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="familia"
            placeholder="Familia"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <textarea
            name="descripcion"
            placeholder="Descripción"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="iglesia"
            placeholder="Iglesia"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="telefono"
            placeholder="Teléfono"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="ciudad"
            placeholder="Ciudad"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="estado"
            placeholder="Estado / Provincia"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            name="pais"
            placeholder="País"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-between pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 rounded font-semibold"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
