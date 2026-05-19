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

type Franquicia = { id: number; nombre: string; razon_social: string; rfc: string };

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

export default function FranquiciasIndex({ franquicias }: { franquicias: Franquicia[] }) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '', razon_social: '', rfc: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/franquicias', { onSuccess: () => { reset(); setShowForm(false); } });
    }

    const [editTarget, setEditTarget] = useState<Franquicia | null>(null);
    const editForm = useForm({ nombre: '', razon_social: '', rfc: '' });

    function openEdit(f: Franquicia) {
        editForm.setData({ nombre: f.nombre, razon_social: f.razon_social, rfc: f.rfc });
        setEditTarget(f);
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/franquicias/${editTarget.id}`, { onSuccess: () => setEditTarget(null) });
    }

    const [deleteTarget, setDeleteTarget] = useState<Franquicia | null>(null);
    const [deleting, setDeleting] = useState(false);

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/franquicias/${deleteTarget.id}`, {
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
            title="Franquicias"
            subtitle="Administración de franquicias."
        >
            {/* ── Botón / Formulario crear ── */}
            <div className="mb-8">
                {!showForm ? (
                    <button onClick={() => setShowForm(true)}
                        className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600">
                        + Añadir franquicia
                    </button>
                ) : (
                    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Registrar franquicia</h3>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-sm text-gray-400 hover:text-gray-600">Cancelar</button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <input type="text" placeholder="Nombre" value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)} className={inputCls} />
                                {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
                            </div>
                            <div>
                                <input type="text" placeholder="Razón social" value={data.razon_social}
                                    onChange={(e) => setData('razon_social', e.target.value)} className={inputCls} />
                                {errors.razon_social && <p className="mt-1 text-xs text-red-500">{errors.razon_social}</p>}
                            </div>
                            <div>
                                <input type="text" placeholder="RFC" value={data.rfc}
                                    onChange={(e) => setData('rfc', e.target.value.toUpperCase())}
                                    className={`${inputCls} uppercase`} />
                                {errors.rfc && <p className="mt-1 text-xs text-red-500">{errors.rfc}</p>}
                            </div>
                        </div>
                        <button disabled={processing}
                            className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60">
                            {processing ? 'Guardando...' : 'Guardar Franquicia'}
                        </button>
                    </form>
                )}
            </div>

            {/* ── Tabla ── */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Lista de Franquicias</div>
                <table className="min-w-[650px] w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Nombre</th>
                            <th>Razón social</th>
                            <th>RFC</th>
                            <th className="pr-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {franquicias.map((f) => (
                            <tr key={f.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                <td className="p-5 font-medium">{f.nombre}</td>
                                <td>{f.razon_social}</td>
                                <td>{f.rfc}</td>
                                <td className="pr-5">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => openEdit(f)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500">
                                            <IconEdit />
                                        </button>
                                        <button onClick={() => setDeleteTarget(f)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                                            <IconTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Modal Editar ── */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar franquicia</h3>
                <form onSubmit={submitEdit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Nombre</label>
                        <input type="text" value={editForm.data.nombre}
                            onChange={(e) => editForm.setData('nombre', e.target.value)} className={inputCls} />
                        {editForm.errors.nombre && <p className="mt-1 text-xs text-red-500">{editForm.errors.nombre}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Razón social</label>
                        <input type="text" value={editForm.data.razon_social}
                            onChange={(e) => editForm.setData('razon_social', e.target.value)} className={inputCls} />
                        {editForm.errors.razon_social && <p className="mt-1 text-xs text-red-500">{editForm.errors.razon_social}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">RFC</label>
                        <input type="text" value={editForm.data.rfc}
                            onChange={(e) => editForm.setData('rfc', e.target.value.toUpperCase())}
                            className={`${inputCls} uppercase`} />
                        {editForm.errors.rfc && <p className="mt-1 text-xs text-red-500">{editForm.errors.rfc}</p>}
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
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar franquicia</h3>
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