import { Link } from '@inertiajs/react';

const menuItems = [
    { label: 'Dashboard', href: '/recepcionista/dashboard', icon: '📊' },
    { label: 'Check-in', href: '/recepcionista/checkins', icon: '✅' },
    { label: 'Miembros', href: '/recepcionista/miembros', icon: '👥' },
    { label: 'Clases', href: '/recepcionista/clases', icon: '🏋️' },
    { label: 'Pagos', href: '/recepcionista/pagos', icon: '💰' },
];

export default function RecepcionistaDashboard() {
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
                        <span className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-600">
                            🗂️ Recepcionista — Acceso Operativo
                        </span>
                        <h2 className="mt-6 text-3xl font-bold">Dashboard</h2>
                        <p className="text-gray-500">Panel de operaciones diarias.</p>
                    </div>

                    <section className="grid grid-cols-3 gap-5">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-gray-500">Check-ins Hoy</p>
                            <h3 className="mt-3 text-4xl font-bold text-green-500">47</h3>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-gray-500">Membresías por Vencer</p>
                            <h3 className="mt-3 text-4xl font-bold text-yellow-500">8</h3>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <p className="text-gray-500">Nuevos este Mes</p>
                            <h3 className="mt-3 text-4xl font-bold text-orange-500">12</h3>
                        </div>
                    </section>

                    <section className="mt-8 grid grid-cols-2 gap-5">
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-5 font-semibold">
                                Últimos Check-ins
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500">
                                    <tr>
                                        <th className="p-5">Miembro</th>
                                        <th>Hora</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-gray-100">
                                        <td className="p-5 font-medium">Pedro Sánchez</td>
                                        <td>08:30 AM</td>
                                    </tr>
                                    <tr className="border-t border-gray-100">
                                        <td className="p-5 font-medium">Laura Vega</td>
                                        <td>10:00 AM</td>
                                    </tr>
                                    <tr className="border-t border-gray-100">
                                        <td className="p-5 font-medium">Miguel Ruiz</td>
                                        <td>07:45 AM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 p-5 font-semibold">
                                Membresías por Vencer
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="text-gray-500">
                                    <tr>
                                        <th className="p-5">Miembro</th>
                                        <th>Vence</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-gray-100">
                                        <td className="p-5 font-medium">Pedro Sánchez</td>
                                        <td>31/03/2026</td>
                                        <td className="text-red-500">Vencida</td>
                                    </tr>
                                    <tr className="border-t border-gray-100">
                                        <td className="p-5 font-medium">Valeria Moreno</td>
                                        <td>02/03/2026</td>
                                        <td className="text-red-500">Vencida</td>
                                    </tr>
                                    <tr className="border-t border-gray-100">
                                        <td className="p-5 font-medium">Fernando Castro</td>
                                        <td>09/04/2026</td>
                                        <td className="text-yellow-500">Por vencer</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}