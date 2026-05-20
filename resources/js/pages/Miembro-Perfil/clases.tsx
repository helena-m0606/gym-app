import PerfilLayout from '@/layouts/perfil-layout';

type Clase = {
    id: number;
    nombre: string;
    fecha: string;
    capacidad: number;
    entrenador: string;
    sucursal: string;
    estado?: string;
};

type Props = {
    misClases: Clase[];
    clasesDisponibles: Clase[];
};

export default function MiembroClases({ misClases, clasesDisponibles }: Props) {
    return (
        <PerfilLayout
            rolLabel="👤 Miembro"
            rolColor="border-yellow-200 bg-yellow-50 text-yellow-600"
            title="Mis Clases"
            subtitle="Tus reservas y clases disponibles."
        >
            {/* Mis reservas */}
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Mis Reservas</div>
                <table className="min-w-[600px] w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Clase</th>
                            <th>Entrenador</th>
                            <th>Sucursal</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {misClases.length > 0 ? misClases.map((c) => (
                            <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                <td className="p-5 font-medium">{c.nombre}</td>
                                <td>{c.entrenador}</td>
                                <td>{c.sucursal}</td>
                                <td>{new Date(c.fecha).toLocaleDateString('es-MX')}</td>
                                <td>
                                    <span className={
                                        c.estado === 'confirmada'
                                            ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600'
                                            : 'rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600'
                                    }>
                                        {c.estado}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">No tienes clases reservadas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Clases disponibles */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Clases Disponibles</div>
                <table className="min-w-[600px] w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Clase</th>
                            <th>Entrenador</th>
                            <th>Sucursal</th>
                            <th>Fecha</th>
                            <th>Cupo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clasesDisponibles.length > 0 ? clasesDisponibles.map((c) => (
                            <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                <td className="p-5 font-medium">{c.nombre}</td>
                                <td>{c.entrenador}</td>
                                <td>{c.sucursal}</td>
                                <td>{new Date(c.fecha).toLocaleDateString('es-MX')}</td>
                                <td>{c.capacidad} lugares</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">No hay clases disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </PerfilLayout>
    );
}
