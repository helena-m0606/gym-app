import PerfilLayout from '@/layouts/perfil-layout';

const menuItems = [
    { label: 'Dashboard', href: '/recepcionista/dashboard', icon: '📊' },
    { label: 'Check-in', href: '/recepcionista/checkins', icon: '✅' },
    { label: 'Miembros', href: '/recepcionista/miembros', icon: '👥' },
    { label: 'Clases', href: '/recepcionista/clases', icon: '🏋️' },
    { label: 'Pagos', href: '/recepcionista/pagos', icon: '💰' },
];

type Checkin = {
    nombre: string;
    fecha: string;
};

type Membresia = {
    nombre: string;
    fecha_fin: string;
};

type Sucursal = {
    nombre: string;
};

type Props = {
    sucursal: Sucursal | null;
    checkinsHoy: number;
    membresiasPorVencer: number;
    miembrosActivos: number;
    ultimosCheckins: Checkin[];
    membresiasVencer: Membresia[];
};

export default function RecepcionistaDashboard({
    sucursal,
    checkinsHoy,
    membresiasPorVencer,
    miembrosActivos,
    ultimosCheckins,
    membresiasVencer,
}: Props) {
    return (
        <PerfilLayout
            rolLabel="🗂️ Recepcionista — Acceso Operativo"
            rolColor="border-green-200 bg-green-50 text-green-600"
            title={`Dashboard — ${sucursal?.nombre ?? 'Mi Sucursal'}`}
            subtitle="Panel de operaciones diarias."
        >
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Check-ins Hoy</p>
                    <h3 className="mt-3 text-4xl font-bold text-green-500">{checkinsHoy}</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Membresías por Vencer</p>
                    <h3 className={`mt-3 text-4xl font-bold ${membresiasPorVencer > 0 ? 'text-yellow-500' : 'text-gray-400'}`}>
                        {membresiasPorVencer}
                    </h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Miembros Activos</p>
                    <h3 className="mt-3 text-4xl font-bold text-orange-500">{miembrosActivos}</h3>
                </div>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">Últimos Check-ins del Día</div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-5">Miembro</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ultimosCheckins.length > 0 ? ultimosCheckins.map((c, i) => (
                                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="p-5 font-medium">{c.nombre}</td>
                                    <td className="text-gray-600">
                                        {new Date(c.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={2} className="p-5 text-center text-gray-400">No hay check-ins hoy</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">Membresías por Vencer</div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-5">Miembro</th>
                                <th>Vence</th>
                                <th>Días</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membresiasVencer.length > 0 ? membresiasVencer.map((m, i) => {
                                const vence = new Date(m.fecha_fin);
                                const diff = Math.ceil((vence.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                return (
                                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/60">
                                        <td className="p-5 font-medium">{m.nombre}</td>
                                        <td className="text-gray-600">{vence.toLocaleDateString('es-MX')}</td>
                                        <td>
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                diff <= 0
                                                    ? 'bg-red-100 text-red-600'
                                                    : diff <= 3
                                                    ? 'bg-orange-100 text-orange-600'
                                                    : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                                {diff <= 0 ? 'Vencida' : `${diff} días`}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={3} className="p-5 text-center text-gray-400">Sin membresías por vencer</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </PerfilLayout>
    );
}