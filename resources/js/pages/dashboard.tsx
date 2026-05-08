import AppLayout from '@/layouts/app-layout';

export default function Dashboard() {
    return (
        <AppLayout>

            <div className="bg-white rounded-xl shadow p-8">

                <h1 className="text-3xl font-bold mb-4">
                    Dashboard
                </h1>

                <p className="text-gray-600">
                    Sistema de administración del gimnasio.
                </p>

            </div>

        </AppLayout>
    );
}