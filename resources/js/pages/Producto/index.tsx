import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import PerfilLayout from '@/layouts/perfil-layout';

const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Miembros', href: '/miembros', icon: '👥' },
    { label: 'Sucursales', href: '/sucursales', icon: '🏢' },
    { label: 'Franquicias', href: '/franquicias', icon: '🏬' },
    { label: 'Membresías', href: '/membresias', icon: '💳' },
    { label: 'Pagos', href: '/pagos', icon: '💰' },
    { label: 'Clases', href: '/clases', icon: '🏋️' },
    { label: 'Rutinas', href: '/rutinas', icon: '📈' },
    { label: 'Productos', href: '/productos', icon: '🛒' },
    { label: 'Equipos', href: '/equipos', icon: '🛠️' },
];

const STOCK_BAJO = 5;

type Producto = {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
};

function IconEdit() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
        </svg>
    );
}

function IconTrash() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                {children}
            </div>
        </div>
    );
}

function StockBadge({ stock }: { stock: number }) {
    if (stock === 0) return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600 border border-red-200">Sin stock</span>;
    if (stock <= STOCK_BAJO) return <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 border border-yellow-200">Stock bajo</span>;
    return <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600 border border-green-200">Disponible</span>;
}

export default function ProductosIndex({ productos = [] }: { productos: Producto[] }) {
    const [showForm, setShowForm] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtroStock, setFiltroStock] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        precio: '',
        stock: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/productos', {
            onSuccess: () => { reset(); setShowForm(false); }
        });
    }

    const [editTarget, setEditTarget] = useState<Producto | null>(null);
    const editForm = useForm({ nombre: '', precio: '', stock: '' });

    function openEdit(p: Producto) {
        editForm.setData({
            nombre: p.nombre,
            precio: String(p.precio),
            stock: String(p.stock),
        });
        setEditTarget(p);
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/productos/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null);
    const [deleting, setDeleting] = useState(false);

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/productos/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); setDeleting(false); },
            onError: () => setDeleting(false),
        });
    }

    const productosFiltrados = productos.filter((p) => {
        const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const estadoProducto = p.stock === 0 ? 'sin_stock' : p.stock <= STOCK_BAJO ? 'stock_bajo' : 'disponible';
        const coincideStock = filtroStock === '' || estadoProducto === filtroStock;
        return coincideNombre && coincideStock;
    });

    const inputCls = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white';

    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Productos"
            subtitle="Administración del catálogo de productos general."
        >
            {/* FORMULARIO */}
            <div className="mb-8">
                {!showForm ? (
                    <button onClick={() => setShowForm(true)}
                        className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 transition">
                        + Añadir producto
                    </button>
                ) : (
                    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Registrar nuevo producto</h3>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-sm text-gray-400 hover:text-gray-600 transition">
                                Cancelar
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-400">Nombre del producto</label>
                                <input type="text" placeholder="Ej. Proteína Whey 1kg" value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)} className={inputCls} required />
                                {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-400">Precio de venta</label>
                                <input type="number" placeholder="Precio" min="0" step="0.01" value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)} className={inputCls} required />
                                {errors.precio && <p className="mt-1 text-xs text-red-500">{errors.precio}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-400">Stock inicial</label>
                                <input type="number" placeholder="Cantidad" min="0" value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)} className={inputCls} required />
                                {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
                            </div>
                        </div>
                        <button disabled={processing}
                            className="mt-5 w-full md:w-auto rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 transition">
                            {processing ? 'Guardando...' : 'Registrar Producto'}
                        </button>
                    </form>
                )}
            </div>

            {/* FILTROS */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 sm:max-w-xs"
                />
                <select
                    value={filtroStock}
                    onChange={(e) => setFiltroStock(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600"
                >
                    <option value="">Todos los estados</option>
                    <option value="disponible">Disponible</option>
                    <option value="stock_bajo">Stock bajo</option>
                    <option value="sin_stock">Sin stock</option>
                </select>
            </div>

            {/* VISTA MÓVIL */}
            <div className="space-y-4 md:hidden">
                <h3 className="text-base font-semibold text-gray-700 px-1 mb-2">Lista de Productos</h3>
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((p) => (
                        <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-gray-900 text-base leading-tight">{p.nombre}</h4>
                                <StockBadge stock={p.stock} />
                            </div>
                            <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Precio</span>
                                    <span className="font-bold text-gray-900">${Number(p.precio).toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Existencias</span>
                                    <span className="font-semibold text-gray-700">{p.stock} uds</span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                <button onClick={() => openEdit(p)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-600 active:bg-blue-50 active:text-blue-500">
                                    <IconEdit />
                                </button>
                                <button onClick={() => setDeleteTarget(p)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 active:bg-red-50 active:text-red-500">
                                    <IconTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                        No se encontraron productos.
                    </div>
                )}
            </div>

            {/* VISTA DESKTOP */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">
                    Lista de Productos
                    <span className="ml-2 text-sm font-normal text-gray-400">({productosFiltrados.length} resultados)</span>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th className="pr-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((p) => (
                                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition">
                                    <td className="p-5 font-medium text-gray-900">{p.nombre}</td>
                                    <td className="font-semibold text-gray-900">${Number(p.precio).toFixed(2)}</td>
                                    <td className="text-gray-600">{p.stock} uds</td>
                                    <td><StockBadge stock={p.stock} /></td>
                                    <td className="pr-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(p)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500">
                                                <IconEdit />
                                            </button>
                                            <button onClick={() => setDeleteTarget(p)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">No se encontraron productos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDITAR */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Editar producto</h3>
                <form onSubmit={submitEdit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Nombre del producto</label>
                        <input type="text" value={editForm.data.nombre}
                            onChange={(e) => editForm.setData('nombre', e.target.value)} className={inputCls} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Precio</label>
                            <input type="number" min="0" step="0.01" value={editForm.data.precio}
                                onChange={(e) => editForm.setData('precio', e.target.value)} className={inputCls} required />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Stock</label>
                            <input type="number" min="0" value={editForm.data.stock}
                                onChange={(e) => editForm.setData('stock', e.target.value)} className={inputCls} required />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                        <button type="button" onClick={() => setEditTarget(null)}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={editForm.processing}
                            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </Modal>

            {/* MODAL ELIMINAR */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <IconTrash />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar producto</h3>
                <p className="mb-6 text-sm text-gray-500">
                    ¿Estás seguro de eliminar{' '}
                    <span className="font-semibold text-gray-700">{deleteTarget?.nombre}</span>?
                    Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setDeleteTarget(null)}
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button onClick={confirmDelete} disabled={deleting}
                        className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
                        Eliminar
                    </button>
                </div>
            </Modal>
        </PerfilLayout>
    );
}