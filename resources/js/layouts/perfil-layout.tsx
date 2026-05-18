import { useState } from 'react';
import { Link } from '@inertiajs/react';

type MenuItem = {
    label: string;
    href: string;
    icon: string;
};

type PerfilLayoutProps = {
    children: React.ReactNode;
    menuItems: MenuItem[];
    rolLabel: string;
    rolColor: string;
    title?: string;
    subtitle?: string;
};

export default function PerfilLayout({ children, menuItems, rolLabel, rolColor, title, subtitle }: PerfilLayoutProps) {
    const currentPath = window.location.pathname;
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-gray-900">
            <div className="lg:flex">

                {/* SIDEBAR DESKTOP */}
                <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-gray-200 bg-white p-6 shadow-sm sticky top-0 h-screen overflow-y-auto">
                    <h1 className="mb-10 text-2xl font-bold tracking-widest">
                        <span className="text-orange-500">GYM</span>APP
                    </h1>
                    <nav className="space-y-2 text-sm flex-1">
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
                    <div className="mt-auto pt-4 border-t border-gray-200">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="w-full text-left rounded-xl px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                        >
                            🚪 Cerrar sesión
                        </Link>
                    </div>
                </aside>

                {/* NAVBAR MÓVIL */}
                <div className="lg:hidden">
                    <div className="flex items-center bg-white border-b border-gray-200 px-4 py-3 shadow-sm gap-3">
                        <button
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100"
                        >
                            ☰
                        </button>
                        <h1 className="text-xl font-bold tracking-widest">
                            <span className="text-orange-500">GYM</span>APP
                        </h1>
                    </div>
                </div>

                {/* DRAWER OVERLAY */}
                {menuAbierto && (
                    <div className="lg:hidden fixed inset-0 z-50 flex">
                        <div
                            className="fixed inset-0 bg-black/10 backdrop-blur-[1px]"
                            onClick={() => setMenuAbierto(false)}
                        />
                        <div className="relative z-50 w-64 bg-white h-full shadow-xl flex flex-col p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-xl font-bold tracking-widest">
                                    <span className="text-orange-500">GYM</span>APP
                                </h1>
                                <button
                                    onClick={() => setMenuAbierto(false)}
                                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>
                            <nav className="space-y-1 text-sm flex-1">
                                {menuItems.map((item) => {
                                    const isActive = currentPath.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMenuAbierto(false)}
                                            className={
                                                isActive
                                                    ? 'block rounded-xl bg-orange-100 px-4 py-3 font-medium text-orange-600'
                                                    : 'block rounded-xl px-4 py-3 text-gray-600 hover:bg-gray-100'
                                            }
                                        >
                                            <span className="mr-2">{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="pt-4 border-t border-gray-200">
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full text-left block rounded-xl px-4 py-3 text-sm text-red-500 hover:bg-red-50"
                                >
                                    🚪 Cerrar sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
                    <div className="mb-8">
                        <span className={`rounded-full border px-4 py-2 text-sm ${rolColor}`}>
                            {rolLabel}
                        </span>
                        {title && <h2 className="mt-6 text-3xl font-bold">{title}</h2>}
                        {subtitle && <p className="text-gray-500">{subtitle}</p>}
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}