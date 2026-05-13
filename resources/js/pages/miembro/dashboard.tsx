import { Link } from '@inertiajs/react';

const menuItems = [
    { label: 'Mi Perfil', href: '/miembro/dashboard', icon: '🏠' },
    { label: 'Mi Rutina', href: '/miembro/rutina', icon: '💪' },
    { label: 'Clases', href: '/miembro/clases', icon: '🗓️' },
    { label: 'Mi Progreso', href: '/miembro/progreso', icon: '📈' },
    { label: 'Membresía', href: '/miembro/membresia', icon: '💳' },
    { label: 'Notificaciones', href: '/miembro/notificaciones', icon: '🔔' },
];

type Clase = {
    nombre: string;
    fecha: string;
    estado: string;
};

type Ejercicio = {
    nombre: string;
    series: number;
    repeticiones: number;
};

type Progreso = {
    fecha: string;
    metricas: string;
};

type Membresia = {
    tipo: string;
    fecha_fin: string;
    activa: boolean;
};

type Miembro = {
    nombre: string;
    email: string;
};

type Props = {
    miembro: Miembro;
    checkinsMes: number;
    membresia: Membresia | null;
    clasesReservadas: Clase[];
    rutina: Ejercicio[];
    progreso: Progreso[];
};

export default function MiembroDashboard({
    miembro,
    checkinsMes,
    membresia,
    clasesReservadas,
    rutina,
    progreso,
}: Props) {
    const currentPath = window.location.pathname;

    const diasRestantes = membresia
        ? Math.ceil((new Date(membresia.fecha_fin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const ultimoProgreso = progreso[0] ? JSON.parse(progreso[0].metricas) : null;
    const progresoAnterior = progreso[1] ? JSON.parse(progreso[1].metricas) : null;

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-gray-900">
            <div className="flex min-h-screen">
                <aside className="w-64 border-r border-gray-200 bg-white p-6 shadow-sm">
                    <h1 className="mb-10 text-2xl font-bold tracking-widest">
                        <span className="text-orange-500">GYM</span>APP
                    </h1>
                    <nav className="space-y-2 text-sm">
                        {menuItems.map((item) => {
                            const isActive = currentPath.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={
                                        isActive
                                            ? 'block rounded-xl bg-orange-100 px-4 py-3 font-medium text-orange-600'
                                            : 'block rounded-xl px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <main className="flex-1 p-10">
                    <div className="mb-8">
                        <span className="rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-600">
                            👤 Miembro
                        </span>
                        <h2 className="mt-6 text-3xl font-bold">¡Hola, {miembro.nombre.split(' ')[0]}! 👋</h2>
                        <p className="text-gray-500">{miembro.email}</p>
                    </div>

                    <section className="grid grid-cols-3 gap-5">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-gray-500">Check-ins este Mes</p>
                            <h3 className="mt-3 text-4xl font-bold text-orange-500">{checkinsMes}</h3>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-gray-500">Clases Reservadas</p>
                            <h3 className="mt-3 text-4xl font-bold text-blue-500">{clasesReservadas.length}</h3>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-gray-500">Días Restantes</p>
                            <h3 className={`mt-3 text-4xl font-bold ${diasRestantes < 7 ? 'text-red-500' : 'text-green-500'}`}>
                                {diasRestantes}
                            </h3>
                        </div>
                    </section>

                    <section className="mt-8 grid grid-cols-2 gap-5">
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-5 font-semibold">
                                Mi Rutina
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500">
                                    <tr>
                                        <th className="p-5">Ejercicio</th>
                                        <th>Series</th>
                                        <th>Reps</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rutina.map((e, i) => (
                                        <tr key={i} className="border-t border-gray-100">
                                            <td className="p-5 font-medium">{e.nombre}</td>
                                            <td>{e.series}</td>
                                            <td>{e.repeticiones}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-5 font-semibold">
                                Mis Próximas Clases
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500">
                                    <tr>
                                        <th className="p-5">Clase</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clasesReservadas.map((c, i) => (
                                        <tr key={i} className="border-t border-gray-100">
                                            <td className="p-5 font-medium">{c.nombre}</td>
                                            <td>{new Date(c.fecha).toLocaleDateString('es-MX')}</td>
                                            <td className={c.estado === 'confirmada' ? 'text-green-500' : 'text-red-500'}>
                                                {c.estado}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {ultimoProgreso && (
                        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 font-semibold">Mi Progreso</div>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Peso</p>
                                    <p className="mt-1 text-3xl font-bold text-orange-500">{ultimoProgreso.peso} <span className="text-base">kg</span></p>
                                    {progresoAnterior && (
                                        <p className={`text-xs mt-1 ${ultimoProgreso.peso < progresoAnterior.peso ? 'text-green-500' : 'text-red-500'}`}>
                                            {ultimoProgreso.peso < progresoAnterior.peso ? '↓' : '↑'} {Math.abs(ultimoProgreso.peso - progresoAnterior.peso)} kg
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Grasa</p>
                                    <p className="mt-1 text-3xl font-bold text-blue-500">{ultimoProgreso.grasa} <span className="text-base">%</span></p>
                                    {progresoAnterior && (
                                        <p className={`text-xs mt-1 ${ultimoProgreso.grasa < progresoAnterior.grasa ? 'text-green-500' : 'text-red-500'}`}>
                                            {ultimoProgreso.grasa < progresoAnterior.grasa ? '↓' : '↑'} {Math.abs(ultimoProgreso.grasa - progresoAnterior.grasa)} %
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Músculo</p>
                                    <p className="mt-1 text-3xl font-bold text-green-500">{ultimoProgreso.musculo} <span className="text-base">%</span></p>
                                    {progresoAnterior && (
                                        <p className={`text-xs mt-1 ${ultimoProgreso.musculo > progresoAnterior.musculo ? 'text-green-500' : 'text-red-500'}`}>
                                            {ultimoProgreso.musculo > progresoAnterior.musculo ? '↑' : '↓'} {Math.abs(ultimoProgreso.musculo - progresoAnterior.musculo)} %
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}