import PerfilLayout from '@/layouts/perfil-layout';

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
    return (
        <PerfilLayout
            menuItems={menuItems}
            rolLabel="🏋️ Entrenador — Acceso Parcial"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Dashboard"
            subtitle="Panel del entrenador."
        >
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

            <section className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">Próximas Clases</div>
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
                    <div className="border-b border-gray-200 p-5 font-semibold">Mis Rutinas</div>
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
        </PerfilLayout>
    );
}