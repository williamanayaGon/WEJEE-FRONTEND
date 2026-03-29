import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Trash2, Plus, LayoutDashboard, LogOut, Save, Lock, Upload, ChevronRight } from 'lucide-react';
import GradientText from './GradientText';

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
    <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-100">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-white tracking-wide">Acceso Seguro</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="Contraseña de Admin" 
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            value={password} onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-bold transition">Entrar al Panel</button>
          <button type="button" onClick={onBack} className="w-full text-slate-400 hover:text-white text-sm mt-2 transition">Volver a la tienda</button>
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
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !file) {
      alert("Por favor completa todos los campos e incluye una imagen");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image', file);

    onAddProduct(formData);
    setName(""); setPrice(""); setFile(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 max-w-6xl mx-auto border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight mb-4 md:mb-0">Panel Wejeee<span className="text-indigo-500">.</span></h1>
        <button onClick={onLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-700 transition">
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1 bg-slate-800 p-6 rounded-2xl border border-slate-700 h-fit shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2 border-b border-slate-700 pb-4">
            <Plus className="text-indigo-500"/> Nuevo Producto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block uppercase tracking-wider">Nombre del producto</label>
              <input type="text" placeholder="Ej: Camiseta Oversize" className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" value={name} onChange={e => setName(e.target.value)} />
            </div>
            
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block uppercase tracking-wider">Precio ($)</label>
              <input type="number" placeholder="Ej: 45000" className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block uppercase tracking-wider">Categoría</label>
              <select className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-indigo-500 outline-none" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Ropa">Ropa</option>
                <option value="Maquillaje">Maquillaje</option>
                <option value="Cuidado">Cuidado Integral</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block uppercase tracking-wider">Imagen (Requerido)</label>
              <div className="border-2 border-dashed border-slate-600 bg-slate-900/50 p-6 rounded-xl text-center cursor-pointer hover:border-indigo-500 hover:bg-slate-900 transition relative group">
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center text-slate-400 group-hover:text-indigo-400 transition">
                  <Upload size={28} className="mb-2" />
                  <span className="text-sm font-medium">{file ? file.name : "Toca para subir foto"}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 mt-2">Publicar Producto</button>
          </form>
        </div>

        {/* Lista de Productos */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-700 pb-4">Inventario Actual ({products.length})</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {products.length === 0 ? (
              <p className="text-slate-500 text-center py-10">Aún no hay productos en tu tienda.</p>
            ) : (
              products.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
                  <div className="flex items-center gap-4">
                    <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-slate-800" />
                    <div>
                      <h3 className="font-bold text-white">{p.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">{p.category}</span>
                        <span className="text-indigo-400 font-bold text-sm">${Number(p.price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => onDeleteProduct(p.id)} className="text-slate-500 hover:text-red-400 bg-slate-800 hover:bg-red-500/10 p-2.5 rounded-lg transition" title="Eliminar">
                    <Trash2 size={18}/>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: TIENDA ---
const StoreView = ({ products, addToCart, cart, isMenuOpen, setIsMenuOpen, isCartOpen, setIsCartOpen, removeFromCart, total, onAdminClick }) => {
  
  const ProductSection = ({ title, category }) => {
    const categoryProducts = products.filter(p => p.category === category);
    if (categoryProducts.length === 0) return null;

    return (
      <section className="py-16 border-b border-slate-800/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-bold text-white">{title}</h2>
            <div className="h-px bg-slate-800 flex-1 mt-2"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <div key={product.id} className="group bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300">
                <div className="relative overflow-hidden rounded-xl bg-slate-900 mb-5 aspect-[3/4]">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Overlay oscuro al pasar el mouse */}
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <button onClick={() => addToCart(product)} className="absolute bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 hover:bg-indigo-500 flex items-center gap-2">
                    <Plus size={20} />
                  </button>
                </div>
                <h3 className="font-semibold text-slate-200 text-lg line-clamp-1">{product.name}</h3>
                <p className="text-indigo-400 font-bold mt-1 text-xl">${Number(product.price).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-indigo-500/30">
      
      {/* NAVBAR */}
      <nav className="bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <span className="font-black text-2xl tracking-tighter text-white">WEJEEE<span className="text-indigo-500">.</span></span>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition group">
              <ShoppingBag className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950 shadow-sm">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* CARRITO LATERAL (DARK MODE) */}
      {isCartOpen && <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsCartOpen(false)}></div>}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-slate-900 border-l border-slate-800 z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingBag size={20} className="text-indigo-500"/> Tu Compra</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                    <ShoppingBag size={48} className="opacity-20" />
                    <p>Tu carrito está vacío</p>
                  </div>
                ) : (
                  cart.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center group">
                          <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-slate-800 border border-slate-700"/>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white leading-tight mb-1">{item.name}</h4>
                            <p className="text-indigo-400 font-bold">${Number(item.price).toLocaleString()}</p>
                          </div>
                          <button onClick={() => removeFromCart(i)} className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition"><Trash2 size={18}/></button>
                      </div>
                  ))
                )}
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-slate-400 font-medium">Total a pagar</span>
                  <span className="text-3xl font-black text-white">${total.toLocaleString()}</span>
                </div>
                
                {/* --- BOTÓN DE WHATSAPP ACTUALIZADO --- */}
                <button 
                  disabled={cart.length === 0}
                  onClick={() => {
                    const numeroWhatsApp = "573001234567"; // <-- CAMBIA ESTO POR TU NÚMERO
                    let mensaje = `¡Hola Wejeee! 👋 Quiero comprar los siguientes productos:%0A%0A`;
                    cart.forEach((item, index) => {
                      mensaje += `${index + 1}. ${item.name} - $${Number(item.price).toLocaleString()}%0A`;
                    });
                    mensaje += `%0A*Total: $${total.toLocaleString()}*%0A%0A¿Me confirmas disponibilidad y métodos de pago?`;
                    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, "_blank");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-4 rounded-xl font-bold text-lg transition flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  Confirmar Pedido <ChevronRight size={20} />
                </button>
            </div>
        </div>
      </div>

     {/* HEADER HERO (ELEGANTE Y TRANSLÚCIDO) */}
      <header className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Luces de fondo estilo neón */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px] -z-10"></div>
        
        <div className="max-w-5xl mx-auto z-10 flex flex-col items-center justify-center w-full">
          
          <span className="text-indigo-400 font-semibold tracking-[0.2em] text-sm uppercase mb-4 block">Nueva Colección 2025</span>
          
          {/* AQUÍ ESTÁ EL COMPONENTE ANIMADO QUE TRAJISTE */}
          <GradientText
            colors={["#00ff04", "#FF9FFC", "#ffffff"]}
            animationSpeed={11}
            showBorder={false}
            className="text-[80px] sm:text-[120px] md:text-[180px] font-black tracking-tighter leading-none mb-4"
          >
            WEJEEE
          </GradientText>

          <p className="text-slate-400 text-xl md:text-2xl mt-6 max-w-2xl mx-auto font-light tracking-wide">
            Moda, maquillaje y cuidado integral seleccionado exclusivamente para resaltar tu esencia.
          </p>

        </div>
      </header>

      {/* SECCIONES DE PRODUCTOS */}
      <div className="pb-20">
        <ProductSection title="Prendas Exclusivas" category="Ropa" />
        <ProductSection title="Makeup & Belleza" category="Maquillaje" />
        <ProductSection title="Cuidado Personal" category="Cuidado" />
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800/50 pt-16 pb-8 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-black text-white mb-6">WEJEEE<span className="text-indigo-500">.</span></h2>
          <p className="mb-10 text-slate-500 max-w-sm mx-auto">Elevando tu estilo todos los días. Envíos a todo el país.</p>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">© 2025 Wejeee Store. Todos los derechos reservados.</p>
            <button onClick={onAdminClick} className="text-slate-600 hover:text-indigo-400 flex items-center gap-1.5 text-sm font-medium transition px-3 py-1 rounded-lg hover:bg-slate-900">
              <Lock size={14} /> Acceso Administrativo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- APP PRINCIPAL ---
function App() {
  const [view, setView] = useState('store'); 
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
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: formData 
      });
      if (res.ok) {
        fetchProducts(); 
        alert("¡Producto publicado con éxito!");
      }
    } catch (e) { alert("Error al subir el producto."); }
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("¿Seguro que quieres borrar este producto de tu tienda?")) {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

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