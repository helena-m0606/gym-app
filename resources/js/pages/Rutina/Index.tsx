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
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
        </svg>
    ); 
}

function IconTrash() { 
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">{children}</div>
        </div>
    );
}

export default function Index({ rutinas, catalogoEjercicios, entrenadores }: { rutinas: Rutina[]; catalogoEjercicios: ItemCatalogo[]; entrenadores: ItemCatalogo[] }) {
    
    // ── Formulario Crear Rutina ──
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        entrenador_id: '',
        ejercicios: [] as EjercicioForm[]
    });

    function agregarFilaEjercicio() {
        setData('ejercicios', [
            ...data.ejercicios,
            { ejercicio_id: '', series: '4', repeticiones: '12' }
        ]);
    }

    function removerFilaEjercicio(index: number) {
        setData('ejercicios', data.ejercicios.filter((_, i) => i !== index));
    }

    function manejarCambioFila(index: number, campo: keyof EjercicioForm, valor: string) {
        const actualizados = data.ejercicios.map((fila, i) => i === index ? { ...fila, [campo]: valor } : fila);
        setData('ejercicios', actualizados);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/rutinas', { onSuccess: () => reset() });
    }

    // ── Editar Nombre ──
    const [editTarget, setEditTarget] = useState<Rutina | null>(null);
    const editForm = useForm({ nombre: '' });

    function openEdit(r: Rutina) {
        editForm.setData({ nombre: r.nombre });
        setEditTarget(r);
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/rutinas/${editTarget.id}`, { onSuccess: () => setEditTarget(null) });
    }

    // ── Eliminar ──
    const [deleteTarget, setDeleteTarget] = useState<Rutina | null>(null);
    const [deleting, setDeleting] = useState(false);

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/rutinas/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); setDeleting(false); }
        });
    }

    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Catálogo de Rutinas"
            subtitle="Configuración y gestión de las plantillas de entrenamiento del gimnasio."
        >
            {/* ── Formulario Estructurado ── */}
            <form onSubmit={submit} className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                <h3 className="text-lg font-semibold text-gray-800">Crear nueva plantilla de rutina</h3>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-medium text-gray-400">Nombre de la Rutina</label>
                        <input
                            type="text"
                            placeholder="Ej. Hipertrofia de Pierna o Plantilla de Definición"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />
                        {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-400">Seleccionar Entrenador (Autor)</label>
                        <select
                            value={data.entrenador_id}
                            onChange={(e) => setData('entrenador_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            <option value="">-- Elegir Entrenador --</option>
                            {entrenadores.map((ent) => (
                                <option key={ent.id} value={ent.id}>{ent.nombre}</option>
                            ))}
                        </select>
                        {errors.entrenador_id && <p className="mt-1 text-xs text-red-500">{errors.entrenador_id}</p>}
                    </div>
                </div>

                {/* Subsección Dinámica de Ejercicios */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Ejercicios incluidos en la plantilla</span>
                        <button
                            type="button"
                            onClick={agregarFilaEjercicio}
                            className="text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-50 px-3 py-2 rounded-lg transition"
                        >
                            + Agregar Ejercicio
                        </button>
                    </div>

                    {data.ejercicios.map((fila, index) => (
                        <div key={index} className="grid grid-cols-1 gap-2 rounded-xl bg-gray-50/50 p-3 border border-gray-100 md:grid-cols-12 md:items-end">
                            <div className="md:col-span-6">
                                <select
                                    value={fila.ejercicio_id}
                                    onChange={(e) => manejarCambioFila(index, 'ejercicio_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400"
                                >
                                    <option value="">-- Seleccionar Ejercicio --</option>
                                    {catalogoEjercicios.map((ej) => (
                                        <option key={ej.id} value={ej.id}>{ej.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 md:col-span-5">
                                <div>
                                    <label className="mb-1 block text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Series</label>
                                    <input type="number" value={fila.series} onChange={(e) => manejarCambioFila(index, 'series', e.target.value)} className="w-full text-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Reps / Seg</label>
                                    <input type="number" value={fila.repeticiones} onChange={(e) => manejarCambioFila(index, 'repeticiones', e.target.value)} className="w-full text-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400" />
                                </div>
                            </div>

                            <div className="flex justify-end pb-1 md:col-span-1 md:justify-center">
                                <button type="button" onClick={() => removerFilaEjercicio(index)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition"><IconTrash /></button>
                            </div>
                        </div>
                    ))}

                    {data.ejercicios.length === 0 && (
                        <p className="text-xs text-gray-400 italic py-2 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            Dale clic a "+ Agregar Ejercicio" para armar la plantilla.
                        </p>
                    )}
                </div>

                <button
                    disabled={processing || data.ejercicios.length === 0}
                    className="w-full md:w-auto rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-50 transition"
                >
                    {processing ? 'Guardando...' : 'Guardar Plantilla'}
                </button>
            </form>

            {/* ── Lista de las Rutinas Guardadas ── */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 p-5 font-semibold">Plantillas Registradas en el Sistema</div>

                {/* 🎯 VISTA MÓVIL: Tarjetas (Se muestra en la resolución de tu captura) */}
                <div className="block md:hidden divide-y divide-gray-100">
                    {rutinas.length === 0 ? (
                        <div className="p-5 text-center text-sm text-gray-400">No hay plantillas registradas.</div>
                    ) : (
                        rutinas.map((r) => (
                            <div key={r.id} className="p-5 space-y-3">
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-gray-800 text-base">{r.nombre}</span>
                                    <span className="text-xs text-gray-400">Autor: <strong className="text-gray-500">{r.entrenador_nombre}</strong></span>
                                </div>

                                {r.ejercicios && r.ejercicios.length > 0 && (
                                    <div className="mt-2 rounded-xl bg-gray-50 p-3 space-y-1.5 text-xs text-gray-700">
                                        {r.ejercicios.map((ej) => (
                                            <div key={ej.id} className="flex justify-between border-b border-gray-200/60 pb-1 last:border-0 last:pb-0">
                                                <span className="font-medium text-gray-800">{ej.nombre}</span>
                                                <span className="font-bold text-gray-600">{ej.pivot.series}x{ej.pivot.repeticiones}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 pt-2 border-t border-gray-50">
                                    <button onClick={() => openEdit(r)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"><IconEdit /></button>
                                    <button onClick={() => setDeleteTarget(r)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><IconTrash /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 🎯 VISTA DESKTOP: Tabla (Se muestra en pantallas completas de monitor) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-5 w-1/4">Nombre de la Plantilla</th>
                                <th className="w-1/4">Autor (Entrenador)</th>
                                <th>Ejercicios e Intensidad Integrados</th>
                                <th className="pr-5 text-center w-32">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {rutinas.length === 0 ? (
                                <tr><td colSpan={4} className="p-5 text-center text-gray-400">No hay plantillas.</td></tr>
                            ) : (
                                rutinas.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50/60 transition align-top">
                                        <td className="p-5 font-medium text-gray-800">{r.nombre}</td>
                                        <td className="pt-5 text-gray-600 font-medium">{r.entrenador_nombre}</td>
                                        <td className="pt-4 pb-4">
                                            {r.ejercicios && r.ejercicios.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5 max-w-2xl">
                                                    {r.ejercicios.map((ej) => (
                                                        <span key={ej.id} className="inline-block rounded-lg bg-gray-100 px-2.5 py-1 text-xs text-gray-700 border border-gray-200">
                                                            <strong className="text-gray-900">{ej.nombre}</strong>: {ej.pivot.series}x{ej.pivot.repeticiones}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Sin ejercicios registrados</span>
                                            )}
                                        </td>
                                        <td className="pr-5 pt-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => openEdit(r)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition"><IconEdit /></button>
                                                <button onClick={() => setDeleteTarget(r)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition"><IconTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals de Edición y Eliminación */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Modificar Nombre</h3>
                <form onSubmit={submitEdit} className="space-y-4">
                    <div>
                        <input type="text" value={editForm.data.nombre} onChange={(e) => editForm.setData('nombre', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setEditTarget(null)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
                        <button type="submit" disabled={editForm.processing} className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">Guardar</button>
                    </div>
                </form>
            </Modal>

            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400"><IconTrash /></div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar Plantilla</h3>
                <p className="mb-6 text-sm text-gray-500">¿Estás seguro de que deseas eliminar <span className="font-semibold text-gray-700">{deleteTarget?.nombre}</span>?</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
                    <button onClick={confirmDelete} disabled={deleting} className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600">Eliminar</button>
                </div>
            </Modal>
        </PerfilLayout>
    );
}