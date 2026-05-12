import GymLayout from '@/layouts/gym-layout';

export default function Dashboard() {
    return (
        <GymLayout
            title="Dashboard General"
            subtitle="Sistema de administración del gimnasio."
        >
            <div className="mb-8 flex justify-end">
                <button className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600">
                    + Nuevo Miembro
                </button>
            </div>

            <section className="grid grid-cols-3 gap-5">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Miembros Activos</p>
                    <h3 className="mt-3 text-4xl font-bold text-orange-500">
                        24
                    </h3>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Check-ins Hoy</p>
                    <h3 className="mt-3 text-4xl font-bold text-green-500">
                        47
                    </h3>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="text-gray-500">Pagos Pendientes</p>
                    <h3 className="mt-3 text-4xl font-bold text-yellow-500">
                        8
                    </h3>
                </div>
            </section>

            <section className="mt-8 grid grid-cols-2 gap-5">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">
                        Clases del Día
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500">
                            <tr>
                                <th className="p-5">Clase</th>
                                <th>Hora</th>
                                <th>Asistentes</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-t border-gray-100">
                                <td className="p-5 font-medium">
                                    Yoga Matutino
                                </td>
                                <td>07:00 AM</td>
                                <td>12/15</td>
                            </tr>

                            <tr className="border-t border-gray-100">
                                <td className="p-5 font-medium">Spinning</td>
                                <td>09:00 AM</td>
                                <td>8/20</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 p-5 font-semibold">
                        Pagos Recientes
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500">
                            <tr>
                                <th className="p-5">Miembro</th>
                                <th>Monto</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-t border-gray-100">
                                <td className="p-5 font-medium">Pedro S.</td>
                                <td>$599</td>
                                <td className="text-green-500">Pagado</td>
                            </tr>

                            <tr className="border-t border-gray-100">
                                <td className="p-5 font-medium">Laura V.</td>
                                <td>$599</td>
                                <td className="text-yellow-500">Pendiente</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </GymLayout>
