import { useState, useEffect } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import PerfilLayout from '@/layouts/perfil-layout';

type Clase = {
    id: number;
    nombre: string;
    entrenador_nombre: string;
    sucursal_nombre: string;
    entrenador_id: number;
    sucursal_id: number;
    horario: string;
    cupo_maximo: number;
};

type Entrenador = {
    id: number;
    nombre: string;
    sucursal_id: number;
};

type Sucursal = {
    id: number;
    nombre: string;
};

type Props = {
    clases: Clase[];
    entrenadores: Entrenador[];
    sucursales: Sucursal[];
};

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

const DIAS_SEMANA = [
    { clave: 'Lunes', nombre: 'Lun' },
    { clave: 'Martes', nombre: 'Mar' },
    { clave: 'Miércoles', nombre: 'Mié' },
    { clave: 'Jueves', nombre: 'Jue' },
    { clave: 'Viernes', nombre: 'Vie' },
    { clave: 'Sábado', nombre: 'Sáb' },
    { clave: 'Domingo', nombre: 'Dom' },
];

function IconEdit() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
        </svg>
    );
}

function IconClock() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
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

export default function ClasesIndex({ clases = [], entrenadores = [], sucursales = [] }: Props) {
    const { auth } = usePage().props as any;

    const tieneSedeFija = auth?.user?.rol === 'entrenador' || auth?.user?.rol === 'gerente';
    const esEntrenador = auth?.user?.rol === 'entrenador';
    const esGerente = auth?.user?.rol === 'gerente';

    const [showForm, setShowForm] = useState(false);
    const [editando, setEditando] = useState<Clase | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Clase | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Filtros
    const [busqueda, setBusqueda] = useState('');
    const [filtroEntrenador, setFiltroEntrenador] = useState('');
    const [filtroSucursal, setFiltroSucursal] = useState('');
    const [filtrosDias, setFiltrosDias] = useState<string[]>([]);
    const [filtroHora, setFiltroHora] = useState('');

    const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
    const [horaSeleccionada, setHoraSeleccionada] = useState('10:00');
    const [diasEditar, setDiasEditar] = useState<string[]>([]);
    const [horaEditar, setHoraEditar] = useState('10:00');
    const [entrenadoresFiltrados, setEntrenadoresFiltrados] = useState<Entrenador[]>([]);

    const createForm = useForm({
        nombre: '',
        entrenador_id: esEntrenador ? (auth?.user?.id_empleado || auth?.user?.id || '') : '',
        sucursal_id: (esEntrenador || esGerente) ? (auth?.user?.sucursal_id || sucursales[0]?.id || '') : '',
        horario: '',
        cupo_maximo: '',
    });

    useEffect(() => {
        if (createForm.data.sucursal_id) {
            const filtrados = entrenadores.filter(
                e => String(e.sucursal_id) === String(createForm.data.sucursal_id)
            );
            setEntrenadoresFiltrados(filtrados);
            if (!esEntrenador && !filtrados.some(e => String(e.id) === String(createForm.data.entrenador_id))) {
                createForm.setData('entrenador_id', '');
            }
        } else {
            setEntrenadoresFiltrados([]);
        }
    }, [createForm.data.sucursal_id, entrenadores]);

    useEffect(() => {
        if (diasSeleccionados.length > 0) {
            createForm.setData('horario', `${diasSeleccionados.join(', ')} — ${horaSeleccionada}`);
        } else {
            createForm.setData('horario', '');
        }
    }, [diasSeleccionados, horaSeleccionada]);

    function toggleDia(clave: string) {
        setDiasSeleccionados(prev =>
            prev.includes(clave) ? prev.filter(d => d !== clave) : [...prev, clave]
        );
    }

    function toggleDiaEditar(clave: string) {
        setDiasEditar(prev =>
            prev.includes(clave) ? prev.filter(d => d !== clave) : [...prev, clave]
        );
    }

    function toggleFiltroDia(clave: string) {
        setFiltrosDias(prev =>
            prev.includes(clave) ? prev.filter(d => d !== clave) : [...prev, clave]
        );
    }

    function handleCreateSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (diasSeleccionados.length === 0) {
            alert('Por favor, selecciona al menos un día para la clase.');
            return;
        }
        createForm.post('/clases', {
            onSuccess: () => {
                createForm.reset('nombre', 'cupo_maximo');
                setDiasSeleccionados([]);
                setHoraSeleccionada('10:00');
                setShowForm(false);
            },
        });
    }

    const editForm = useForm({
        nombre: '',
        entrenador_id: '',
        sucursal_id: '',
        horario: '',
        cupo_maximo: 0,
    });

    useEffect(() => {
        if (editando) {
            editForm.setData('horario', `${diasEditar.join(', ')} — ${horaEditar}`);
        }
    }, [diasEditar, horaEditar]);

    function abrirEditar(c: Clase) {
        editForm.clearErrors();
        setEditando(c);
        let diasExistentes: string[] = [];
        let horaExistente = '10:00';
        if (c.horario && c.horario.includes('—')) {
            const partes = c.horario.split('—');
            diasExistentes = partes[0].split(',').map(d => d.trim());
            horaExistente = partes[1].trim();
        } else if (c.horario) {
            diasExistentes = [c.horario];
        }
        setDiasEditar(diasExistentes);
        setHoraEditar(horaExistente);
        editForm.setData({
            nombre: c.nombre,
            entrenador_id: String(c.entrenador_id),
            sucursal_id: String(c.sucursal_id),
            horario: c.horario,
            cupo_maximo: c.cupo_maximo,
        });
    }

    function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (diasEditar.length === 0) {
            alert('La clase debe tener al menos un día asignado.');
            return;
        }
        if (!editando) return;
        editForm.put(`/clases/${editando.id}`, {
            onSuccess: () => setEditando(null),
        });
    }

    function obtenerPartesHorario(stringHorario: string) {
        if (stringHorario && stringHorario.includes('—')) {
            const partes = stringHorario.split('—');
            return { dias: partes[0].trim(), hora: partes[1].trim() };
        }
        return { dias: stringHorario || 'Sin asignar', hora: '' };
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/clases/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); setDeleting(false); },
            onError: () => setDeleting(false),
        });
    }

    // Horas únicas para el filtro
    const horasUnicas = [...new Set(clases.map(c => obtenerPartesHorario(c.horario).hora).filter(Boolean))].sort();

    // Lógica de filtrado
    const clasesFiltradas = clases.filter((c) => {
        const { dias, hora } = obtenerPartesHorario(c.horario);
        const coincideNombre = c.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideEntrenador = filtroEntrenador === '' || String(c.entrenador_id) === filtroEntrenador;
        const coincideSucursal = filtroSucursal === '' || String(c.sucursal_id) === filtroSucursal;
        const coincideDias = filtrosDias.length === 0 || filtrosDias.every(d => dias.includes(d));
        const coincideHora = filtroHora === '' || hora === filtroHora;
        return coincideNombre && coincideEntrenador && coincideSucursal && coincideDias && coincideHora;
    });

    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel={esEntrenador ? "🏋️ Entrenador Local" : esGerente ? "🏢 Gerente de Sede" : "🏆 Administrador General"}
            rolColor={esEntrenador ? "border-emerald-200 bg-emerald-50 text-emerald-600" : esGerente ? "border-purple-200 bg-purple-50 text-purple-600" : "border-blue-200 bg-blue-50 text-blue-600"}
            title="Clases"
            subtitle="Programación de horarios y disciplinas del gimnasio."
        >
            {/* FORMULARIO */}
            <div className="mb-8">
                {!showForm ? (
                    <button onClick={() => setShowForm(true)}
                        className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 transition">
                        + Programar clase
                    </button>
                ) : (
                    <form onSubmit={handleCreateSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Registrar nueva clase</h3>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="text-sm font-medium text-gray-400 hover:text-gray-600 transition">Cancelar</button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-500">Nombre de la disciplina</label>
                                <input type="text" placeholder="ej. CrossFit, Spinning..."
                                    value={createForm.data.nombre}
                                    onChange={e => createForm.setData('nombre', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" required />
                            </div>

                            {!esEntrenador && (
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-gray-500">Seleccionar Sucursal</label>
                                    <select value={createForm.data.sucursal_id}
                                        onChange={e => createForm.setData('sucursal_id', e.target.value)}
                                        disabled={esGerente}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 text-gray-700 disabled:bg-gray-50 disabled:text-gray-400" required>
                                        <option value="">Seleccionar Sede</option>
                                        {sucursales.map(s => (
                                            <option key={s.id} value={s.id}>{s.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {!esEntrenador && (
                                <div>
                                    <label className="mb-1 block text-xs font-semibold text-gray-500">Instructor del Plantel</label>
                                    <select value={createForm.data.entrenador_id}
                                        onChange={e => createForm.setData('entrenador_id', e.target.value)}
                                        disabled={!createForm.data.sucursal_id}
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 text-gray-700 disabled:bg-gray-50 disabled:text-gray-400" required>
                                        <option value="">Seleccionar Instructor</option>
                                        {entrenadoresFiltrados.map(e => (
                                            <option key={e.id} value={e.id}>{e.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="mb-1 block text-xs font-semibold text-gray-500">Cupo Máximo</label>
                                <input type="number" placeholder="ej. 25"
                                    value={createForm.data.cupo_maximo}
                                    onChange={e => createForm.setData('cupo_maximo', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
                            <div className="md:col-span-2">
                                <span className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Días de clase</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {DIAS_SEMANA.map((dia) => {
                                        const activo = diasSeleccionados.includes(dia.clave);
                                        return (
                                            <button key={dia.clave} type="button" onClick={() => toggleDia(dia.clave)}
                                                className={`rounded-xl px-3 py-2 text-xs font-bold transition border ${
                                                    activo
                                                        ? 'bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-200'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                                                }`}>
                                                {dia.nombre}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <span className="mb-2 block text-xs font-bold text-gray-500 uppercase tracking-wider">Hora de inicio</span>
                                <input type="time" value={horaSeleccionada}
                                    onChange={e => setHoraSeleccionada(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-orange-400" required />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-2">
                            <div className="text-xs text-gray-400">
                                {createForm.data.horario ? (
                                    <span>Horario a registrar: <strong className="text-orange-600 font-bold">{createForm.data.horario}</strong></span>
                                ) : '*Selecciona los días y horas arriba.'}
                            </div>
                            <button disabled={createForm.processing}
                                className="w-full md:w-auto rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60 transition shrink-0">
                                {createForm.processing ? 'Guardando...' : 'Programar Clase'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* FILTROS */}
            <div className="mb-4 space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 sm:max-w-xs"
                    />
                    <select value={filtroEntrenador} onChange={(e) => setFiltroEntrenador(e.target.value)}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600">
                        <option value="">Todos los entrenadores</option>
                        {entrenadores.map((ent) => (
                            <option key={ent.id} value={ent.id}>{ent.nombre}</option>
                        ))}
                    </select>
                    <select value={filtroSucursal} onChange={(e) => setFiltroSucursal(e.target.value)}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600">
                        <option value="">Todas las sedes</option>
                        {sucursales.map((s) => (
                            <option key={s.id} value={s.id}>{s.nombre}</option>
                        ))}
                    </select>
                    <select value={filtroHora} onChange={(e) => setFiltroHora(e.target.value)}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600">
                        <option value="">Todos los horarios</option>
                        {horasUnicas.map((hora) => (
                            <option key={hora} value={hora}>{hora}</option>
                        ))}
                    </select>
                </div>

                {/* Filtro por días */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-gray-400">Días:</span>
                    {DIAS_SEMANA.map((dia) => {
                        const activo = filtrosDias.includes(dia.clave);
                        return (
                            <button key={dia.clave} type="button" onClick={() => toggleFiltroDia(dia.clave)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition border ${
                                    activo
                                        ? 'bg-orange-500 border-orange-500 text-white'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300'
                                }`}>
                                {dia.nombre}
                            </button>
                        );
                    })}
                    {filtrosDias.length > 0 && (
                        <button onClick={() => setFiltrosDias([])}
                            className="text-xs text-gray-400 hover:text-gray-600 underline">
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* VISTA MÓVIL */}
            <div className="space-y-4 md:hidden">
                <h3 className="text-base font-semibold text-gray-700 px-1 mb-2">Lista de Clases</h3>
                {clasesFiltradas.length > 0 ? (
                    clasesFiltradas.map((c) => {
                        const tiempo = obtenerPartesHorario(c.horario);
                        return (
                            <div key={c.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base leading-tight">{c.nombre}</h4>
                                        <p className="text-xs text-gray-400 mt-1">Instructor: <span className="font-medium text-gray-600">{c.entrenador_nombre}</span></p>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-orange-50 text-orange-700 border border-orange-100 px-2.5 py-0.5 text-xs font-bold shrink-0">
                                        {c.cupo_maximo} lugares
                                    </span>
                                </div>

                                <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-xs text-gray-600">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-gray-400 font-medium">Días:</span>
                                        <span className="font-bold text-gray-900">{tiempo.dias}</span>
                                    </div>
                                    {tiempo.hora && (
                                        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 font-bold text-gray-700">
                                            <IconClock /> {tiempo.hora}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                                    <span className="text-xs text-gray-400">Sede: <strong className="text-gray-600 font-medium">{c.sucursal_nombre}</strong></span>
                                    <div className="flex gap-2">
                                        <button onClick={() => abrirEditar(c)}
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-600 active:bg-blue-50 active:text-blue-500">
                                            <IconEdit />
                                        </button>
                                        <button onClick={() => setDeleteTarget(c)}
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 active:bg-red-50 active:text-red-500">
                                            <IconTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                        No se encontraron clases.
                    </div>
                )}
            </div>

            {/* VISTA DESKTOP */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Horarios de Clases</div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Disciplina / Instructor</th>
                            <th>Sucursal</th>
                            <th>Días de clase</th>
                            <th>Horario</th>
                            <th>Cupo</th>
                            <th className="pr-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clasesFiltradas.length > 0 ? (
                            clasesFiltradas.map((c) => {
                                const tiempo = obtenerPartesHorario(c.horario);
                                return (
                                    <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                        <td className="p-5">
                                            <div className="font-medium text-gray-900">{c.nombre}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{c.entrenador_nombre}</div>
                                        </td>
                                        <td className="text-gray-600">{c.sucursal_nombre}</td>
                                        <td className="font-bold text-gray-900">{tiempo.dias}</td>
                                        <td className="text-gray-600 font-semibold">
                                            <div className="flex items-center gap-1.5">
                                                <IconClock /> {tiempo.hora || '—'}
                                            </div>
                                        </td>
                                        <td className="text-gray-600">{c.cupo_maximo} alumnos</td>
                                        <td className="pr-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => abrirEditar(c)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500" title="Editar">
                                                    <IconEdit />
                                                </button>
                                                <button onClick={() => setDeleteTarget(c)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500" title="Eliminar">
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">
                                    No se encontraron clases.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDITAR */}
            <Modal open={!!editando} onClose={() => setEditando(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Editar programación</h3>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Nombre de la Disciplina</label>
                        <input type="text" value={editForm.data.nombre}
                            onChange={e => editForm.setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" required />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Instructor</label>
                            <select value={editForm.data.entrenador_id}
                                onChange={e => editForm.setData('entrenador_id', e.target.value)}
                                disabled={esEntrenador}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white text-gray-700 disabled:bg-gray-50" required>
                                <option value="">Seleccionar</option>
                                {entrenadores.map(e => (
                                    <option key={e.id} value={e.id}>{e.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Sucursal</label>
                            <select value={editForm.data.sucursal_id}
                                onChange={e => editForm.setData('sucursal_id', e.target.value)}
                                disabled={tieneSedeFija}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white text-gray-700 disabled:bg-gray-50" required>
                                {sucursales.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Cupo Máximo</label>
                        <input type="number" value={editForm.data.cupo_maximo}
                            onChange={e => editForm.setData('cupo_maximo', parseInt(e.target.value) || 0)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" required />
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-3">
                        <div>
                            <span className="mb-1.5 block text-xs font-semibold text-gray-500">Modificar Días</span>
                            <div className="flex flex-wrap gap-1.5">
                                {DIAS_SEMANA.map((dia) => {
                                    const activo = diasEditar.includes(dia.clave);
                                    return (
                                        <button key={dia.clave} type="button" onClick={() => toggleDiaEditar(dia.clave)}
                                            className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition border ${
                                                activo
                                                    ? 'bg-orange-500 border-orange-500 text-white'
                                                    : 'bg-white border-gray-200 text-gray-600'
                                            }`}>
                                            {dia.clave}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-500">Hora de inicio</label>
                            <input type="time" value={horaEditar}
                                onChange={e => setHoraEditar(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 outline-none focus:border-orange-400" required />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setEditando(null)}
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
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <IconTrash />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Cancelar clase</h3>
                <p className="mb-6 text-sm text-gray-500">
                    ¿Estás seguro de que deseas eliminar la clase de{' '}
                    <span className="font-semibold text-gray-700">{deleteTarget?.nombre}</span>?
                </p>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setDeleteTarget(null)}
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button onClick={confirmDelete} disabled={deleting}
                        className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60">
                        Eliminar clase
                    </button>
                </div>
            </Modal>
        </PerfilLayout>
    );
}