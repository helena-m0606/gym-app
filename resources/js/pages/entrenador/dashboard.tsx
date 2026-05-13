import { Link } from '@inertiajs/react';

const menuItems = [
    { label: 'Dashboard', href: '/entrenador/dashboard', icon: '📊' },
    { label: 'Mis Clases', href: '/entrenador/clases', icon: '🏃' },
    { label: 'Rutinas', href: '/entrenador/rutinas', icon: '📋' },
    { label: 'Mis Miembros', href: '/entrenador/miembros', icon: '👥' },
    { label: 'Progreso', href: '/entrenador/progreso', icon: '📈' },
    { label: 'Evaluaciones', href: '/entrenador/evaluaciones', icon: '💪' },
];

type Clase = {
    nombre: string;
    fecha: string;
    capacidad: number;
    sucursal: string;
};

type Rutina = {
    nombre: string;
    miembro: string;
    fecha_inicio: string;
};

type Props = {
    totalClases: number;
    totalRutinas: number;
    totalMiembros: number;
    proximasClases: Clase[];
    misRutinas: Rutina[];
};

export default function EntrenadorDashboard({
    totalClases,
    totalRutinas,
    totalMiembros,
    proximasClases,
    misRutinas,
}: Props) {
    const currentPath = window.location.pathname;

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
                        <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-600">
                            🏋️ Entrenador — Acceso Parcial
                        </span>
                        <h2 className="mt-6 text-3xl font-bold">Dashboard</h2>
                        <p className="text-gray-500">Panel del entrenador.</p>
                    </div>

                    <section className="grid grid-cols-3 gap-5">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-gray-500">Mis Clases</p>
                            <h3 className="mt-3 text-4xl font-bold text-blue-500">{totalClases}</h3>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-gray-500">Rutinas Activas</p>
                            <h3 className="mt-3 text-4xl font-bold text-orange-500">{totalRutinas}</h3>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-gray-500">Miembros Activos</p>
                            <h3 className="mt-3 text-4xl font-bold text-green-500">{totalMiembros}</h3>
                        </div>
                    </section>

                    <section className="mt-8 grid grid-cols-2 gap-5">
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-5 font-semibold">
                                Próximas Clases
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500">
                                    <tr>
                                        <th className="p-5">Clase</th>
                                        <th>Fecha</th>
                                        <th>Capacidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proximasClases.map((clase, i) => (
                                        <tr key={i} className="border-t border-gray-100">
                                            <td className="p-5 font-medium">{clase.nombre}</td>
                                            <td>{new Date(clase.fecha).toLocaleDateString('es-MX')}</td>
                                            <td>{clase.capacidad}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-5 font-semibold">
                                Mis Rutinas
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500">
                                    <tr>
                                        <th className="p-5">Rutina</th>
                                        <th>Miembro</th>
                                        <th>Inicio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {misRutinas.map((rutina, i) => (
                                        <tr key={i} className="border-t border-gray-100">
                                            <td className="p-5 font-medium">{rutina.nombre}</td>
                                            <td>{rutina.miembro}</td>
                                            <td>{new Date(rutina.fecha_inicio).toLocaleDateString('es-MX')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}