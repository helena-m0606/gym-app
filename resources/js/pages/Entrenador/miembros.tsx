import { useState } from 'react';
import PerfilLayout from '@/layouts/perfil-layout';

type Sucursal = { id: number; nombre: string };

type Miembro = {
    id: number;
    sucursal_id: number;
    nombre: string;
    email: string;
    telefono: string | null;
    fecha_nacimiento: string | null;
    genero: string | null;
    estado: boolean;
    sucursal?: Sucursal;
};

export default function Index({ miembros, sucursales }: { miembros: Miembro[]; sucursales: Sucursal[] }) {
    const [busqueda, setBusqueda] = useState('');
    const [filtroSucursal, setFiltroSucursal] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    const miembrosFiltrados = miembros.filter((m) => {
        const coincideNombre = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideSucursal = filtroSucursal === '' || String(m.sucursal_id) === filtroSucursal;
        const coincideEstado = filtroEstado === '' || (filtroEstado === 'activo' ? m.estado : !m.estado);
        return coincideNombre && coincideSucursal && coincideEstado;
    });

    return (
        <PerfilLayout
            title="Mis Miembros"
            subtitle="Miembros de tu sucursal."
        >
            {/* FILTROS */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 sm:max-w-xs"
                />
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-400 text-gray-600">
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </div>

            {/* VISTA MÓVIL */}
            <div className="space-y-4 md:hidden">
                <h3 className="text-base font-semibold text-gray-700 px-1 mb-2">Lista de Miembros</h3>
                {miembrosFiltrados.length > 0 ? (
                    miembrosFiltrados.map((m) => (
                        <div key={m.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base leading-tight">{m.nombre}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{m.email}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${
                                    m.estado
                                        ? 'bg-green-50 text-green-700 border border-green-100'
                                        : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    {m.estado ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Sucursal</span>
                                    <span className="font-medium text-gray-700">{m.sucursal?.nombre ?? 'Sin asignar'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Teléfono</span>
                                    <span className="font-medium text-gray-700">{m.telefono ?? 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                        No se encontraron miembros.
                    </div>
                )}
            </div>

            {/* VISTA DESKTOP */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Lista de Miembros</div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Nombre / Email</th>
                            <th>Sucursal</th>
                            <th>Teléfono</th>
                            <th>Género</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {miembrosFiltrados.length > 0 ? (
                            miembrosFiltrados.map((m) => (
                                <tr key={m.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition">
                                    <td className="p-5">
                                        <div className="font-medium text-gray-900">{m.nombre}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{m.email}</div>
                                    </td>
                                    <td className="text-gray-600">{m.sucursal?.nombre ?? 'Sin asignar'}</td>
                                    <td className="text-gray-600">{m.telefono ?? 'Sin teléfono'}</td>
                                    <td className="text-gray-500">{m.genero ?? 'N/A'}</td>
                                    <td>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            m.estado
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {m.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">No se encontraron miembros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </PerfilLayout>
    );
}