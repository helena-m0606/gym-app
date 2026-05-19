import PerfilLayout from '@/layouts/perfil-layout';

const menuItems = [
    { label: 'Dashboard', href: '/gerente/dashboard', icon: '📊' },
    { label: 'Miembros', href: '/gerente/miembros', icon: '👥' },
    { label: 'Empleados', href: '/gerente/empleados', icon: '🏢' },
    { label: 'Clases', href: '/gerente/clases', icon: '🏋️' },
    { label: 'Pagos', href: '/gerente/pagos', icon: '💰' },
    { label: 'Reportes', href: '/gerente/reportes', icon: '📈' },
];

type Clase = {
    nombre: string;
    fecha: string;
    capacidad: number;
};

type Pago = {
    nombre: string;
    monto: number;
    estado: string;
    fecha_pago: string;
};

type Sucursal = {
    nombre: string;
};

type Props = {
    sucursal: Sucursal | null;
    miembrosActivos: number;
    checkinsHoy: number;
    membresiasPorVencer: number;
    empleados: number;
    clasesHoy: Clase[];
    pagosRecientes: Pago[];
};

export default function GerenteDashboard({
    sucursal,
    miembrosActivos,
    checkinsHoy,
    membresiasPorVencer,
    empleados,
    clasesHoy,
    pagosRecientes,
}: Props) {
    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel="🏢 Gerente"
            rolColor="border-purple-200 bg-purple-50 text-purple-600"
            title={`Dashboard — ${sucursal?.nombre ?? 'Mi Sucursal'}`}
            subtitle="Panel de gestión de tu sucursal."
        >
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Miembros Activos</p>
                    <h3 className="mt-3 text-4xl font-bold text-orange-500">{miembrosActivos}</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Check-ins Hoy</p>
                    <h3 className="mt-3 text-4xl font-bold text-green-500">{checkinsHoy}</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Membresías por Vencer</p>
                    <h3 className="mt-3 text-4xl font-bold text-yellow-500">{membresiasPorVencer}</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Empleados Activos</p>
                    <h3 className="mt-3 text-4xl font-bold text-blue-500">{empleados}</h3>
                </div>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">Clases de Hoy</div>
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500">
                            <tr>
                                <th className="p-5">Clase</th>
                                <th>Hora</th>
                                <th>Capacidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clasesHoy.length > 0 ? clasesHoy.map((clase, i) => (
                                <tr key={i} className="border-t border-gray-100">
                                    <td className="p-5 font-medium">{clase.nombre}</td>
                                    <td>{new Date(clase.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{clase.capacidad}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td className="p-5 text-gray-400" colSpan={3}>No hay clases hoy</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">Pagos Recientes</div>
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500">
                            <tr>
                                <th className="p-5">Miembro</th>
                                <th>Monto</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagosRecientes.map((pago, i) => (
                                <tr key={i} className="border-t border-gray-100">
                                    <td className="p-5 font-medium">{pago.nombre}</td>
                                    <td>${pago.monto}</td>
                                    <td className={pago.estado === 'pagado' ? 'text-green-500' : 'text-yellow-500'}>
                                        {pago.estado}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </PerfilLayout>
    );
}