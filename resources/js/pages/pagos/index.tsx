import { useState, useEffect } from 'react';
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

type Pago = {
    id: number;
    miembro: string;
    tipo_membresia: string;
    monto: number;
    fecha_pago: string;
    metodo_pago: string;
    estado: string;
};

type TipoMembresia = {
    id: number;
    nombre: string;
    precio: number;
};

type Miembro = {
    id: number;
    nombre: string;
};

type Promocion = {
    id: number;
    nombre: string;
    descuento_porcentaje: number;
};

type Props = {
    pagos: Pago[];
    tiposMembresia: TipoMembresia[];
    miembros: Miembro[];
    promociones: Promocion[];
};

export default function PagosIndex({ pagos, tiposMembresia, miembros, promociones }: Props) {
    const [editando, setEditando] = useState<Pago | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Pago | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [filtroMetodo, setFiltroMetodo] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    const { data, setData, post, processing, reset, errors } = useForm({
        miembro_id: '',
        tipo_membresia_id: '',
        promocion_id: '',
        monto: '',
        fecha_pago: new Date().toISOString().split('T')[0],
        metodo_pago: 'efectivo',
    });

    const editForm = useForm({
        monto: '',
        fecha_pago: '',
        metodo_pago: '',
        estado: '',
    });

    // Recalculo de precio seguro controlando casos nulos o indefinidos
    useEffect(() => {
        if (!data.tipo_membresia_id) {
            setData('monto', '');
            return;
        }

        const tipoSeleccionado = tiposMembresia?.find(t => String(t.id) === data.tipo_membresia_id);
        if (!tipoSeleccionado) {
            setData('monto', '');
            return;
        }

        let precioBase = Number(tipoSeleccionado.precio) || 0;
        const promoSeleccionada = promociones?.find(p => String(p.id) === data.promocion_id);
        
        if (promoSeleccionada) {
            const porcentaje = Number(promoSeleccionada.descuento_porcentaje) || 0;
            precioBase = precioBase * (1 - porcentaje / 100);
        }

        setData('monto', String(precioBase.toFixed(2)));
    }, [data.tipo_membresia_id, data.promocion_id]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/pagos', { onSuccess: () => reset() });
    }

    function abrirEditar(p: Pago) {
        setEditando(p);
        editForm.setData({
            monto: String(p.monto),
            fecha_pago: p.fecha_pago.split('T')[0],
            metodo_pago: p.metodo_pago,
            estado: p.estado,
        });
    }

    function guardarEdicion(e: React.FormEvent) {
        e.preventDefault();
        editForm.put(`/pagos/${editando?.id}`, {
            onSuccess: () => setEditando(null),
        });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleteTarget(null);
        setDeleting(true);
        router.delete(`/pagos/${deleteTarget.id}`, {
            onSuccess: () => setDeleting(false),
            onError: () => setDeleting(false),
        });
    }

    const pagosFiltrados = pagos ? pagos.filter((p) => {
        return (
            p.miembro.toLowerCase().includes(busqueda.toLowerCase()) &&
            (filtroMetodo === '' || p.metodo_pago === filtroMetodo) &&
            (filtroEstado === '' || p.estado === filtroEstado)
        );
    }) : [];

    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Pagos"
            subtitle="Registro y control de pagos de membresías."
        >
            {/* FORMULARIO NUEVA VENTA DIRECTA CON DESCUENTOS */}
            <form onSubmit={submit} className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-semibold">Registrar nuevo pago</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                    
                    {/* Campo 1: Miembro */}
                    <div>
                        <select
                            value={data.miembro_id}
                            onChange={(e) => setData('miembro_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            <option value="">Seleccionar miembro</option>
                            {miembros?.map((m) => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                        {errors.miembro_id && <p className="mt-1 text-xs text-red-500">{errors.miembro_id}</p>}
                    </div>

                    {/* Campo 2: Tipo de Membresía */}
                    <div>
                        <select
                            value={data.tipo_membresia_id}
                            onChange={(e) => setData('tipo_membresia_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            <option value="">Tipo de membresía</option>
                            {tiposMembresia?.map((t) => (
                                <option key={t.id} value={t.id}>{t.nombre}</option>
                            ))}
                        </select>
                        {errors.tipo_membresia_id && <p className="mt-1 text-xs text-red-500">{errors.tipo_membresia_id}</p>}
                    </div>

                    {/* Campo 3: Aplicar Promoción */}
                    <div>
                        <select
                            value={data.promocion_id}
                            onChange={(e) => setData('promocion_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            <option value="">Sin promoción (Precio base)</option>
                            {promociones?.map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre} (-{Math.round(p.descuento_porcentaje)}%)</option>
                            ))}
                        </select>
                    </div>

                    {/* Campo 4: Precio Final (ReadOnly sin el símbolo estático adentro) */}
                    <div>
                        <input
                            type="text"
                            placeholder="Monto final"
                            value={data.monto ? `$${data.monto}` : ''}
                            readOnly
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 text-sm font-semibold text-gray-700 outline-none select-none"
                        />
                    </div>

                    {/* Campo 5: Método de Pago */}
                    <div>
                        <select
                            value={data.metodo_pago}
                            onChange={(e) => setData('metodo_pago', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                    </div>
                </div>
                <button
                    disabled={processing}
                    className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                >
                    {processing ? 'Guardando...' : 'Guardar Pago'}
                </button>
            </form>

            {/* FILTROS AMPLIADOS */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    placeholder="Buscar por miembro..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 sm:max-w-xs"
                />
                <select
                    value={filtroMetodo}
                    onChange={(e) => setFiltroMetodo(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400"
                >
                    <option value="">Todos los métodos</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                </select>
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400"
                >
                    <option value="">Todos los estados</option>
                    <option value="pagado">Pagado</option>
                    <option value="pendiente">Pendiente</option>
                </select>
            </div>

            {/* TABLA DE HISTORIAL */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Lista de Pagos</div>
                <table className="min-w-[900px] w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Miembro</th>
                            <th>Membresía</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                            <th>Método</th>
                            <th>Estado</th>
                            <th className="pr-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagosFiltrados.map((p) => (
                            <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                <td className="p-5 font-medium">{p.miembro}</td>
                                <td>{p.tipo_membresia}</td>
                                <td>${Number(p.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                <td>{new Date(p.fecha_pago).toLocaleDateString('es-MX')}</td>
                                <td className="capitalize">{p.metodo_pago}</td>
                                <td>
                                    <span className={
                                        p.estado === 'pagado'
                                            ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600'
                                            : 'rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-600'
                                    }>
                                        {p.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                                    </span>
                                </td>
                                <td className="pr-5">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => abrirEditar(p)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
                                            title="Editar">
                                            <IconEdit />
                                        </button>
                                        <button onClick={() => setDeleteTarget(p)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                            title="Eliminar">
                                            <IconTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL EDITAR */}
            <Modal open={!!editando} onClose={() => setEditando(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar pago — {editando?.miembro}</h3>
                <form onSubmit={guardarEdicion} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Monto</label>
                        <input type="number" value={editForm.data.monto}
                            onChange={(e) => editForm.setData('monto', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Fecha de pago</label>
                        <input type="date" value={editForm.data.fecha_pago}
                            onChange={(e) => editForm.setData('fecha_pago', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Método de pago</label>
                        <select value={editForm.data.metodo_pago}
                            onChange={(e) => editForm.setData('metodo_pago', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400">
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Estado</label>
                        <select value={editForm.data.estado}
                            onChange={(e) => editForm.setData('estado', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400">
                            <option value="pagado">Pagado</option>
                            <option value="pendiente">Pendiente</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setEditando(null)}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                            Cancel
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
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <IconTrash />
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-800">Eliminar pago</h3>
                <p className="mb-6 text-sm text-gray-500">
                    ¿Estás seguro de eliminar el pago de{' '}
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
        </PerfilLayout>
    );
}