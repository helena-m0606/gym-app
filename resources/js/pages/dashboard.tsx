import { Link } from '@inertiajs/react';
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

type Clase = {
    nombre: string;
    fecha: string;
    capacidad: number;
};

type Pago = {
    nombre: string;
    monto: number;
    estado: string;
};

type Props = {
    miembrosActivos: number;
    checkinsHoy: number;
    pagosPendientes: number;
    clasesHoy: Clase[];
    pagosRecientes: Pago[];
};

export default function Dashboard({
    miembrosActivos,
    checkinsHoy,
    pagosPendientes,
    clasesHoy,
    pagosRecientes,
}: Props) {
    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Dashboard General"
            subtitle="Sistema de administración del gimnasio."
        >
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                    href="/miembros"
                    className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600"
                >
                    + Nuevo Miembro
                </Link>
            </div>

            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Miembros Activos</p>
                    <h3 className="mt-3 text-4xl font-bold text-orange-500">{miembrosActivos}</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Check-ins Hoy</p>
                    <h3 className="mt-3 text-4xl font-bold text-green-500">{checkinsHoy}</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Membresías Vencidas</p>
                    <h3 className="mt-3 text-4xl font-bold text-yellow-500">{pagosPendientes}</h3>
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