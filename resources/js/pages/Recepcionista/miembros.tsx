import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
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

type Sucursal = { id: number; nombre: string };

type Miembro = {
    id: number;
    sucursal_id: number;
    nombre: string;
    email: string;
    telefono: string | null;
    fecha_nacimiento: string | null;
    genero: string | null;
    estado: boolean;
    sucursal?: Sucursal;
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
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                {children}
            </div>
        </div>
    );
}

export default function Index({ miembros, sucursales }: { miembros: Miembro[]; sucursales: Sucursal[] }) {
    const [showForm, setShowForm] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtroSucursal, setFiltroSucursal] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        sucursal_id: '',
        nombre: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        genero: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/miembros', { onSuccess: () => { reset(); setShowForm(false); } });
    }

    const [editTarget, setEditTarget] = useState<Miembro | null>(null);
    const editForm = useForm({
        sucursal_id: '',
        nombre: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        genero: '',
        estado: true as boolean,
    });

    function openEdit(m: Miembro) {
        editForm.clearErrors();
        editForm.setData({
            sucursal_id: String(m.sucursal_id),
            nombre: m.nombre,
            email: m.email,
            telefono: m.telefono ?? '',
            fecha_nacimiento: m.fecha_nacimiento ?? '',
            genero: m.genero ?? '',
            estado: m.estado,
        });
        setEditTarget(m);
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/miembros/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    const [deleteTarget, setDeleteTarget] = useState<Miembro | null>(null);
    const [deleting, setDeleting] = useState(false);

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/miembros/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); setDeleting(false); },
            onError: () => setDeleting(false),
        });
    }

    const miembrosFiltrados = miembros.filter((m) => {
        const coincideNombre = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideSucursal = filtroSucursal === '' || String(m.sucursal_id) === filtroSucursal;
        const coincideEstado = filtroEstado === '' || (filtroEstado === 'activo' ? m.estado : !m.estado);
        return coincideNombre && coincideSucursal && coincideEstado;
    });

    return (
        <PerfilLayout
            menuItems={menuItems}
            title="Miembros"
            subtitle="Administración de miembros del gimnasio."
        >
            {/* FORMULARIO */}
            <div className="mb-8">
                {!showForm ? (
                    <button onClick={() => setShowForm(true)}
                        className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 transition">
                        + Añadir miembro
                    </button>
                ) : (
                    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Registrar nuevo miembro</h3>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-sm font-medium text-gray-400 hover:text-gray-600 transition">Cancelar</button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <input type="text" placeholder="Nombre completo" value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                                {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
                            </div>
                            <div>
                                <input type="email" placeholder="Correo electrónico" value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <select value={data.sucursal_id} onChange={(e) => setData('sucursal_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white text-gray-700">
                                    <option value="">Seleccionar sucursal</option>
                                    {sucursales.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nombre}</option>
                                    ))}
                                </select>
                                {errors.sucursal_id && <p className="mt-1 text-xs text-red-500">{errors.sucursal_id}</p>}
                            </div>
                            <div>
                                <input type="text" placeholder="Teléfono (10 dígitos)" value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                                {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono}</p>}
                            </div>
                            <div>
                                <input type="date" value={data.fecha_nacimiento}
                                    onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:border-orange-400" />
                            </div>
                            <div>
                                <select value={data.genero} onChange={(e) => setData('genero', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white text-gray-700">
                                    <option value="">Género (Opcional)</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </div>
                        <button disabled={processing}
                            className="mt-5 w-full md:w-auto rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 transition">
                            {processing ? 'Guardando...' : 'Guardar Miembro'}
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
                <select value={filtroSucursal} onChange={(e) => setFiltroSucursal(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600">
                    <option value="">Todas las sucursales</option>
                    {sucursales.map((s) => (
                        <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                </select>
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600">
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </div>

            {/* VISTA MÓVIL */}
            <div className="space-y-4 md:hidden">
                <h3 className="text-base font-semibold text-gray-700 px-1 mb-2">Lista de Miembros</h3>
                {miembrosFiltrados.length > 0 ? (
                    miembrosFiltrados.map((m) => (
                        <div key={m.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base leading-tight">{m.nombre}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{m.email}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                                    m.estado
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    {m.estado ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Sucursal</span>
                                    <span className="font-medium text-gray-700">{m.sucursal?.nombre ?? 'Sin asignar'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Teléfono</span>
                                    <span className="font-medium text-gray-700">{m.telefono ?? 'N/A'}</span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                <button onClick={() => openEdit(m)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-600 transition active:bg-blue-50 active:text-blue-500">
                                    <IconEdit />
                                </button>
                                <button onClick={() => setDeleteTarget(m)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 transition active:bg-red-50 active:text-red-500">
                                    <IconTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                        No se encontraron miembros.
                    </div>
                )}
            </div>

            {/* VISTA DESKTOP */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Lista de Miembros</div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Nombre / Email</th>
                            <th>Sucursal</th>
                            <th>Teléfono</th>
                            <th>Género</th>
                            <th>Estado</th>
                            <th className="pr-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {miembrosFiltrados.length > 0 ? (
                            miembrosFiltrados.map((m) => (
                                <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition">
                                    <td className="p-5">
                                        <div className="font-medium text-gray-900">{m.nombre}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{m.email}</div>
                                    </td>
                                    <td className="text-gray-600">{m.sucursal?.nombre ?? 'Sin asignar'}</td>
                                    <td className="text-gray-600">{m.telefono ?? 'Sin teléfono'}</td>
                                    <td className="text-gray-500">{m.genero ?? 'N/A'}</td>
                                    <td>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            m.estado
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {m.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="pr-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(m)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500">
                                                <IconEdit />
                                            </button>
                                            <button onClick={() => setDeleteTarget(m)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">No se encontraron miembros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDITAR */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar miembro</h3>
                <form onSubmit={submitEdit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Nombre completo</label>
                        <input type="text" value={editForm.data.nombre}
                            onChange={(e) => editForm.setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                        {editForm.errors.nombre && <p className="mt-1 text-xs text-red-500">{editForm.errors.nombre}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Correo electrónico</label>
                        <input type="email" value={editForm.data.email}
                            onChange={(e) => editForm.setData('email', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                        {editForm.errors.email && <p className="mt-1 text-xs text-red-500">{editForm.errors.email}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Sucursal</label>
                            <select value={editForm.data.sucursal_id}
                                onChange={(e) => editForm.setData('sucursal_id', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-400 bg-white">
                                {sucursales.map((s) => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Teléfono</label>
                            <input type="text" value={editForm.data.telefono}
                                onChange={(e) => editForm.setData('telefono', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Estado</label>
                            <select value={editForm.data.estado ? '1' : '0'}
                                onChange={(e) => editForm.setData('estado', e.target.value === '1')}
                                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-400 bg-white">
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Género</label>
                            <select value={editForm.data.genero}
                                onChange={(e) => editForm.setData('genero', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-orange-400 bg-white">
                                <option value="">No especificado</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
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

            {/* MODAL ELIMINAR */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400">
                    <IconTrash />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar miembro</h3>
                <p className="mb-6 text-sm text-gray-500">
                    ¿Estás seguro de eliminar a{' '}
                    <span className="font-semibold text-gray-700">{deleteTarget?.nombre}</span>?
                    Esta acción revocaría sus accesos y no se puede deshacer.
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