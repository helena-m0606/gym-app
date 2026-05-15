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

    return (
        <div className="min-h-screen bg-[#f3f4f6] text-gray-900">
            <div className="min-h-screen lg:flex">
                <aside className="border-b border-gray-200 bg-white p-4 shadow-sm lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:p-6">
                    <h1 className="mb-6 text-2xl font-bold tracking-widest lg:mb-10">
                        <span className="text-orange-500">GYM</span>APP
                    </h1>
                    <nav className="flex gap-2 overflow-x-auto text-sm lg:block lg:space-y-2 lg:overflow-visible">
                        {menuItems.map((item) => {
                            const isActive = currentPath.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={
                                        isActive
                                            ? 'whitespace-nowrap rounded-xl bg-orange-100 px-4 py-3 font-medium text-orange-600 lg:block'
                                            : 'whitespace-nowrap rounded-xl px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 lg:block'
                                    }
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <main className="flex-1 p-4 sm:p-6 lg:p-10">
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