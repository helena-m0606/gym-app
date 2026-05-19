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

type ItemCatalogo = { id: number; nombre: string };

type EjercicioPivot = {
    id: number;
    nombre: string;
    pivot: {
        series: number;
        repeticiones: number;
    };
};

type Rutina = {
    id: number;
    nombre: string;
    entrenador_id: number;
    entrenador_nombre?: string;
    ejercicios?: EjercicioPivot[];
};

type EjercicioForm = {
    ejercicio_id: string;
    series: string;
    repeticiones: string;
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
            <div className="relative z-10 w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                {children}
            </div>
        </div>
    );
}

export default function Index({ rutinas, catalogoEjercicios, entrenadores }: {
    rutinas: Rutina[];
    catalogoEjercicios: ItemCatalogo[];
    entrenadores: ItemCatalogo[];
}) {
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState<Rutina | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Rutina | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtroEntrenador, setFiltroEntrenador] = useState('');
    const [filtroEjercicio, setFiltroEjercicio] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        entrenador_id: '',
        ejercicios: [] as EjercicioForm[],
    });

    function agregarFila() {
        setData('ejercicios', [...data.ejercicios, { ejercicio_id: '', series: '4', repeticiones: '12' }]);
    }

    function removerFila(index: number) {
        setData('ejercicios', data.ejercicios.filter((_, i) => i !== index));
    }

    function cambiarFila(index: number, campo: keyof EjercicioForm, valor: string) {
        setData('ejercicios', data.ejercicios.map((f, i) => i === index ? { ...f, [campo]: valor } : f));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/rutinas', { onSuccess: () => { reset(); setShowForm(false); } });
    }

    const editForm = useForm({
        nombre: '',
        entrenador_id: '',
        ejercicios: [] as EjercicioForm[],
    });

    function openEdit(r: Rutina) {
        editForm.clearErrors();
        editForm.setData({
            nombre: r.nombre,
            entrenador_id: String(r.entrenador_id),
            ejercicios: r.ejercicios ? r.ejercicios.map(ej => ({
                ejercicio_id: String(ej.id),
                series: String(ej.pivot.series),
                repeticiones: String(ej.pivot.repeticiones),
            })) : [],
        });
        setEditTarget(r);
    }

    function agregarFilaEdit() {
        editForm.setData('ejercicios', [...editForm.data.ejercicios, { ejercicio_id: '', series: '4', repeticiones: '12' }]);
    }

    function removerFilaEdit(index: number) {
        editForm.setData('ejercicios', editForm.data.ejercicios.filter((_, i) => i !== index));
    }

    function cambiarFilaEdit(index: number, campo: keyof EjercicioForm, valor: string) {
        editForm.setData('ejercicios', editForm.data.ejercicios.map((f, i) => i === index ? { ...f, [campo]: valor } : f));
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/rutinas/${editTarget.id}`, { onSuccess: () => setEditTarget(null) });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/rutinas/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); setDeleting(false); },
            onError: () => setDeleting(false),
        });
    }

    const rutinasFiltradas = rutinas.filter((r) => {
        const coincideNombre = r.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideEntrenador = filtroEntrenador === '' || String(r.entrenador_id) === filtroEntrenador;
        const coincideEjercicio = filtroEjercicio === '' || r.ejercicios?.some(ej => String(ej.id) === filtroEjercicio);
        return coincideNombre && coincideEntrenador && coincideEjercicio;
    });

    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Rutinas"
            subtitle="Gestión de las plantillas de entrenamiento del gimnasio."
        >
            {/* FORMULARIO */}
            <div className="mb-8">
                {!showForm ? (
                    <button onClick={() => setShowForm(true)}
                        className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 transition">
                        + Nueva rutina
                    </button>
                ) : (
                    <form onSubmit={submit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Crear nueva rutina</h3>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-sm font-medium text-gray-400 hover:text-gray-600 transition">
                                Cancelar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <input type="text" placeholder="Nombre de la rutina"
                                    value={data.nombre} onChange={(e) => setData('nombre', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400" />
                                {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
                            </div>
                            <div>
                                <select value={data.entrenador_id} onChange={(e) => setData('entrenador_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 text-gray-700">
                                    <option value="">Seleccionar entrenador</option>
                                    {entrenadores.map((ent) => (
                                        <option key={ent.id} value={ent.id}>{ent.nombre}</option>
                                    ))}
                                </select>
                                {errors.entrenador_id && <p className="mt-1 text-xs text-red-500">{errors.entrenador_id}</p>}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700">Ejercicios</span>
                                <button type="button" onClick={agregarFila}
                                    className="text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-50 px-3 py-2 rounded-lg transition">
                                    + Agregar ejercicio
                                </button>
                            </div>

                            {data.ejercicios.map((fila, index) => (
                                <div key={index} className="grid grid-cols-1 gap-2 rounded-xl bg-gray-50 p-3 border border-gray-100 md:grid-cols-12 md:items-end">
                                    <div className="md:col-span-6">
                                        <select value={fila.ejercicio_id}
                                            onChange={(e) => cambiarFila(index, 'ejercicio_id', e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400">
                                            <option value="">Seleccionar ejercicio</option>
                                            {catalogoEjercicios.map((ej) => (
                                                <option key={ej.id} value={ej.id}>{ej.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 md:col-span-5">
                                        <div>
                                            <label className="mb-1 block text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Series</label>
                                            <input type="number" value={fila.series}
                                                onChange={(e) => cambiarFila(index, 'series', e.target.value)}
                                                className="w-full text-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400" />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Reps</label>
                                            <input type="number" value={fila.repeticiones}
                                                onChange={(e) => cambiarFila(index, 'repeticiones', e.target.value)}
                                                className="w-full text-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end md:col-span-1 md:justify-center">
                                        <button type="button" onClick={() => removerFila(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition">
                                            <IconTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {data.ejercicios.length === 0 && (
                                <p className="text-xs text-gray-400 italic py-2 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    Dale clic a "+ Agregar ejercicio" para armar la rutina.
                                </p>
                            )}
                        </div>

                        <button disabled={processing || data.ejercicios.length === 0}
                            className="w-full md:w-auto rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-50 transition">
                            {processing ? 'Guardando...' : 'Guardar Rutina'}
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
                    value={filtroEntrenador}
                    onChange={(e) => setFiltroEntrenador(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600"
                >
                    <option value="">Todos los entrenadores</option>
                    {entrenadores.map((ent) => (
                        <option key={ent.id} value={ent.id}>{ent.nombre}</option>
                    ))}
                </select>
                <select
                    value={filtroEjercicio}
                    onChange={(e) => setFiltroEjercicio(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600"
                >
                    <option value="">Todos los ejercicios</option>
                    {catalogoEjercicios.map((ej) => (
                        <option key={ej.id} value={ej.id}>{ej.nombre}</option>
                    ))}
                </select>
            </div>

            {/* VISTA MÓVIL */}
            <div className="space-y-4 md:hidden">
                <h3 className="text-base font-semibold text-gray-700 px-1 mb-2">Lista de Rutinas</h3>
                {rutinasFiltradas.length > 0 ? (
                    rutinasFiltradas.map((r) => (
                        <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base leading-tight">{r.nombre}</h4>
                                    <p className="text-xs text-gray-400 mt-1">Entrenador: <span className="font-medium text-gray-600">{r.entrenador_nombre}</span></p>
                                </div>
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 bg-blue-50 text-blue-700 border border-blue-100">
                                    {r.ejercicios?.length ?? 0} ejercicios
                                </span>
                            </div>

                            {r.ejercicios && r.ejercicios.length > 0 && (
                                <div className="rounded-xl bg-gray-50 p-3 space-y-1.5 text-xs text-gray-700 border-t border-gray-100 pt-3">
                                    {r.ejercicios.map((ej) => (
                                        <div key={ej.id} className="flex justify-between border-b border-gray-200/60 pb-1 last:border-0 last:pb-0">
                                            <span className="font-medium text-gray-800">{ej.nombre}</span>
                                            <span className="font-bold text-gray-600">{ej.pivot.series}x{ej.pivot.repeticiones}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                <button onClick={() => openEdit(r)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-600 transition active:bg-blue-50 active:text-blue-500">
                                    <IconEdit />
                                </button>
                                <button onClick={() => setDeleteTarget(r)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 transition active:bg-red-50 active:text-red-500">
                                    <IconTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                        No se encontraron rutinas.
                    </div>
                )}
            </div>

            {/* VISTA DESKTOP */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Lista de Rutinas</div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5 w-1/4">Nombre</th>
                            <th className="w-1/5">Entrenador</th>
                            <th>Ejercicios</th>
                            <th className="pr-5 text-center w-28">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rutinasFiltradas.length > 0 ? (
                            rutinasFiltradas.map((r) => (
                                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50/60 align-top">
                                    <td className="p-5 font-medium text-gray-900">{r.nombre}</td>
                                    <td className="pt-5 text-gray-600">{r.entrenador_nombre}</td>
                                    <td className="pt-4 pb-4 pr-4">
                                        {r.ejercicios && r.ejercicios.length > 0 ? (
                                            <div className="flex flex-wrap gap-1.5">
                                                {r.ejercicios.map((ej) => (
                                                    <span key={ej.id}
                                                        className="inline-block rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-700 border border-gray-200">
                                                        <strong className="text-gray-900">{ej.nombre}</strong>: {ej.pivot.series}x{ej.pivot.repeticiones}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Sin ejercicios</span>
                                        )}
                                    </td>
                                    <td className="pr-5 pt-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(r)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
                                                title="Editar">
                                                <IconEdit />
                                            </button>
                                            <button onClick={() => setDeleteTarget(r)}
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
                                <td colSpan={4} className="p-8 text-center text-gray-400">
                                    No se encontraron rutinas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDITAR */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar rutina — {editTarget?.nombre}</h3>
                <form onSubmit={submitEdit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-gray-500">Nombre</label>
                            <input type="text" value={editForm.data.nombre}
                                onChange={(e) => editForm.setData('nombre', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-400" required />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Entrenador</label>
                            <select value={editForm.data.entrenador_id}
                                onChange={(e) => editForm.setData('entrenador_id', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 text-gray-700" required>
                                {entrenadores.map((ent) => (
                                    <option key={ent.id} value={ent.id}>{ent.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Ejercicios</span>
                            <button type="button" onClick={agregarFilaEdit}
                                className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg transition">
                                + Añadir
                            </button>
                        </div>

                        <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
                            {editForm.data.ejercicios.map((fila, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100 items-center">
                                    <div className="col-span-6">
                                        <select value={fila.ejercicio_id}
                                            onChange={(e) => cambiarFilaEdit(index, 'ejercicio_id', e.target.value)}
                                            className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-orange-400">
                                            <option value="">Ejercicio</option>
                                            {catalogoEjercicios.map((ej) => (
                                                <option key={ej.id} value={ej.id}>{ej.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <input type="number" value={fila.series}
                                            onChange={(e) => cambiarFilaEdit(index, 'series', e.target.value)}
                                            className="w-full text-center rounded-lg border border-gray-200 bg-white px-1 py-1.5 text-xs outline-none focus:border-orange-400"
                                            placeholder="S" title="Series" />
                                    </div>
                                    <div className="col-span-3">
                                        <input type="number" value={fila.repeticiones}
                                            onChange={(e) => cambiarFilaEdit(index, 'repeticiones', e.target.value)}
                                            className="w-full text-center rounded-lg border border-gray-200 bg-white px-1 py-1.5 text-xs outline-none focus:border-orange-400"
                                            placeholder="Reps" title="Repeticiones" />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <button type="button" onClick={() => removerFilaEdit(index)}
                                            className="text-gray-400 hover:text-red-500 transition">
                                            <IconTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
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
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar rutina</h3>
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