import GymLayout from '@/layouts/gym-layout';

export default function MembresiasIndex() {
    return (
        <GymLayout
            title="Membresías"
            subtitle="Gestión de planes y membresías de los miembros."
        >
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Módulo de membresías</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Aquí se administrarán las membresías activas, fechas de inicio, vencimiento y tipo de plan.
                </p>
            </div>
        </GymLayout>
    );
}