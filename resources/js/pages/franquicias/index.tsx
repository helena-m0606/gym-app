import { useForm } from '@inertiajs/react';

import GymLayout from '@/layouts/gym-layout';

type Franquicia = {
    id: number;
    nombre: string;
    razon_social: string;
    rfc: string;
};

export default function FranquiciasIndex({
    franquicias,
}: {
    franquicias: Franquicia[];
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        razon_social: '',
        rfc: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post('/franquicias', {
            onSuccess: () => reset(),
        });
    }

    return (
        <GymLayout title="Franquicias" subtitle="Administración de franquicias.">
            <form
                onSubmit={submit}
                className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h3 className="mb-5 text-lg font-semibold">Registrar franquicia</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />
                        {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Razón social"
                            value={data.razon_social}
                            onChange={(e) => setData('razon_social', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />
                        {errors.razon_social && <p className="mt-1 text-xs text-red-500">{errors.razon_social}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="RFC"
                            value={data.rfc}
                            onChange={(e) => setData('rfc', e.target.value.toUpperCase())}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm uppercase outline-none focus:border-orange-400"
                        />
                        {errors.rfc && <p className="mt-1 text-xs text-red-500">{errors.rfc}</p>}
                    </div>
                </div>

                <button
                    disabled={processing}
                    className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                >
                    {processing ? 'Guardando...' : 'Guardar Franquicia'}
                </button>
            </form>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">
                    Lista de Franquicias
                </div>

                <table className="min-w-[650px] w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Nombre</th>
                            <th>Razón social</th>
                            <th>RFC</th>
                        </tr>
                    </thead>

                    <tbody>
                        {franquicias.map((franquicia) => (
                            <tr key={franquicia.id} className="border-t border-gray-100">
                                <td className="p-5 font-medium">{franquicia.nombre}</td>
                                <td>{franquicia.razon_social}</td>
                                <td>{franquicia.rfc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GymLayout>
    );
}