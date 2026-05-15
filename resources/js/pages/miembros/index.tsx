import { useForm } from '@inertiajs/react';

import GymLayout from '@/layouts/gym-layout';

type Sucursal = {
    id: number;
    nombre: string;
};

type Miembro = {
    id: number;
    nombre: string;
    email: string;
    telefono: string | null;
    fecha_nacimiento: string | null;
    genero: string | null;
    estado: boolean;
    sucursal: Sucursal | null;
};

export default function MiembrosIndex({
    miembros,
    sucursales,
}: {
    miembros: Miembro[];
    sucursales: Sucursal[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        sucursal_id: '',
        nombre: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        genero: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post('/miembros', {
            onSuccess: () => reset(),
        });
    }

    return (
        <GymLayout
            title="Miembros"
            subtitle="Gestión de usuarios registrados en el gimnasio."
        >
            <form
                onSubmit={submit}
                className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h3 className="mb-5 text-lg font-semibold">
                    Registrar nuevo miembro
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <select
                            value={data.sucursal_id}
                            onChange={(e) =>
                                setData('sucursal_id', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            <option value="">Seleccionar sucursal</option>

                            {sucursales.map((sucursal) => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>

                        {errors.sucursal_id && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.sucursal_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={data.nombre}
                            maxLength={50}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />

                        {errors.nombre && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.nombre}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={data.email}
                            maxLength={50}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />

                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Teléfono"
                            value={data.telefono}
                            maxLength={10}
                            onChange={(e) =>
                                setData(
                                    'telefono',
                                    e.target.value.replace(/\D/g, ''),
                                )
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />

                        {errors.telefono && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.telefono}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="date"
                            value={data.fecha_nacimiento}
                            onChange={(e) =>
                                setData('fecha_nacimiento', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-500 outline-none focus:border-orange-400"
                        />

                        {errors.fecha_nacimiento && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.fecha_nacimiento}
                            </p>
                        )}
                    </div>

                    <div>
                        <select
                            value={data.genero}
                            onChange={(e) => setData('genero', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            <option value="">Seleccionar género</option>
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                            <option value="otro">Otro</option>
                        </select>

                        {errors.genero && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.genero}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    disabled={processing}
                    className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                >
                    {processing ? 'Guardando...' : 'Guardar Miembro'}
                </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">
                    Lista de Miembros
                </div>

                <table className="min-w-[900px] w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Sucursal</th>
                            <th>Género</th>
                            <th>Nacimiento</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        {miembros.map((miembro) => (
                            <tr
                                key={miembro.id}
                                className="border-t border-gray-100"
                            >
                                <td className="p-5 font-medium">
                                    {miembro.nombre}
                                </td>

                                <td>{miembro.email}</td>

                                <td>{miembro.telefono ?? 'Sin teléfono'}</td>

                                <td>{miembro.sucursal?.nombre ?? 'N/A'}</td>

                                <td>{miembro.genero ?? 'N/A'}</td>

                                <td>{miembro.fecha_nacimiento ?? 'N/A'}</td>

                                <td>
                                    <span
                                        className={
                                            miembro.estado
                                                ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600'
                                                : 'rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600'
                                        }
                                    >
                                        {miembro.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {miembros.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="p-5 text-center text-gray-500"
                                >
                                    No hay miembros registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </GymLayout>
    );
}