import { Link } from '@inertiajs/react';

type GymLayoutProps = {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
};

const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Miembros', href: '/miembros', icon: '👥' },
    { label: 'Sucursales', href: '/sucursales', icon: '🏢' },
    { label: 'Franquicias', href: '/franquicias', icon: '🏬' },
    { label: 'Membresías', href: '/membresias', icon: '💳' },
    { label: 'Pagos', href: '/pagos', icon: '💰' },
    { label: 'Clases', href: '/clases', icon: '🏋️' },
    { label: 'Rutinas', href: '/rutinas', icon: '📈' },
    { label: 'Productos', href: '/productos', icon: '🛒' },
    { label: 'Equipos', href: '/equipos', icon: '🛠️' },
];

export default function GymLayout({ children, title, subtitle }: GymLayoutProps) {
    const currentPath = window.location.pathname;

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-gray-900">
            <div className="flex min-h-screen">
                <aside className="w-64 border-r border-gray-200 bg-white p-6 shadow-sm">
                    <h1 className="mb-10 text-2xl font-bold tracking-widest">
                        <span className="text-orange-500">GYM</span>APP
                    </h1>

                    <nav className="space-y-2 text-sm">
                        {menuItems.map((item) => {
                            const isActive = currentPath.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={
                                        isActive
                                            ? 'block rounded-xl bg-orange-100 px-4 py-3 font-medium text-orange-600'
                                            : 'block rounded-xl px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <main className="flex-1 p-10">
                    {(title || subtitle) && (
                        <div className="mb-8">
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-600">
                                🏆 Administrador — Acceso Total
                            </span>

                            {title && (
                                <h2 className="mt-6 text-3xl font-bold">
                                    {title}
                                </h2>
                            )}

                            {subtitle && (
                                <p className="text-gray-500">{subtitle}</p>
                            )}
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}