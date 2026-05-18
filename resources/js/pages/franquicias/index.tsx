import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import PerfilLayout from '@/layouts/perfil-layout';

type Franquicia = {
    id: number;
    nombre: string;
    ubicacion: string;
    presupuesto: number;
    capacidad_max: number;
};

type Props = {
    franquicias: Franquicia[];
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

export default function FranquiciasIndex({ franquicias }: Props) {
    // ── Registrar Franquicia ──
    const createForm = useForm({
        nombre: '',
        ubicacion: '',
        presupuesto: '',
        capacidad_max: '',
    });

    function handleCreateSubmit(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/franquicias', {
            onSuccess: () => createForm.reset(),
        });
    }

    // ── Editar Franquicia ──
    const [editTarget, setEditTarget] = useState<Franquicia | null>(null);
    const editForm = useForm({
        nombre: '',
        ubicacion: '',
        presupuesto: 0,
        capacidad_max: 0,
    });

    function openEdit(fran: Franquicia) {
        editForm.clearErrors();
        editForm.setData({
            nombre: fran.nombre,
            ubicacion: fran.ubicacion,
            presupuesto: fran.presupuesto,
            capacidad_max: fran.capacidad_max,
        });
        setEditTarget(fran);
    }

    function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/franquicias/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    // ── Eliminar Franquicia ──
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

    return (
        <PerfilLayout
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Franquicias"
            subtitle="Administración de franquicias globales del gimnasio."
        >
            {/* ── Formulario Crear ── */}
            <form onSubmit={handleCreateSubmit} className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-semibold">Registrar nueva franquicia</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre de la franquicia"
                            value={createForm.data.nombre}
                            onChange={e => createForm.setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {createForm.errors.nombre && (
                            <span className="mt-1 block text-xs text-red-500">{createForm.errors.nombre}</span>
                        )}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Dirección / Ubicación"
                            value={createForm.data.ubicacion}
                            onChange={e => createForm.setData('ubicacion', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {createForm.errors.ubicacion && (
                            <span className="mt-1 block text-xs text-red-500">{createForm.errors.ubicacion}</span>
                        )}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Presupuesto Inicial ($)"
                            value={createForm.data.presupuesto}
                            onChange={e => createForm.setData('presupuesto', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {createForm.errors.presupuesto && (
                            <span className="mt-1 block text-xs text-red-500">{createForm.errors.presupuesto}</span>
                        )}
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Capacidad Máx. Socios"
                            value={createForm.data.capacidad_max}
                            onChange={e => createForm.setData('capacidad_max', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {createForm.errors.capacidad_max && (
                            <span className="mt-1 block text-xs text-red-500">{createForm.errors.capacidad_max}</span>
                        )}
                    </div>
                </div>

                <button
                    disabled={createForm.processing}
                    className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                >
                    {createForm.processing ? 'Guardando...' : 'Crear Franquicia'}
                </button>
            </form>

            {/* ========================================================================= */}
            {/* 📱 1. VISTA MÓVIL: Tarjetas Apiladas (Se activa por defecto, se oculta en md:) */}
            {/* ========================================================================= */}
            <div className="space-y-4 md:hidden">
                <h3 className="text-base font-semibold text-gray-700 px-1 mb-2">Lista de Franquicias</h3>
                {franquicias && franquicias.length > 0 ? (
                    franquicias.map((fran) => (
                        <div key={fran.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                            <div>
                                <h4 className="font-bold text-gray-900 text-base leading-tight">{fran.nombre}</h4>
                                <p className="text-xs text-gray-400 mt-1">{fran.ubicacion}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 text-xs">
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Presupuesto Anual</span>
                                    <span className="font-bold text-gray-900">
                                        ${Number(fran.presupuesto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Capacidad</span>
                                    <span className="text-gray-700 font-medium block">
                                        {Number(fran.capacidad_max).toLocaleString('es-MX')} socios
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                <button
                                    onClick={() => openEdit(fran)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-600 transition active:bg-blue-50 active:text-blue-500"
                                    title="Editar"
                                >
                                    <IconEdit />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(fran)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 transition active:bg-red-50 active:text-red-500"
                                    title="Eliminar"
                                >
                                    <IconTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                        No hay franquicias registradas en el sistema.
                    </div>
                )}
            </div>

            {/* ========================================================================= */}
            {/* 💻 2. VISTA ESCRITORIO: Tabla Clásica (Oculta en móviles, se activa en md:) */}
            {/* ========================================================================= */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">
                    Lista de franquicias activas
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Franquicia / Dirección</th>
                            <th>Presupuesto Anual</th>
                            <th>Capacidad de Socios</th>
                            <th className="pr-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {franquicias && franquicias.length > 0 ? (
                            franquicias.map((fran) => (
                                <tr key={fran.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="p-5">
                                        <div className="font-medium text-gray-900">{fran.nombre}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{fran.ubicacion}</div>
                                    </td>
                                    <td className="font-medium text-gray-700">
                                        ${Number(fran.presupuesto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="text-gray-600">
                                        {Number(fran.capacidad_max).toLocaleString('es-MX')} usuarios máx.
                                    </td>
                                    <td className="pr-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEdit(fran)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
                                                title="Editar"
                                            >
                                                <IconEdit />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(fran)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                                title="Eliminar"
                                            >
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400">
                                    No hay franquicias registradas en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Modal Editar ── */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar Franquicia</h3>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Nombre de la Franquicia</label>
                        <input
                            type="text"
                            value={editForm.data.nombre}
                            onChange={e => editForm.setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {editForm.errors.nombre && (
                            <span className="mt-1 block text-xs text-red-500">{editForm.errors.nombre}</span>
                        )}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Dirección / Ubicación</label>
                        <input
                            type="text"
                            value={editForm.data.ubicacion}
                            onChange={e => editForm.setData('ubicacion', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {editForm.errors.ubicacion && (
                            <span className="mt-1 block text-xs text-red-500">{editForm.errors.ubicacion}</span>
                        )}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Presupuesto Asignado ($ MXN)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={editForm.data.presupuesto}
                            onChange={e => editForm.setData('presupuesto', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {editForm.errors.presupuesto && (
                            <span className="mt-1 block text-xs text-red-500">{editForm.errors.presupuesto}</span>
                        )}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Capacidad Máxima de Socios</label>
                        <input
                            type="number"
                            value={editForm.data.capacidad_max}
                            onChange={e => editForm.setData('capacidad_max', parseInt(e.target.value) || 0)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {editForm.errors.capacidad_max && (
                            <span className="mt-1 block text-xs text-red-500">{editForm.errors.capacidad_max}</span>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setEditTarget(null)}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                        >
                            {editForm.processing ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Modal Eliminar ── */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <IconTrash />
                </div>

                <h3 className="mb-1 text-lg font-semibold text-gray-800">Cerrar Franquicia</h3>
                <p className="mb-6 text-sm text-gray-500">
                    ¿Estás seguro de que deseas dar de baja la franquicia de{' '}
                    <span className="font-semibold text-gray-700">{deleteTarget?.nombre}</span>?
                    Esta acción es irreversible y afectará de forma colateral a las sucursales amarradas a ella.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setDeleteTarget(null)}
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={confirmDelete}
                        disabled={deleting}
                        className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                    >
                        {deleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </Modal>
        </PerfilLayout>
    );
}