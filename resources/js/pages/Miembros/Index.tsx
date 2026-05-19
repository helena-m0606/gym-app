import AppLayout from "@/layouts/app-layout";

export default function Index() {
    return (
        <AppLayout>

            <h1 className="text-3xl font-bold mb-4">
                Gestión de Miembros
            </h1>

            <div className="bg-white p-6 rounded-lg shadow">
                Aquí irá la tabla de miembros.
            </div>

        </AppLayout>
    );
}