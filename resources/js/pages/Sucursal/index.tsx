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

type Franquicia = { id: number; nombre: string };
type Sucursal = {
    id: number; nombre: string; direccion: string;
    ciudad: string; telefono: string | null; activa: boolean; franquicia: Franquicia;
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

export default function SucursalesIndex({ sucursales, franquicias }: { sucursales: Sucursal[]; franquicias: Franquicia[] }) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        franquicia_id: '', nombre: '', direccion: '', ciudad: '', telefono: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/sucursales', { onSuccess: () => { reset(); setShowForm(false); } });
    }

    const [editTarget, setEditTarget] = useState<Sucursal | null>(null);
    const editForm = useForm({
        franquicia_id: '', nombre: '', direccion: '', ciudad: '', telefono: '', activa: true as boolean
    });

    function openEdit(s: Sucursal) {
        editForm.clearErrors();
        editForm.setData({
            franquicia_id: String(s.franquicia?.id ?? ''),
            nombre: s.nombre,
            direccion: s.direccion,
            ciudad: s.ciudad,
            telefono: s.telefono ?? '',
            activa: s.activa,
        });
        setEditTarget(s);
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/sucursales/${editTarget.id}`, { onSuccess: () => setEditTarget(null) });
    }

    const [deleteTarget, setDeleteTarget] = useState<Sucursal | null>(null);
    const [deleting, setDeleting] = useState(false);

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/sucursales/${deleteTarget.id}`, {
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
            title="Sucursales"
            subtitle="Administración de sucursales del gimnasio."
        >
            {/* FORMULARIO */}
            <div className="mb-8">
                {!showForm ? (
                    <button onClick={() => setShowForm(true)}
                        className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 transition">
                        + Añadir sucursal
                    </button>
                ) : (
                    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Registrar nueva sucursal</h3>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-sm font-medium text-gray-400 hover:text-gray-600 transition">Cancelar</button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <select value={data.franquicia_id} onChange={(e) => setData('franquicia_id', e.target.value)} className={inputCls}>
                                    <option value="">Seleccionar franquicia</option>
                                    {franquicias.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                                </select>
                                {errors.franquicia_id && <p className="mt-1 text-xs text-red-500">{errors.franquicia_id}</p>}
                            </div>
                            <div>
                                <input type="text" placeholder="Nombre de la sucursal" value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)} className={inputCls} />
                            </div>
                            <div className="md:col-span-2">
                                <input type="text" placeholder="Dirección" value={data.direccion}
                                    onChange={(e) => setData('direccion', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <input type="text" placeholder="Ciudad" value={data.ciudad}
                                    onChange={(e) => setData('ciudad', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <input type="text" placeholder="Teléfono" value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)} className={inputCls} />
                            </div>
                        </div>
                        <button disabled={processing}
                            className="mt-5 w-full md:w-auto rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 transition">
                            {processing ? 'Guardando...' : 'Guardar Sucursal'}
                        </button>
                    </form>
                )}
            </div>

            {/* VISTA MÓVIL */}
            <div className="space-y-4 md:hidden">
                <h3 className="text-base font-semibold text-gray-700 px-1 mb-2">Lista de Sucursales</h3>
                {sucursales.length > 0 ? (
                    sucursales.map((s) => (
                        <div key={s.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base leading-tight">{s.nombre}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{s.franquicia?.nombre ?? 'N/A'}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                                    s.activa
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    {s.activa ? 'Activa' : 'Inactiva'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Ciudad</span>
                                    <span className="font-medium text-gray-700">{s.ciudad}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Teléfono</span>
                                    <span className="font-medium text-gray-700">{s.telefono ?? 'Sin teléfono'}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="block text-gray-400 font-medium mb-0.5">Dirección</span>
                                    <span className="font-medium text-gray-700">{s.direccion}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                <button onClick={() => openEdit(s)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-600 active:bg-blue-50 active:text-blue-500">
                                    <IconEdit />
                                </button>
                                <button onClick={() => setDeleteTarget(s)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 active:bg-red-50 active:text-red-500">
                                    <IconTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                        No hay sucursales registradas.
                    </div>
                )}
            </div>

            {/* VISTA DESKTOP */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Lista de Sucursales</div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Sucursal / Franquicia</th>
                            <th>Ciudad</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th className="pr-5 text-center w-32">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sucursales.length > 0 ? (
                            sucursales.map((s) => (
                                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition">
                                    <td className="p-5">
                                        <div className="font-medium text-gray-900">{s.nombre}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{s.franquicia?.nombre ?? 'N/A'}</div>
                                    </td>
                                    <td className="text-gray-600">{s.ciudad}</td>
                                    <td className="text-gray-600">{s.telefono ?? 'Sin teléfono'}</td>
                                    <td>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            s.activa
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {s.activa ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                    <td className="pr-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(s)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500">
                                                <IconEdit />
                                            </button>
                                            <button onClick={() => setDeleteTarget(s)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">No hay sucursales registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDITAR */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar sucursal</h3>
                <form onSubmit={submitEdit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Franquicia</label>
                        <select value={editForm.data.franquicia_id}
                            onChange={(e) => editForm.setData('franquicia_id', e.target.value)} className={inputCls}>
                            <option value="">Seleccionar franquicia</option>
                            {franquicias.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Nombre</label>
                        <input type="text" value={editForm.data.nombre}
                            onChange={(e) => editForm.setData('nombre', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Dirección</label>
                        <input type="text" value={editForm.data.direccion}
                            onChange={(e) => editForm.setData('direccion', e.target.value)} className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Ciudad</label>
                            <input type="text" value={editForm.data.ciudad}
                                onChange={(e) => editForm.setData('ciudad', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Teléfono</label>
                            <input type="text" value={editForm.data.telefono}
                                onChange={(e) => editForm.setData('telefono', e.target.value)} className={inputCls} />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Estado</label>
                        <select value={editForm.data.activa ? '1' : '0'}
                            onChange={(e) => editForm.setData('activa', e.target.value === '1')} className={inputCls}>
                            <option value="1">Activa</option>
                            <option value="0">Inactiva</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
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
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400">
                    <IconTrash />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar sucursal</h3>
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