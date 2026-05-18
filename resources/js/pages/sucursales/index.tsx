import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import PerfilLayout from '@/layouts/perfil-layout';

type Franquicia = {
    id: number;
    nombre: string;
};

type Sucursal = {
    id: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    telefono: string | null;
    activa: boolean;
    franquicia: Franquicia;
};

// ── Iconos vectoriales estándar del ERP ───────────────────────────────────────
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

// ── Componente Modal unificado ────────────────────────────────────────────────
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

export default function SucursalesIndex({
    sucursales,
    franquicias,
}: {
    sucursales: Sucursal[];
    franquicias: Franquicia[];
}) {
    // ── Registrar (Formulario Superior) ──
    const createForm = useForm({
        franquicia_id: '',
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: '',
    });

    function handleCreateSubmit(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/sucursales', {
            onSuccess: () => createForm.reset(),
        });
    }

    // ── Editar (Estructura en Modal) ──
    const [editTarget, setEditTarget] = useState<Sucursal | null>(null);
    const editForm = useForm({
        franquicia_id: '',
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: '',
        activa: true,
    });

    function openEdit(suc: Sucursal) {
        editForm.clearErrors();
        editForm.setData({
            franquicia_id: suc.franquicia?.id.toString() || '',
            nombre: suc.nombre,
            direccion: suc.direccion,
            ciudad: suc.ciudad,
            telefono: suc.telefono || '',
            activa: suc.activa,
        });
        setEditTarget(suc);
    }

    function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/sucursales/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    // ── Eliminar / Desactivar (Estructura en Modal de Advertencia) ──
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

    return (
        <PerfilLayout
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Sucursales"
            subtitle="Administración de sucursales del gimnasio."
        >
            {/* ── Formulario Crear ── */}
            <form
                onSubmit={handleCreateSubmit}
                className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h3 className="mb-5 text-lg font-semibold">Registrar nueva sucursal</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <select
                            value={createForm.data.franquicia_id}
                            onChange={(e) => createForm.setData('franquicia_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white text-gray-700"
                            required
                        >
                            <option value="">Seleccionar franquicia</option>
                            {franquicias.map((franquicia) => (
                                <option key={franquicia.id} value={franquicia.id}>
                                    {franquicia.nombre}
                                </option>
                            ))}
                        </select>
                        {createForm.errors.franquicia_id && (
                            <p className="mt-1 text-xs text-red-500">{createForm.errors.franquicia_id}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Nombre de la sucursal"
                            value={createForm.data.nombre}
                            onChange={(e) => createForm.setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {createForm.errors.nombre && (
                            <p className="mt-1 text-xs text-red-500">{createForm.errors.nombre}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Dirección"
                            value={createForm.data.direccion}
                            onChange={(e) => createForm.setData('direccion', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {createForm.errors.direccion && (
                            <p className="mt-1 text-xs text-red-500">{createForm.errors.direccion}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Ciudad"
                            value={createForm.data.ciudad}
                            onChange={(e) => createForm.setData('ciudad', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {createForm.errors.ciudad && (
                            <p className="mt-1 text-xs text-red-500">{createForm.errors.ciudad}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Teléfono"
                            value={createForm.data.telefono}
                            onChange={(e) => createForm.setData('telefono', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />
                        {createForm.errors.telefono && (
                            <p className="mt-1 text-xs text-red-500">{createForm.errors.telefono}</p>
                        )}
                    </div>
                </div>

                <button
                    disabled={createForm.processing}
                    className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                >
                    {createForm.processing ? 'Guardando...' : 'Guardar Sucursal'}
                </button>
            </form>

            {/* 📱 1. VISTA MÓVIL (Tarjetas) */}
            <div className="space-y-4 md:hidden">
                <h3 className="text-base font-semibold text-gray-700 px-1 mb-2">Lista de Sucursales</h3>
                {sucursales && sucursales.length > 0 ? (
                    sucursales.map((sucursal) => (
                        <div key={sucursal.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base leading-tight">{sucursal.nombre}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{sucursal.direccion}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                                    sucursal.activa
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    {sucursal.activa ? 'Activa' : 'Inactiva'}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-xs">
                                <div className="col-span-1">
                                    <span className="block text-gray-400 font-medium mb-0.5">Franquicia</span>
                                    <span className="text-gray-700 font-medium truncate block">{sucursal.franquicia?.nombre ?? 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Ciudad</span>
                                    <span className="text-gray-700 font-medium block">{sucursal.ciudad}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Teléfono</span>
                                    <span className="text-gray-600 font-medium block truncate">
                                        {sucursal.telefono ?? 'Sin número'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                <button
                                    onClick={() => openEdit(sucursal)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-600 transition active:bg-blue-50 active:text-blue-500"
                                    title="Editar"
                                >
                                    <IconEdit />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(sucursal)}
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
                        No hay sucursales registradas en el sistema.
                    </div>
                )}
            </div>

            {/* 💻 2. VISTA ESCRITORIO (Tabla) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Lista de Sucursales</div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Sucursal / Dirección</th>
                            <th>Franquicia</th>
                            <th>Ciudad</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th className="pr-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sucursales && sucursales.length > 0 ? (
                            sucursales.map((sucursal) => (
                                <tr key={sucursal.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="p-5">
                                        <div className="font-medium text-gray-900">{sucursal.nombre}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{sucursal.direccion}</div>
                                    </td>
                                    <td className="text-gray-600">{sucursal.franquicia?.nombre}</td>
                                    <td className="text-gray-600">{sucursal.ciudad}</td>
                                    <td className="text-gray-600">{sucursal.telefono ?? 'Sin teléfono'}</td>
                                    <td>
                                        <span className={sucursal.activa
                                            ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600'
                                            : 'rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600'
                                        }>
                                            {sucursal.activa ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                    <td className="pr-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEdit(sucursal)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
                                                title="Editar"
                                            >
                                                <IconEdit />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(sucursal)}
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
                                <td colSpan={6} className="p-8 text-center text-gray-400">
                                    No hay sucursales registradas en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Modal Editar ── */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar Sucursal</h3>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Franquicia Relacionada</label>
                        <select
                            value={editForm.data.franquicia_id}
                            onChange={(e) => editForm.setData('franquicia_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white"
                            required
                        >
                            <option value="">Seleccionar franquicia</option>
                            {franquicias.map((franquicia) => (
                                <option key={franquicia.id} value={franquicia.id}>
                                    {franquicia.nombre}
                                </option>
                            ))}
                        </select>
                        {editForm.errors.franquicia_id && (
                            <p className="mt-1 text-xs text-red-500">{editForm.errors.franquicia_id}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Nombre de la Sucursal</label>
                        <input
                            type="text"
                            value={editForm.data.nombre}
                            onChange={(e) => editForm.setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {editForm.errors.nombre && (
                            <p className="mt-1 text-xs text-red-500">{editForm.errors.nombre}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Dirección</label>
                        <input
                            type="text"
                            value={editForm.data.direccion}
                            onChange={(e) => editForm.setData('direccion', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {editForm.errors.direccion && (
                            <p className="mt-1 text-xs text-red-500">{editForm.errors.direccion}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Ciudad</label>
                            <input
                                type="text"
                                value={editForm.data.ciudad}
                                onChange={(e) => editForm.setData('ciudad', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                                required
                            />
                            {editForm.errors.ciudad && (
                                <p className="mt-1 text-xs text-red-500">{editForm.errors.ciudad}</p>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Teléfono</label>
                            <input
                                type="text"
                                value={editForm.data.telefono}
                                onChange={(e) => editForm.setData('telefono', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            />
                            {editForm.errors.telefono && (
                                <p className="mt-1 text-xs text-red-500">{editForm.errors.telefono}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Estado de Operación</label>
                        <select
                            value={editForm.data.activa ? 'true' : 'false'}
                            onChange={(e) => editForm.setData('activa', e.target.value === 'true')}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white"
                        >
                            <option value="true">Activa</option>
                            <option value="false">Inactiva</option>
                        </select>
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

                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar Sucursal</h3>
                <p className="mb-6 text-sm text-gray-500">
                    ¿Estás seguro de que deseas eliminar la sucursal{' '}
                    <span className="font-semibold text-gray-700">{deleteTarget?.nombre}</span>?
                    Esta acción no se puede deshacer y desvinculará a los empleados asignados a ella.
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