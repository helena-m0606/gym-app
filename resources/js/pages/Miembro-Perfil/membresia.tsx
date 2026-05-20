import PerfilLayout from '@/layouts/perfil-layout';

type Membresia = {
    tipo: string;
    fecha_inicio: string;
    fecha_fin: string;
    activa: boolean;
    precio: number;
};

type Historial = {
    tipo: string;
    fecha_inicio: string;
    fecha_fin: string;
    activa: boolean;
    monto: number;
    metodo_pago: string;
    fecha_pago: string;
};

type Props = {
    membresia: Membresia | null;
    historial: Historial[];
    diasRestantes: number;
};

export default function MiembroMembresia({ membresia, historial, diasRestantes }: Props) {
    return (
        <PerfilLayout
            rolLabel="👤 Miembro"
            rolColor="border-yellow-200 bg-yellow-50 text-yellow-600"
            title="Mi Membresía"
            subtitle="Estado y historial de tu membresía."
        >
            {/* Estado actual */}
            {membresia ? (
                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-5 font-semibold text-gray-800">Membresía Activa</h3>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-gray-500">Tipo</p>
                            <p className="mt-1 text-xl font-bold text-gray-800">{membresia.tipo}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Vence el</p>
                            <p className="mt-1 text-xl font-bold text-gray-800">
                                {new Date(membresia.fecha_fin).toLocaleDateString('es-MX')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Días restantes</p>
                            <p className={`mt-1 text-4xl font-bold ${diasRestantes < 7 ? 'text-red-500' : 'text-green-500'}`}>
                                {diasRestantes}
                            </p>
                        </div>
                    </div>

                    {diasRestantes < 7 && (
                        <div className="mt-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                            ⚠️ Tu membresía está por vencer. Acércate a recepción para renovarla.
                        </div>
                    )}
                </div>
            ) : (
                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center text-gray-400">
                    No tienes una membresía activa. Acércate a recepción para adquirir una.
                </div>
            )}

            {/* Historial */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">Historial de Membresías</div>
                <table className="min-w-[600px] w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-5">Tipo</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th>Monto</th>
                            <th>Método</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historial.length > 0 ? historial.map((h, i) => (
                            <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/60">
                                <td className="p-5 font-medium">{h.tipo}</td>
                                <td>{new Date(h.fecha_inicio).toLocaleDateString('es-MX')}</td>
                                <td>{new Date(h.fecha_fin).toLocaleDateString('es-MX')}</td>
                                <td>${h.monto}</td>
                                <td className="capitalize">{h.metodo_pago}</td>
                                <td>
                                    <span className={h.activa
                                        ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600'
                                        : 'rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500'}>
                                        {h.activa ? 'Activa' : 'Vencida'}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">Sin historial.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </PerfilLayout>
    );
}
