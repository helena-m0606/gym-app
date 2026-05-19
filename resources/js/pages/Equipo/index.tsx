import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
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

type Equipo = {
    id: number;
    nombre: string;
    sucursal_id: number;
    nombre_sucursal: string;
    categoria_id: number;
    nombre_categoria: string;
    estado: string;
};

type Sucursal = {
    id: number;
    nombre: string;
};

type Categoria = {
    id: number;
    nombre: string;
};

type Props = {
    equipos: Equipo[];
    sucursales: Sucursal[];
    categorias: Categoria[];
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
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                {children}
            </div>
        </div>
    );
}

export default function EquiposIndex({ equipos, sucursales, categorias }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editando, setEditando] = useState<Equipo | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Equipo | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    const { data, setData, post, processing, reset, errors } = useForm({
        nombre: '',
        sucursal_id: '',
        categoria_id: '',
        estado: 'activo',
    });

    const editForm = useForm({
        nombre: '',
        sucursal_id: '',
        categoria_id: '',
        estado: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/equipos', { onSuccess: () => { reset(); setShowForm(false); } });
    }

    function abrirEditar(eq: Equipo) {
        editForm.clearErrors();
        setEditando(eq);
        editForm.setData({
            nombre: eq.nombre,
            sucursal_id: String(eq.sucursal_id),
            categoria_id: String(eq.categoria_id),
            estado: eq.estado,
        });
    }

    function guardarEdicion(e: React.FormEvent) {
        e.preventDefault();
        if (!editando) return;
        editForm.put(`/equipos/${editando.id}`, {
            onSuccess: () => setEditando(null),
        });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/equipos/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); setDeleting(false); },
            onError: () => setDeleting(false),
        });
    }

    const equiposFiltrados = equipos ? equipos.filter((eq) => {
        return (
            eq.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
            (filtroCategoria === '' || eq.nombre_categoria === filtroCategoria) &&
            (filtroEstado === '' || eq.estado === filtroEstado)
        );
    }) : [];

    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Equipos"
            subtitle="Administración de maquinaria y herramientas por sucursal."
        >
            {/* FORMULARIO */}
            <div className="mb-8">
                {!showForm ? (
                    <button onClick={() => setShowForm(true)}
                        className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 transition">
                        + Registrar equipo
                    </button>
                ) : (
                    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Registrar nuevo equipo</h3>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-sm font-medium text-gray-400 hover:text-gray-600 transition">
                                Cancelar
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nombre del equipo"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                                    required
                                />
                                {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
                            </div>
                            <div>
                                <select
                                    value={data.sucursal_id}
                                    onChange={(e) => setData('sucursal_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 text-gray-700"
                                    required
                                >
                                    <option value="">Seleccionar sucursal</option>
                                    {sucursales?.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nombre}</option>
                                    ))}
                                </select>
                                {errors.sucursal_id && <p className="mt-1 text-xs text-red-500">{errors.sucursal_id}</p>}
                            </div>
                            <div>
                                <select
                                    value={data.categoria_id}
                                    onChange={(e) => setData('categoria_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 text-gray-700"
                                    required
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categorias?.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                                {errors.categoria_id && <p className="mt-1 text-xs text-red-500">{errors.categoria_id}</p>}
                            </div>
                            <div>
                                <select
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 text-gray-700"
                                >
                                    <option value="activo">Activo</option>
                                    <option value="mantenimiento">En mantenimiento</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                        <button
                            disabled={processing}
                            className="mt-5 w-full md:w-auto rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 transition"
                        >
                            {processing ? 'Guardando...' : 'Guardar Equipo'}
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
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600"
                >
                    <option value="">Todas las categorías</option>
                    {categorias?.map((c) => (
                        <option key={c.id} value={c.nombre}>{c.nombre}</option>
                    ))}
                </select>
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600"
                >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="mantenimiento">En mantenimiento</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </div>

            {/* VISTA MÓVIL */}
            <div className="space-y-4 md:hidden">
                <h3 className="text-base font-semibold text-gray-700 px-1 mb-2">Lista de Equipos</h3>
                {equiposFiltrados.length > 0 ? (
                    equiposFiltrados.map((eq) => (
                        <div key={eq.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base leading-tight">{eq.nombre}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{eq.nombre_sucursal}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                                    eq.estado === 'activo'
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : eq.estado === 'mantenimiento'
                                        ? 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                        : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    {eq.estado === 'activo' ? 'Activo' : eq.estado === 'mantenimiento' ? 'Mantenimiento' : 'Inactivo'}
                                </span>
                            </div>

                            <div className="border-t border-gray-100 pt-3 text-xs text-gray-600">
                                <span className="block text-gray-400 font-medium mb-0.5">Categoría</span>
                                <span className="font-medium text-gray-700">{eq.nombre_categoria}</span>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                <button onClick={() => abrirEditar(eq)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-600 transition active:bg-blue-50 active:text-blue-500">
                                    <IconEdit />
                                </button>
                                <button onClick={() => setDeleteTarget(eq)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 transition active:bg-red-50 active:text-red-500">
                                    <IconTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                        No se encontraron equipos.
                    </div>
                )}
            </div>

            {/* VISTA DESKTOP */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Lista de Equipos</div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Nombre</th>
                            <th>Sucursal</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th className="pr-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equiposFiltrados.length > 0 ? (
                            equiposFiltrados.map((eq) => (
                                <tr key={eq.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="p-5 font-medium text-gray-900">{eq.nombre}</td>
                                    <td className="text-gray-600">{eq.nombre_sucursal}</td>
                                    <td className="text-gray-600">{eq.nombre_categoria}</td>
                                    <td>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            eq.estado === 'activo'
                                                ? 'bg-green-100 text-green-600'
                                                : eq.estado === 'mantenimiento'
                                                ? 'bg-yellow-100 text-yellow-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {eq.estado === 'activo' ? 'Activo' : eq.estado === 'mantenimiento' ? 'Mantenimiento' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="pr-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => abrirEditar(eq)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
                                                title="Editar">
                                                <IconEdit />
                                            </button>
                                            <button onClick={() => setDeleteTarget(eq)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                                title="Eliminar">
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">
                                    No se encontraron equipos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDITAR */}
            <Modal open={!!editando} onClose={() => setEditando(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar equipo</h3>
                <form onSubmit={guardarEdicion} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Nombre</label>
                        <input
                            type="text"
                            value={editForm.data.nombre}
                            onChange={(e) => editForm.setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {editForm.errors.nombre && <p className="mt-1 text-xs text-red-500">{editForm.errors.nombre}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Sucursal</label>
                        <select
                            value={editForm.data.sucursal_id}
                            onChange={(e) => editForm.setData('sucursal_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            {sucursales?.map((s) => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Categoría</label>
                        <select
                            value={editForm.data.categoria_id}
                            onChange={(e) => editForm.setData('categoria_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            {categorias?.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Estado</label>
                        <select
                            value={editForm.data.estado}
                            onChange={(e) => editForm.setData('estado', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            <option value="activo">Activo</option>
                            <option value="mantenimiento">En mantenimiento</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setEditando(null)}
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

            {/* MODAL ELIMINAR */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400">
                    <IconTrash />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar equipo</h3>
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
                        {deleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </Modal>
        </PerfilLayout>
    );
}