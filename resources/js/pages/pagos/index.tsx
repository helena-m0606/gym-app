import GymLayout from '@/layouts/gym-layout';

export default function PagosIndex() {
    return (
        <GymLayout
            title="Pagos"
            subtitle="Registro y control de pagos de membresías."
        >
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Módulo de pagos</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Aquí se podrán registrar pagos, consultar estados y revisar pagos pendientes.
                </p>
            </div>
        </GymLayout>
    );
}