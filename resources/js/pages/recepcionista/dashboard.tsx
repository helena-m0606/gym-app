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
    activa: boolean;
};

type Props = {
    checkinsHoy: number;
    membresiasPorVencer: number;
    nuevosEsteMes: number;
    ultimosCheckins: Checkin[];
    membresiasVencer: Membresia[];
};

export default function RecepcionistaDashboard({
    checkinsHoy,
    membresiasPorVencer,
    nuevosEsteMes,
    ultimosCheckins,
    membresiasVencer,
}: Props) {
    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel="🗂️ Recepcionista — Acceso Operativo"
            rolColor="border-green-200 bg-green-50 text-green-600"
            title="Dashboard"
            subtitle="Panel de operaciones diarias."
        >
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Check-ins Hoy</p>
                    <h3 className="mt-3 text-4xl font-bold text-green-500">{checkinsHoy}</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Membresías por Vencer</p>
                    <h3 className="mt-3 text-4xl font-bold text-yellow-500">{membresiasPorVencer}</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Nuevos este Mes</p>
                    <h3 className="mt-3 text-4xl font-bold text-orange-500">{nuevosEsteMes}</h3>
                </div>
            </section>

            <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">Últimos Check-ins</div>
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500">
                            <tr>
                                <th className="p-5">Miembro</th>
                                <th>Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ultimosCheckins.map((checkin, i) => (
                                <tr key={i} className="border-t border-gray-100">
                                    <td className="p-5 font-medium">{checkin.nombre}</td>
                                    <td>{new Date(checkin.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">Membresías por Vencer</div>
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500">
                            <tr>
                                <th className="p-5">Miembro</th>
                                <th>Vence</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membresiasVencer.map((m, i) => {
                                const vence = new Date(m.fecha_fin);
                                const diff = Math.ceil((vence.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                const estado = diff < 0 ? 'Vencida' : diff <= 7 ? 'Por vencer' : 'Activa';
                                const color = diff < 0 ? 'text-red-500' : diff <= 7 ? 'text-yellow-500' : 'text-green-500';
                                return (
                                    <tr key={i} className="border-t border-gray-100">
                                        <td className="p-5 font-medium">{m.nombre}</td>
                                        <td>{vence.toLocaleDateString('es-MX')}</td>
                                        <td className={color}>{estado}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </PerfilLayout>
    );
}