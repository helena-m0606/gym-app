import { Link } from '@inertiajs/react';

type Props = {
    children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-gray-100">

            {/* HEADER */}
            <header className="bg-gray-900 text-white shadow-md">

                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    <h1 className="text-2xl font-bold">
                        Gym App
                    </h1>

                    <nav className="flex gap-6 text-sm font-medium">

                        <Link
                            href="/"
                            className="hover:text-cyan-400 transition"
                        >
                            Dashboard
                        </Link>

                        <Link
                            href="/miembros"
                            className="hover:text-cyan-400 transition"
                        >
                            Miembros
                        </Link>

                        <Link
                            href="/membresias"
                            className="hover:text-cyan-400 transition"
                        >
                            Membresías
                        </Link>

                        <Link
                            href="/pagos"
                            className="hover:text-cyan-400 transition"
                        >
                            Pagos
                        </Link>

                    </nav>

                </div>

            </header>

            {/* CONTENIDO */}
            <main className="max-w-7xl mx-auto p-6">
                {children}
            </main>

        </div>
    );
}