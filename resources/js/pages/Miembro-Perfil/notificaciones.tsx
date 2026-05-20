import PerfilLayout from '@/layouts/perfil-layout';

type Notificacion = {
    id: number;
    mensaje: string;
    fecha: string;
    leida: boolean;
};

type Props = {
    notificaciones: Notificacion[];
};

export default function MiembroNotificaciones({ notificaciones }: Props) {
    return (
        <PerfilLayout
            rolLabel="👤 Miembro"
            rolColor="border-yellow-200 bg-yellow-50 text-yellow-600"
            title="Notificaciones"
            subtitle="Tus avisos y alertas recientes."
        >
            <div className="space-y-3">
                {notificaciones.length > 0 ? notificaciones.map((n) => (
                    <div key={n.id} className={`rounded-2xl border bg-white p-5 shadow-sm flex items-start gap-4 ${
                        n.leida ? 'border-gray-200' : 'border-orange-200 bg-orange-50/30'
                    }`}>
                        <div className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${n.leida ? 'bg-gray-300' : 'bg-orange-500'}`} />
                        <div className="flex-1">
                            <p className={`text-sm ${n.leida ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                                {n.mensaje}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                {new Date(n.fecha).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        {!n.leida && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600 shrink-0">
                                Nueva
                            </span>
                        )}
                    </div>
                )) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400">
                        No tienes notificaciones.
                    </div>
                )}
            </div>
        </PerfilLayout>
    );
}
