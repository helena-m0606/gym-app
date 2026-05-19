import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
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

const CATEGORIAS = ['Suplementos', 'Accesorios', 'Ropa', 'Bebidas', 'Equipamiento', 'Otro'];
const STOCK_BAJO = 5;

type Sucursal = { id: number; nombre: string };
type Producto = {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    categoria: string;
    descripcion: string | null;
    sucursal: Sucursal;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                {children}
            </div>
        </div>
    );
}

function StockBadge({ stock }: { stock: number }) {
    if (stock === 0) return <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">Sin stock</span>;
    if (stock <= STOCK_BAJO) return <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">Stock bajo</span>;
    return <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">Disponible</span>;
}

export default function ProductosIndex({ productos, sucursales }: { productos: Producto[]; sucursales: Sucursal[] }) {
    // ── Mostrar/ocultar formulario ─────────────────────────────────────────────
    const [showForm, setShowForm] = useState(false);

    // ── Filtros ────────────────────────────────────────────────────────────────
    const [filterSucursal, setFilterSucursal] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');

    const filtered = useMemo(() => productos.filter((p) => {
        if (filterSucursal && String(p.sucursal?.id) !== filterSucursal) return false;
        if (filterCategoria && p.categoria !== filterCategoria) return false;
        return true;
    }), [productos, filterSucursal, filterCategoria]);

    // ── Crear ──────────────────────────────────────────────────────────────────
    const { data, setData, post, processing, errors, reset } = useForm({
        sucursal_id: '',
        nombre: '',
        precio: '',
        stock: '',
        categoria: '',
        descripcion: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/productos', {
            onSuccess: () => {
                reset();
                setShowForm(false);
            }
        });
    }

    // ── Editar ─────────────────────────────────────────────────────────────────
    const [editTarget, setEditTarget] = useState<Producto | null>(null);
    const editForm = useForm({
        sucursal_id: '',
        nombre: '',
        precio: '',
        stock: '',
        categoria: '',
        descripcion: '',
    });

    function openEdit(p: Producto) {
        editForm.setData({
            sucursal_id: String(p.sucursal.id),
            nombre: p.nombre,
            precio: String(p.precio),
            stock: String(p.stock),
            categoria: p.categoria,
            descripcion: p.descripcion ?? '',
        });
        setEditTarget(p);
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/productos/${editTarget.id}`, {
            onSuccess: () => { setEditTarget(null); router.reload(); },
        });
    }

    // ── Eliminar ───────────────────────────────────────────────────────────────
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

    const inputCls = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400';

    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Productos"
            subtitle="Administración de productos por sucursal."
        >
            {/* ── Botón / Formulario crear ── */}
            <div className="mb-8">
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600"
                    >
                        + Añadir producto
                    </button>
                ) : (
                    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Registrar nuevo producto</h3>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-sm text-gray-400 hover:text-gray-600">
                                Cancelar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <select value={data.sucursal_id} onChange={(e) => setData('sucursal_id', e.target.value)} className={inputCls}>
                                    <option value="">Seleccionar sucursal</option>
                                    {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                </select>
                                {errors.sucursal_id && <p className="mt-1 text-xs text-red-500">{errors.sucursal_id}</p>}
                            </div>

                            <div>
                                <input type="text" placeholder="Nombre del producto" value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)} className={inputCls} />
                                {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
                            </div>

                            <div>
                                <select value={data.categoria} onChange={(e) => setData('categoria', e.target.value)} className={inputCls}>
                                    <option value="">Seleccionar categoría</option>
                                    {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                                {errors.categoria && <p className="mt-1 text-xs text-red-500">{errors.categoria}</p>}
                            </div>

                            <div>
                                <input type="number" placeholder="Precio" min="0" step="0.01" value={data.precio}
                                    onChange={(e) => setData('precio', e.target.value)} className={inputCls} />
                                {errors.precio && <p className="mt-1 text-xs text-red-500">{errors.precio}</p>}
                            </div>

                            <div>
                                <input type="number" placeholder="Stock inicial" min="0" value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)} className={inputCls} />
                                {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
                            </div>

                            <div>
                                <input type="text" placeholder="Descripción (opcional)" value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)} className={inputCls} />
                            </div>
                        </div>

                        <button disabled={processing}
                            className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60">
                            {processing ? 'Guardando...' : 'Guardar Producto'}
                        </button>
                    </form>
                )}
            </div>

            {/* ── Filtros ── */}
            <div className="mb-4 flex flex-wrap gap-3">
                <select value={filterSucursal} onChange={(e) => setFilterSucursal(e.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-orange-400">
                    <option value="">Todas las sucursales</option>
                    {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                </select>

                <select value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-orange-400">
                    <option value="">Todas las categorías</option>
                    {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                {(filterSucursal || filterCategoria) && (
                    <button onClick={() => { setFilterSucursal(''); setFilterCategoria(''); }}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* ── Tabla ── */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">
                    Lista de Productos
                    <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length} resultados)</span>
                </div>
                <table className="min-w-[850px] w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Nombre</th>
                            <th>Sucursal</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th className="pr-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                <td className="p-5 font-medium">{p.nombre}</td>
                                <td>{p.sucursal?.nombre}</td>
                                <td>{p.categoria}</td>
                                <td>${Number(p.precio).toFixed(2)}</td>
                                <td>{p.stock} uds</td>
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
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-400">No se encontraron productos.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Modal Editar ── */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar producto</h3>
                <form onSubmit={submitEdit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-500">Sucursal</label>
                            <select value={editForm.data.sucursal_id} onChange={(e) => editForm.setData('sucursal_id', e.target.value)} className={inputCls}>
                                <option value="">Seleccionar sucursal</option>
                                {sucursales.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-500">Nombre</label>
                            <input type="text" value={editForm.data.nombre}
                                onChange={(e) => editForm.setData('nombre', e.target.value)} className={inputCls} />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Categoría</label>
                            <select value={editForm.data.categoria} onChange={(e) => editForm.setData('categoria', e.target.value)} className={inputCls}>
                                <option value="">Seleccionar</option>
                                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Precio</label>
                            <input type="number" min="0" step="0.01" value={editForm.data.precio}
                                onChange={(e) => editForm.setData('precio', e.target.value)} className={inputCls} />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Stock</label>
                            <input type="number" min="0" value={editForm.data.stock}
                                onChange={(e) => editForm.setData('stock', e.target.value)} className={inputCls} />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Descripción</label>
                            <input type="text" value={editForm.data.descripcion}
                                onChange={(e) => editForm.setData('descripcion', e.target.value)} className={inputCls} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setEditTarget(null)}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={editForm.processing}
                            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                            {editForm.processing ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Modal Eliminar ── */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400">
                    <IconTrash />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar producto</h3>
                <p className="mb-6 text-sm text-gray-500">
                    ¿Estás seguro de que deseas eliminar{' '}
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
                        {deleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </Modal>
        </PerfilLayout>
    );
}
