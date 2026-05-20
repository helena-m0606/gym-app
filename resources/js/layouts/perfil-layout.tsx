import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

// ── Menús por rol ─────────────────────────────────────────────────────────────
const menuAdmin = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Miembros', href: '/miembros', icon: '👥' },
    { label: 'Empleados', href: '/empleados', icon: '💼' },
    { label: 'Sucursales', href: '/sucursales', icon: '🏢' },
    { label: 'Franquicias', href: '/franquicias', icon: '🏬' },
    { label: 'Membresías', href: '/membresias', icon: '💳' },
    { label: 'Pagos', href: '/pagos', icon: '💰' },
    { label: 'Clases', href: '/clases', icon: '🏋️' },
    { label: 'Rutinas', href: '/rutinas', icon: '📈' },
    { label: 'Productos', href: '/productos', icon: '🛒' },
    { label: 'Equipos', href: '/equipos', icon: '🛠️' },
];

const menuMiembro = [
    { label: 'Mi Perfil', href: '/miembro/dashboard', icon: '🏠' },
    { label: 'Clases', href: '/miembro/clases', icon: '🗓️' },
    { label: 'Membresía', href: '/miembro/membresia', icon: '💳' },
    { label: 'Notificaciones', href: '/miembro/notificaciones', icon: '🔔' },
];

const menuEntrenador = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Mis Clases', href: '/clases', icon: '🏋️' },
    { label: 'Rutinas', href: '/rutinas', icon: '📈' },
    { label: 'Miembros', href: '/miembros', icon: '👥' },
];

const menuGerente = [
    { label: 'Dashboard', href: '/gerente/dashboard', icon: '📊' },
    { label: 'Miembros', href: '/miembros', icon: '👥' },
    { label: 'Empleados', href: '/empleados', icon: '💼' },
    { label: 'Clases', href: '/clases', icon: '🏋️' },
    { label: 'Pagos', href: '/pagos', icon: '💰' },
    { label: 'Productos', href: '/productos', icon: '🛒' },
];

const menuRecepcionista = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Miembros', href: '/miembros', icon: '👥' },
    { label: 'Pagos', href: '/pagos', icon: '💰' },
    { label: 'Clases', href: '/clases', icon: '🏋️' },
    { label: 'Membresías', href: '/membresias', icon: '💳' },
];

function getMenuByRol(rol: string) {
    switch (rol) {
        case 'miembro': return menuMiembro;
        case 'entrenador': return menuEntrenador;
        case 'gerente': return menuGerente;
        case 'recepcionista': return menuRecepcionista;
        default: return menuAdmin;
    }
}

type PerfilLayoutProps = {
    children: React.ReactNode;
    rolLabel?: string;
    rolColor?: string;
    title?: string;
    subtitle?: string;
    menuItems?: any[];
};

export default function PerfilLayout({ children, rolLabel, rolColor, title, subtitle }: PerfilLayoutProps) {
<<<<<<< HEAD
    const { url, props } = usePage();
    const auth = (props as any).auth;
    const rol = auth?.user?.rol ?? 'admin';
    const menuItems = getMenuByRol(rol);

    const [menuAbierto, setMenuAbierto] = useState(false);

    const NavLinks = ({ onClickItem }: { onClickItem?: () => void }) => (
=======
    const { url } = usePage();
    const { auth } = usePage().props as any;
    const rol = auth?.user?.rol ?? 'admin';
    const [menuAbierto, setMenuAbierto] = useState(false);

    const menuItems = menusPorRol[rol] ?? menusPorRol.admin;
    const rolInfo = labelsPorRol[rol] ?? labelsPorRol.admin;
    const labelFinal = rolLabel ?? rolInfo.label;
    const colorFinal = rolColor ?? rolInfo.color;

    const renderMenu = (onClickItem?: () => void) => (
>>>>>>> origin/main
        <>
            {menuItems.map((item) => {
                const isActive = url.startsWith(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClickItem}
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
        </>
<<<<<<< HEAD
    );

    const Logo = () => (
        <h1 className="flex items-center gap-2 font-bold tracking-widest">
            <img src="/TittanGYM.png" alt="Logo" className="h-8 w-8 object-contain" />
            <span className="text-orange-500">Titan</span>GYM
        </h1>
=======
>>>>>>> origin/main
    );

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-gray-900">
            <div className="lg:flex">

                {/* SIDEBAR DESKTOP */}
                <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-gray-200 bg-white p-6 shadow-sm sticky top-0 h-screen overflow-y-auto">
<<<<<<< HEAD
                    <div className="mb-10 text-2xl">
                        <Logo />
                    </div>
                    <nav className="space-y-2 text-sm flex-1">
                        <NavLinks />
=======
                    <h1 className="mb-10 flex items-center gap-2 text-2xl font-bold tracking-widest">
                        <img src="/TittanGYM.png" alt="Logo" className="h-8 w-8 object-contain" />
                        <span className="text-orange-500">Titan</span>GYM
                    </h1>
                    <nav className="space-y-2 text-sm flex-1">
                        {renderMenu()}
>>>>>>> origin/main
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
                <div className="lg:hidden sticky top-0 z-40">
                    <div className="flex items-center bg-white border-b border-gray-200 px-4 py-3 shadow-sm gap-3">
                        <button
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100"
                        >
                            ☰
                        </button>
<<<<<<< HEAD
                        <div className="text-xl">
                            <Logo />
                        </div>
                    </div>
                </div>

                {/* DRAWER MÓVIL */}
=======
                        <h1 className="flex items-center gap-2 text-xl font-bold tracking-widest">
                            <img src="/TittanGYM.png" alt="Logo" className="h-7 w-7 object-contain" />
                            <span className="text-orange-500">Titan</span>GYM
                        </h1>
                    </div>
                </div>

                {/* DRAWER OVERLAY */}
>>>>>>> origin/main
                {menuAbierto && (
                    <div className="lg:hidden fixed inset-0 z-50 flex">
                        <div
                            className="fixed inset-0 bg-black/10 backdrop-blur-[1px]"
                            onClick={() => setMenuAbierto(false)}
                        />
                        <div className="relative z-50 w-64 bg-white h-full shadow-xl flex flex-col p-6">
                            <div className="flex items-center justify-between mb-8">
<<<<<<< HEAD
                                <div className="text-xl">
                                    <Logo />
                                </div>
=======
                                <h1 className="flex items-center gap-2 text-xl font-bold tracking-widest">
                                    <img src="/TittanGYM.png" alt="Logo" className="h-7 w-7 object-contain" />
                                    <span className="text-orange-500">Titan</span>GYM
                                </h1>
>>>>>>> origin/main
                                <button
                                    onClick={() => setMenuAbierto(false)}
                                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>
                            <nav className="space-y-1 text-sm flex-1">
<<<<<<< HEAD
                                <NavLinks onClickItem={() => setMenuAbierto(false)} />
=======
                                {renderMenu(() => setMenuAbierto(false))}
>>>>>>> origin/main
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
                        <span className={`rounded-full border px-4 py-2 text-sm ${colorFinal}`}>
                            {labelFinal}
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