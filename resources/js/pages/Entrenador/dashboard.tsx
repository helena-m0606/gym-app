import PerfilLayout from '@/layouts/perfil-layout';

type Clase = {
    nombre: string;
    horario: string;
    cupo_maximo: number;
    sucursal: string;
};

type Props = {
    totalClases: number;
    totalRutinas: number;
    totalMiembros: number;
    proximasClases: Clase[];
};

export default function EntrenadorDashboard({
    totalClases,
    totalRutinas,
    totalMiembros,
    proximasClases,
}: Props) {
    console.log('proximasClases:', proximasClases);
    return (
        <PerfilLayout
            title="Dashboard"
            subtitle="Panel del entrenador."
        >
            <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Mis Clases</p>
                    <h3 className="mt-3 text-4xl font-bold text-blue-500">{totalClases}</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Rutinas Creadas</p>
                    <h3 className="mt-3 text-4xl font-bold text-orange-500">{totalRutinas}</h3>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Mis Miembros</p>
                    <h3 className="mt-3 text-4xl font-bold text-green-500">{totalMiembros}</h3>
                </div>
            </section>

            <section className="mt-8">
                <h3 className="mb-4 text-base font-semibold text-gray-700">Clases de esta Semana</h3>

                {/* VISTA MÓVIL */}
                <div className="space-y-4 md:hidden">
                    {proximasClases.length > 0 ? proximasClases.map((clase, i) => (
                        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
                            <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-gray-900 text-base leading-tight">{clase.nombre}</h4>
                                <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 text-xs font-bold shrink-0">
                                    {clase.cupo_maximo} lugares
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Horario</span>
                                    <span className="font-medium text-gray-700">{clase.horario}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Sucursal</span>
                                    <span className="font-medium text-gray-700">{clase.sucursal}</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                            No hay clases esta semana
                        </div>
                    )}
                </div>

                {/* VISTA DESKTOP */}
                <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-5">Clase</th>
                                <th>Días / Hora</th>
                                <th>Sucursal</th>
                                <th>Capacidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proximasClases.length > 0 ? proximasClases.map((clase, i) => (
                                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    <td className="p-5 font-medium">{clase.nombre}</td>
                                    <td className="text-gray-600">{clase.horario ?? 'Sin horario'}</td>
                                    <td className="text-gray-600">{clase.sucursal}</td>
                                    <td className="text-gray-600">{clase.cupo_maximo}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="p-5 text-center text-gray-400">No hay clases esta semana</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </PerfilLayout>
    );
}