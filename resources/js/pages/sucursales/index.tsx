import { useForm } from '@inertiajs/react';

import GymLayout from '@/layouts/gym-layout';

type Franquicia = {
    id: number;
    nombre: string;
};

type Sucursal = {
    id: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    telefono: string | null;
    activa: boolean;

    franquicia: Franquicia;
};

export default function SucursalesIndex({
    sucursales,
    franquicias,
}: {
    sucursales: Sucursal[];
    franquicias: Franquicia[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        franquicia_id: '',
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post('/sucursales', {
            onSuccess: () => reset(),
        });
    }

    return (
        <GymLayout
            title="Sucursales"
            subtitle="Administración de sucursales del gimnasio."
        >
            <form
                onSubmit={submit}
                className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h3 className="mb-5 text-lg font-semibold">
                    Registrar nueva sucursal
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <select
                            value={data.franquicia_id}
                            onChange={(e) =>
                                setData('franquicia_id', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        >
                            <option value="">
                                Seleccionar franquicia
                            </option>

                            {franquicias.map((franquicia) => (
                                <option
                                    key={franquicia.id}
                                    value={franquicia.id}
                                >
                                    {franquicia.nombre}
                                </option>
                            ))}
                        </select>

                        {errors.franquicia_id && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.franquicia_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Nombre de la sucursal"
                            value={data.nombre}
                            onChange={(e) =>
                                setData('nombre', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />
                    </div>

                    <div className="col-span-2">
                        <input
                            type="text"
                            placeholder="Dirección"
                            value={data.direccion}
                            onChange={(e) =>
                                setData('direccion', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Ciudad"
                            value={data.ciudad}
                            onChange={(e) =>
                                setData('ciudad', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Teléfono"
                            value={data.telefono}
                            onChange={(e) =>
                                setData('telefono', e.target.value)
                            }
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />
                    </div>
                </div>

                <button
                    disabled={processing}
                    className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                >
                    {processing ? 'Guardando...' : 'Guardar Sucursal'}
                </button>
            </form>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">
                    Lista de Sucursales
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Sucursal</th>
                            <th>Franquicia</th>
                            <th>Ciudad</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sucursales.map((sucursal) => (
                            <tr
                                key={sucursal.id}
                                className="border-t border-gray-100"
                            >
                                <td className="p-5 font-medium">
                                    {sucursal.nombre}
                                </td>

                                <td>
                                    {sucursal.franquicia?.nombre}
                                </td>

                                <td>{sucursal.ciudad}</td>

                                <td>
                                    {sucursal.telefono ?? 'Sin teléfono'}
                                </td>

                                <td>
                                    <span
                                        className={
                                            sucursal.activa
                                                ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600'
                                                : 'rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600'
                                        }
                                    >
                                        {sucursal.activa
                                            ? 'Activa'
                                            : 'Inactiva'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GymLayout>
    );
}