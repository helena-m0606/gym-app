import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import PerfilLayout from '@/layouts/perfil-layout';

type Membresia = {
    id: number;
    miembro: string;
    tipo: string;
    precio: number;
    fecha_inicio: string;
    fecha_fin: string;
    activa: boolean;
};

type TipoMembresia = {
    id: number;
    nombre: string;
    precio: number;
    duracion_dias: number;
};

type Miembro = {
    id: number;
    nombre: string;
};

type Props = {
    membresias: Membresia[];
    tiposMembresia: TipoMembresia[];
    miembros: Miembro[];
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

export default function MembresiasIndex({ membresias, tiposMembresia, miembros }: Props) {
    const [showForm, setShowForm] = useState(false);

    const [editando, setEditando] = useState<Membresia | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Membresia | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [editandoTipo, setEditandoTipo] = useState<TipoMembresia | null>(null);
    const [deleteTipoTarget, setDeleteTipoTarget] = useState<TipoMembresia | null>(null);
    const [deletingTipo, setDeletingTipo] = useState(false);
    
    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    const { data, setData, post, processing, reset, errors } = useForm({
        miembro_id: '',
        tipo_membresia_id: '',
        fecha_inicio: '',
    });

    const editForm = useForm({
        tipo_membresia_id: '',
        fecha_inicio: '',
        activa: true,
    });

    const tipoForm = useForm({
        nombre: '',
        duracion_dias: '',
        precio: '',
    });

    const editTipoForm = useForm({
        nombre: '',
        duracion_dias: '',
        precio: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/membresias', { onSuccess: () => reset() });
    }

    function abrirEditar(m: Membresia) {
        setEditando(m);
        editForm.setData({
            tipo_membresia_id: String(tiposMembresia.find(t => t.nombre === m.tipo)?.id ?? ''),
            fecha_inicio: m.fecha_inicio.split('T')[0],
            activa: m.activa,
        });
    }

    function guardarEdicion(e: React.FormEvent) {
        e.preventDefault();
        editForm.put(`/membresias/${editando?.id}`, {
            onSuccess: () => setEditando(null),
        });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/membresias/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); setDeleting(false); },
            onError: () => setDeleting(false),
        });
    }

    function submitTipo(e: React.FormEvent) {
        e.preventDefault();
        tipoForm.post('/tipos-membresia', { onSuccess: () => { tipoForm.reset(); setShowForm(false); } });
    }

    function abrirEditarTipo(t: TipoMembresia) {
        setEditandoTipo(t);
        editTipoForm.setData({
            nombre: t.nombre,
            duracion_dias: String(t.duracion_dias),
            precio: String(t.precio),
        });
    }

    function guardarEdicionTipo(e: React.FormEvent) {
        e.preventDefault();
        editTipoForm.put(`/tipos-membresia/${editandoTipo?.id}`, {
            onSuccess: () => setEditandoTipo(null),
        });
    }

    function confirmDeleteTipo() {
        if (!deleteTipoTarget) return;
        setDeletingTipo(true);
        router.delete(`/tipos-membresia/${deleteTipoTarget.id}`, {
            onSuccess: () => { setDeleteTipoTarget(null); setDeletingTipo(false); },
            onError: () => setDeletingTipo(false),
        });
    }

    const hoy = new Date();

    const membresiasFiltradas = membresias.filter((m) => {
        const vence = new Date(m.fecha_fin);
        const diff = Math.ceil((vence.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        const estadoTexto = diff < 0 ? 'vencida' : diff <= 7 ? 'por vencer' : 'activa';
        return (
            m.miembro.toLowerCase().includes(busqueda.toLowerCase()) &&
            (filtroTipo === '' || m.tipo === filtroTipo) &&
            (filtroEstado === '' || estadoTexto === filtroEstado)
        );
    });

    return (
        <PerfilLayout
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Membresías"
            subtitle="Gestión de planes y membresías de los miembros."
        >
            <div className="mb-10">
                <h2 className="mb-4 text-xl font-bold text-gray-800">Tipos de Membresía</h2>

                <div className="mb-6">
                    {!showForm ? (
                        <button onClick={() => setShowForm(true)}
                            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 transition">
                            + Añadir tipo
                        </button>
                    ) : (
                        <form onSubmit={submitTipo} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Registrar nuevo tipo</h3>
                                <button type="button" onClick={() => setShowForm(false)}
                                    className="text-sm font-medium text-gray-400 hover:text-gray-600 transition">Cancelar</button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Nombre (ej. Mensual Plus)"
                                        value={tipoForm.data.nombre}
                                        onChange={(e) => tipoForm.setData('nombre', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                                        required
                                    />
                                    {tipoForm.errors.nombre && <p className="mt-1 text-xs text-red-500">{tipoForm.errors.nombre}</p>}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Duración en días (ej. 30)"
                                        value={tipoForm.data.duracion_dias}
                                        onChange={(e) => tipoForm.setData('duracion_dias', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                                        required
                                    />
                                    {tipoForm.errors.duracion_dias && <p className="mt-1 text-xs text-red-500">{tipoForm.errors.duracion_dias}</p>}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Precio (ej. 599)"
                                        value={tipoForm.data.precio}
                                        onChange={(e) => tipoForm.setData('precio', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                                        required
                                    />
                                    {tipoForm.errors.precio && <p className="mt-1 text-xs text-red-500">{tipoForm.errors.precio}</p>}
                                </div>
                            </div>
                            <button
                                disabled={tipoForm.processing}
                                className="mt-5 w-full md:w-auto rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 transition"
                            >
                                {tipoForm.processing ? 'Guardando...' : 'Guardar Tipo'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="space-y-3 md:hidden">
                    {tiposMembresia.map((t) => (
                        <div key={t.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{t.nombre}</h4>
                                <p className="text-xs text-gray-400 mt-0.5">{t.duracion_dias} días — <span className="font-semibold text-gray-700">${t.precio}</span></p>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => abrirEditarTipo(t)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-500 active:bg-blue-50 active:text-blue-500">
                                    <IconEdit />
                                </button>
                                <button onClick={() => setDeleteTipoTarget(t)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 active:bg-red-50 active:text-red-500">
                                    <IconTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">Lista de Tipos</div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-5">Nombre</th>
                                <th>Duración</th>
                                <th>Precio</th>
                                <th className="pr-5 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tiposMembresia.map((t) => (
                                <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="p-5 font-medium">{t.nombre}</td>
                                    <td className="text-gray-600">{t.duracion_dias} days</td>
                                    <td className="font-medium text-gray-900">${t.precio}</td>
                                    <td className="pr-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => abrirEditarTipo(t)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500" title="Editar">
                                                <IconEdit />
                                            </button>
                                            <button onClick={() => setDeleteTipoTarget(t)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500" title="Eliminar">
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="mb-4 text-xl font-bold text-gray-800">Membresías de Miembros</h2>

                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 sm:max-w-xs"
                    />
                    <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600"
                    >
                        <option value="">Todos los tipos</option>
                        {tiposMembresia.map((t) => (
                            <option key={t.id} value={t.nombre}>{t.nombre}</option>
                        ))}
                    </select>
                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600"
                    >
                        <option value="">Todos los estados</option>
                        <option value="activa">Activa</option>
                        <option value="por vencer">Por vencer</option>
                        <option value="vencida">Vencida</option>
                    </select>
                </div>

                <div className="space-y-4 md:hidden">
                    {membresiasFiltradas.length > 0 ? (
                        membresiasFiltradas.map((m) => {
                            const vence = new Date(m.fecha_fin);
                            const diff = Math.ceil((vence.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                            const vencida = diff < 0;
                            const porVencer = diff >= 0 && diff <= 7;

                            return (
                                <div key={m.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base leading-tight">{m.miembro}</h4>
                                            <p className="text-xs text-gray-400 mt-1">Plan: <span className="font-medium text-gray-600">{m.tipo}</span> — ${m.precio}</p>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                                            vencida ? 'bg-red-50 text-red-700 border border-red-100' :
                                            porVencer ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                            'bg-green-50 text-green-700 border border-green-100'
                                        }`}>
                                            {vencida ? 'Vencida' : porVencer ? 'Por vencer' : 'Activa'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                                        <div>
                                            <span className="block text-gray-400 font-medium mb-0.5">Fecha Inicio</span>
                                            {new Date(m.fecha_inicio).toLocaleDateString('es-MX')}
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 font-medium mb-0.5">Fecha Vence</span>
                                            <span className={vencida ? 'text-red-600 font-semibold' : porVencer ? 'text-yellow-600 font-semibold' : 'text-gray-700'}>
                                                {vence.toLocaleDateString('es-MX')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                        <button onClick={() => abrirEditar(m)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-600 active:bg-blue-50 active:text-blue-500">
                                            <IconEdit />
                                        </button>
                                        <button onClick={() => setDeleteTarget(m)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 active:bg-red-50 active:text-red-500">
                                            <IconTrash />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                            No se encontraron registros coincidentes.
                        </div>
                    )}
                </div>

                <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">Lista de Membresías</div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-5">Miembro / Plan</th>
                                <th>Precio</th>
                                <th>Vigencia (Inicio - Fin)</th>
                                <th>Estado</th>
                                <th className="pr-5 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membresiasFiltradas.map((m) => {
                                const vence = new Date(m.fecha_fin);
                                const diff = Math.ceil((vence.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                                const vencida = diff < 0;
                                const porVencer = diff >= 0 && diff <= 7;

                                return (
                                    <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                        <td className="p-5">
                                            <div className="font-medium text-gray-900">{m.miembro}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{m.tipo}</div>
                                        </td>
                                        <td className="text-gray-900 font-medium">${m.precio}</td>
                                        <td className="text-gray-600">
                                            {new Date(m.fecha_inicio).toLocaleDateString('es-MX')} — {vence.toLocaleDateString('es-MX')}
                                        </td>
                                        <td>
                                            <span className={
                                                vencida ? 'rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600' :
                                                porVencer ? 'rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-600' :
                                                'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600'
                                            }>
                                                {vencida ? 'Vencida' : porVencer ? 'Por vencer' : 'Activa'}
                                            </span>
                                        </td>
                                        <td className="pr-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => abrirEditar(m)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500" title="Editar">
                                                    <IconEdit />
                                                </button>
                                                <button onClick={() => setDeleteTarget(m)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500" title="Eliminar">
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal open={!!editando} onClose={() => setEditando(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar membresía — {editando?.miembro}</h3>
                <form onSubmit={guardarEdicion} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Tipo de membresía</label>
                        <select
                            value={editForm.data.tipo_membresia_id}
                            onChange={(e) => editForm.setData('tipo_membresia_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white text-gray-700"
                        >
                            {tiposMembresia.map((t) => (
                                <option key={t.id} value={t.id}>{t.nombre} — ${t.precio}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Fecha de inicio</label>
                        <input
                            type="date"
                            value={editForm.data.fecha_inicio}
                            onChange={(e) => editForm.setData('fecha_inicio', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                        <input type="checkbox" id="activa" checked={editForm.data.activa}
                            onChange={(e) => editForm.setData('activa', e.target.checked)} className="rounded border-gray-300 text-orange-500 focus:ring-orange-400" />
                        <label htmlFor="activa" className="text-sm text-gray-600 font-medium">Membresía activa</label>
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

            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400">
                    <IconTrash />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar membresía</h3>
                <p className="mb-6 text-sm text-gray-500">
                    ¿Estás seguro de eliminar la membresía de{' '}
                    <span className="font-semibold text-gray-700">{deleteTarget?.miembro}</span>?
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

            <Modal open={!!editandoTipo} onClose={() => setEditandoTipo(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar tipo — {editandoTipo?.nombre}</h3>
                <form onSubmit={guardarEdicionTipo} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Nombre</label>
                        <input type="text" value={editTipoForm.data.nombre}
                            onChange={(e) => editTipoForm.setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Duración en días</label>
                            <input type="number" value={editTipoForm.data.duracion_dias}
                                onChange={(e) => editTipoForm.setData('duracion_dias', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Precio</label>
                            <input type="number" value={editTipoForm.data.precio}
                                onChange={(e) => editTipoForm.setData('precio', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setEditandoTipo(null)}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={editTipoForm.processing}
                            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                            {editTipoForm.processing ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal open={!!deleteTipoTarget} onClose={() => setDeleteTipoTarget(null)}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400">
                    <IconTrash />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar tipo</h3>
                <p className="mb-6 text-sm text-gray-500">
                    ¿Estás seguro de eliminar el tipo{' '}
                    <span className="font-semibold text-gray-700">{deleteTipoTarget?.nombre}</span>?
                    Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setDeleteTipoTarget(null)}
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button onClick={confirmDeleteTipo} disabled={deletingTipo}
                        className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
                        {deletingTipo ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </Modal>
        </PerfilLayout>
    );
}