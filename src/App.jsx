import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Trash2, Plus, LayoutDashboard, LogOut, Save, Lock, Upload } from 'lucide-react';

const API_URL = 'https://wejee.onrender.com/api';

// --- COMPONENTE: LOGIN ADMIN ---
const AdminLogin = ({ onLogin, onBack }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if (data.success) {
        onLogin();
      } else {
        setError("Contraseña incorrecta");
      }
    } catch (err) {
      setError("Error de conexión");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-900">Acceso Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="Contraseña de Base de Datos" 
            className="w-full p-3 border rounded-lg"
            value={password} onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold">Entrar</button>
          <button type="button" onClick={onBack} className="w-full text-gray-500 text-sm mt-2">Volver a la tienda</button>
        </form>
      </div>
    </div>
  );
};

// --- COMPONENTE: PANEL DE ADMIN ---
const AdminPanel = ({ products, onAddProduct, onDeleteProduct, onLogout }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Ropa");
  const [file, setFile] = useState(null); // Estado para el archivo

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !file) {
      alert("Por favor completa todos los campos e incluye una imagen");
      return;
    }

    // Para enviar archivos, usamos FormData
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image', file); // Aquí va el archivo real

    onAddProduct(formData);

    // Limpiar formulario
    setName(""); setPrice(""); setFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-indigo-900">Panel de Control Wejeee</h1>
        <button onClick={onLogout} className="flex items-center gap-2 text-red-500 font-bold bg-white px-4 py-2 rounded shadow">
          <LogOut size={18} /> Salir
        </button>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus className="text-indigo-600"/> Nuevo Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Nombre" className="w-full p-3 border rounded" value={name} onChange={e => setName(e.target.value)} />
            <input type="number" placeholder="Precio" className="w-full p-3 border rounded" value={price} onChange={e => setPrice(e.target.value)} />
            
            <select className="w-full p-3 border rounded bg-white" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="Ropa">Ropa</option>
              <option value="Maquillaje">Maquillaje</option>
              <option value="Cuidado">Cuidado Integral</option>
            </select>

            {/* Input de Archivo Personalizado */}
            <div className="border-2 border-dashed border-gray-300 p-4 rounded text-center cursor-pointer hover:bg-gray-50 relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => setFile(e.target.files[0])} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center text-gray-500">
                <Upload size={24} />
                <span className="text-xs mt-1">{file ? file.name : "Subir foto desde PC"}</span>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded font-bold hover:bg-indigo-700 transition">Guardar en BD</button>
          </form>
        </div>

        {/* Lista de Productos */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Inventario Actual</h2>
          {products.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={p.image} alt={p.name} className="w-16 h-16 rounded object-cover bg-gray-100" />
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.category} - ${Number(p.price).toFixed(2)}</p>
                </div>
              </div>
              <button onClick={() => onDeleteProduct(p.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: TIENDA (SECCIONES SEPARADAS) ---
const StoreView = ({ products, addToCart, cart, isMenuOpen, setIsMenuOpen, isCartOpen, setIsCartOpen, removeFromCart, total, onAdminClick }) => {
  
  // Función auxiliar para renderizar una sección
  const ProductSection = ({ title, category }) => {
    const categoryProducts = products.filter(p => p.category === category);
    if (categoryProducts.length === 0) return null;

    return (
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryProducts.map((product) => (
              <div key={product.id} className="group border rounded-xl p-3 hover:shadow-xl transition bg-white">
                <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4 aspect-[3/4]">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  <button onClick={() => addToCart(product)} className="absolute bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition translate-y-4 group-hover:translate-y-0"><Plus size={20} /></button>
                </div>
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <p className="text-indigo-600 font-bold mt-1">${Number(product.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          <span className="font-black text-2xl tracking-tighter text-indigo-600">WEJEEE<span className="text-black">.</span></span>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-full transition group">
              <ShoppingBag className="h-6 w-6 text-gray-700" />
              {cart.length > 0 && <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </nav>

      {/* CARRITO (Igual que antes) */}
      {isCartOpen && <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)}></div>}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-[60] shadow-2xl transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="font-bold">Tu Carrito</h2>
                <button onClick={() => setIsCartOpen(false)}><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center border-b pb-4">
                        <img src={item.image} className="w-16 h-16 rounded object-cover"/>
                        <div className="flex-1"><h4 className="font-bold text-sm">{item.name}</h4><p className="text-indigo-600">${Number(item.price).toFixed(2)}</p></div>
                        <button onClick={() => removeFromCart(i)} className="text-red-500"><Trash2 size={16}/></button>
                    </div>
                ))}
            </div>
            <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between mb-4"><span className="font-bold">Total</span><span className="text-2xl font-bold">${total.toFixed(2)}</span></div>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Pagar Ahora</button>
            </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="h-[300px] flex items-center justify-center bg-black text-white text-center">
        <h1 className="text-5xl font-black">ESTILO <span className="text-indigo-500">WEJEEE</span></h1>
      </header>

      {/* SECCIONES DINÁMICAS */}
      <ProductSection title="Colección de Ropa" category="Ropa" />
      <ProductSection title="Maquillaje Exclusivo" category="Maquillaje" />
      <ProductSection title="Cuidado Integral" category="Cuidado" />

      {/* FOOTER CON ACCESO ADMIN */}
      <footer className="bg-gray-900 text-white py-8 text-center mt-12">
        <p className="mb-4 text-gray-400">© 2025 Wejeee Store.</p>
        <button onClick={onAdminClick} className="text-gray-600 hover:text-white flex items-center gap-1 mx-auto text-sm transition">
          <Lock size={14} /> Admin
        </button>
      </footer>
    </div>
  );
};

// --- APP PRINCIPAL ---
function App() {
  const [view, setView] = useState('store'); // store, login, admin
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      setProducts(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleAddProduct = async (formData) => {
    try {
      // IMPORTANTE: Al enviar archivos no usamos 'Content-Type': 'application/json'
      // fetch lo detecta automáticamente al enviar formData
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: formData 
      });
      if (res.ok) {
        fetchProducts(); // Recargar lista
        alert("Producto creado exitosamente");
      }
    } catch (e) { alert("Error al subir"); }
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("¿Borrar producto?")) {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  // Carrito
  const addToCart = (p) => { setCart([...cart, p]); setIsCartOpen(true); };
  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <>
      {view === 'store' && (
        <StoreView 
          products={products} cart={cart} addToCart={addToCart} 
          isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}
          isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}
          removeFromCart={removeFromCart} total={total}
          onAdminClick={() => setView('login')}
        />
      )}
      {view === 'login' && (
        <AdminLogin 
          onLogin={() => setView('admin')} 
          onBack={() => setView('store')} 
        />
      )}
      {view === 'admin' && (
        <AdminPanel 
          products={products} 
          onAddProduct={handleAddProduct} 
          onDeleteProduct={handleDeleteProduct}
          onLogout={() => setView('store')}
        />
      )}
    </>
  );
}

export default App;