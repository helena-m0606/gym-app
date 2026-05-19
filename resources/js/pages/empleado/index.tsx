import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import PerfilLayout from '@/layouts/perfil-layout';

type Empleado = {
    id: number;
    nombre: string;
    email: string;
    salario: number;
    sucursal_id: number;
    sucursal_nombre: string;
    rol: 'gerente' | 'entrenador' | 'recepcionista';
    user_id: number;
};

type Sucursal = {
    id: number;
    nombre: string;
};

type Props = {
    empleados: Empleado[];
    sucursales: Sucursal[];
};

function IconEdit() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
        </svg>
    );
}

function IconTrash() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                {children}
            </div>
        </div>
    );
}

export default function EmpleadosIndex({ empleados, sucursales }: Props) {
    // ── Registrar Empleado ──
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        rol: 'recepcionista',
        sucursal_id: sucursales[0]?.id || '',
    });

    function handleCreateSubmit(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/empleados', {
            onSuccess: () => createForm.reset('name', 'email', 'password'),
        });
    }

    // ── Editar Empleado ──
    const [editTarget, setEditTarget] = useState<Empleado | null>(null);
    const editForm = useForm({
        name: '',
        email: '',
        rol: 'recepcionista',
        sucursal_id: '',
        salario: 0,
        password: '',
    });

    function openEdit(emp: Empleado) {
        editForm.clearErrors();
        editForm.setData({
            name: emp.nombre,
            email: emp.email,
            rol: emp.rol,
            sucursal_id: emp.sucursal_id.toString(),
            salario: emp.salario,
            password: '',
        });
        setEditTarget(emp);
    }

    useEffect(() => {
        if (editTarget) {
            const salariosBase = {
                recepcionista: 6000,
                entrenador: 8000,
                gerente: 15000,
            };
            editForm.setData('salario', salariosBase[editForm.data.rol as keyof typeof salariosBase] || 0);
        }
    }, [editForm.data.rol]);

    function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!editTarget) return;
        editForm.put(`/empleados/${editTarget.id}`, {
            onSuccess: () => setEditTarget(null),
        });
    }

    // ── Eliminar Empleado ──
    const [deleteTarget, setDeleteTarget] = useState<Empleado | null>(null);
    const [deleting, setDeleting] = useState(false);

    function confirmDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        router.delete(`/empleados/${deleteTarget.id}`, {
            onSuccess: () => { setDeleteTarget(null); setDeleting(false); },
            onError: () => setDeleting(false),
        });
    }

    return (
        <PerfilLayout
            rolLabel="🏆 Administrador — Acceso Total"
            rolColor="border-blue-200 bg-blue-50 text-blue-600"
            title="Empleados"
            subtitle="Administración de empleados del gimnasio."
        >
            {/* ── Formulario Crear ── */}
            <form onSubmit={handleCreateSubmit} className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-lg font-semibold">Registrar empleado</h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={createForm.data.name}
                            onChange={e => createForm.setData('name', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {createForm.errors.name && (
                            <span className="mt-1 block text-xs text-red-500">{createForm.errors.name}</span>
                        )}
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={createForm.data.email}
                            onChange={e => createForm.setData('email', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {createForm.errors.email && (
                            <span className="mt-1 block text-xs text-red-500">{createForm.errors.email}</span>
                        )}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña de acceso"
                            value={createForm.data.password}
                            onChange={e => createForm.setData('password', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {createForm.errors.password && (
                            <span className="mt-1 block text-xs text-red-500">{createForm.errors.password}</span>
                        )}
                    </div>
                    <div>
                        <select
                            value={createForm.data.rol}
                            onChange={e => createForm.setData('rol', e.target.value as any)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white text-gray-700"
                        >
                            <option value="recepcionista">Recepcionista</option>
                            <option value="entrenador">Entrenador</option>
                            <option value="gerente">Gerente</option>
                        </select>
                        {createForm.errors.rol && (
                            <span className="mt-1 block text-xs text-red-500">{createForm.errors.rol}</span>
                        )}
                    </div>
                    <div>
                        <select
                            value={createForm.data.sucursal_id}
                            onChange={e => createForm.setData('sucursal_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white text-gray-700"
                        >
                            {sucursales.map(s => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                        {createForm.errors.sucursal_id && (
                            <span className="mt-1 block text-xs text-red-500">{createForm.errors.sucursal_id}</span>
                        )}
                    </div>
                </div>

                <button
                    disabled={createForm.processing}
                    className="mt-5 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                >
                    {createForm.processing ? 'Guardando...' : 'Guardar Empleado'}
                </button>
            </form>

            {/* 📱 1. VISTA MÓVIL */}
            <div className="space-y-4 md:hidden">
                <h3 className="text-base font-semibold text-gray-700 px-1 mb-2">Lista de empleados</h3>
                {empleados && empleados.length > 0 ? (
                    empleados.map((emp) => (
                        <div key={emp.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start gap-2">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-base leading-tight">{emp.nombre}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{emp.email}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize shrink-0 ${
                                    emp.rol === 'gerente' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                    emp.rol === 'entrenador' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                    'bg-blue-50 text-blue-700 border border-blue-100'
                                }`}>
                                    {emp.rol}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 text-xs">
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Sucursal</span>
                                    <span className="text-gray-700 font-medium">{emp.sucursal_nombre}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 font-medium mb-0.5">Salario Base</span>
                                    <span className="font-bold text-gray-900">
                                        ${Number(emp.salario).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                <button
                                    onClick={() => openEdit(emp)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-600 transition active:bg-blue-50 active:text-blue-500"
                                    title="Editar"
                                >
                                    <IconEdit />
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(emp)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-400 transition active:bg-red-50 active:text-red-500"
                                    title="Eliminar"
                                >
                                    <IconTrash />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
                        No hay empleados registrados en el staff.
                    </div>
                )}
            </div>

            {/* 💻 2. VISTA ESCRITORIO */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5 font-semibold">
                    Lista de empleados
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            {/* 🎯 Cambiamos las cabeceras para que coincida con el nuevo orden agrupado */}
                            <th className="p-5">Nombre / Email</th>
                            <th>Rol / Puesto</th>
                            <th>Sucursal</th>
                            <th>Salario Base</th>
                            <th className="pr-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleados && empleados.length > 0 ? (
                            empleados.map((emp) => (
                                <tr key={emp.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                                    {/* 🎯 CORREGIDO: Agrupamos Nombre y Email juntos en una sola celda */}
                                    <td className="p-5">
                                        <div className="font-medium text-gray-900">{emp.nombre}</div>
                                        <div className="text-xs text-gray-400 mt-0.5">{emp.email}</div>
                                    </td>
                                    <td>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                            emp.rol === 'gerente' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                            emp.rol === 'entrenador' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                            'bg-blue-50 text-blue-700 border border-blue-100'
                                        }`}>
                                            {emp.rol}
                                        </span>
                                    </td>
                                    <td className="text-gray-600">{emp.sucursal_nombre}</td>
                                    <td className="font-medium text-gray-900">
                                        ${Number(emp.salario).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="pr-5">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEdit(emp)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
                                                title="Editar"
                                            >
                                                <IconEdit />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(emp)}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                                title="Eliminar"
                                            >
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">
                                    No hay empleados registrados en el staff.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Modal Editar ── */}
            <Modal open={!!editTarget} onClose={() => setEditTarget(null)}>
                <h3 className="mb-5 text-lg font-semibold text-gray-800">Editar empleado</h3>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Nombre Completo</label>
                        <input
                            type="text"
                            value={editForm.data.name}
                            onChange={e => editForm.setData('name', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {editForm.errors.name && (
                            <span className="mt-1 block text-xs text-red-500">{editForm.errors.name}</span>
                        )}
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Correo Electrónico</label>
                        <input
                            type="email"
                            value={editForm.data.email}
                            onChange={e => editForm.setData('email', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {editForm.errors.email && (
                            <span className="mt-1 block text-xs text-red-500">{editForm.errors.email}</span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Puesto / Rol</label>
                            <select
                                value={editForm.data.rol}
                                onChange={e => editForm.setData('rol', e.target.value as any)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white"
                            >
                                <option value="recepcionista">Recepcionista</option>
                                <option value="entrenador">Entrenador</option>
                                <option value="gerente">Gerente</option>
                            </select>
                            {editForm.errors.rol && (
                                <span className="mt-1 block text-xs text-red-500">{editForm.errors.rol}</span>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">Sucursal</label>
                            <select
                                value={editForm.data.sucursal_id}
                                onChange={e => editForm.setData('sucursal_id', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400 bg-white"
                            >
                                {sucursales.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                            {editForm.errors.sucursal_id && (
                                <span className="mt-1 block text-xs text-red-500">{editForm.errors.sucursal_id}</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">Salario Mensual ($ MXN)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={editForm.data.salario}
                            onChange={e => editForm.setData('salario', parseFloat(e.target.value) || 0)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                            required
                        />
                        {editForm.errors.salario && (
                            <span className="mt-1 block text-xs text-red-500">{editForm.errors.salario}</span>
                        )}
                    </div>

                    <div>
                        <label className="mb-0.5 block text-xs font-medium text-gray-500">Nueva Contraseña</label>
                        <input
                            type="password"
                            placeholder="Dejar en blanco para no cambiar"
                            value={editForm.data.password}
                            onChange={e => editForm.setData('password', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
                        />
                        {editForm.errors.password && (
                            <span className="mt-1 block text-xs text-red-500">{editForm.errors.password}</span>
                        )}
                        <p className="mt-1 text-[11px] text-gray-400 leading-tight">
                            *Si escribes una clave aquí, reemplazará el acceso actual del empleado (Mín. 8 caracteres).
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setEditTarget(null)}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Modal Eliminar ── */}
            <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <IconTrash />
                </div>

                <h3 className="mb-1 text-lg font-semibold text-gray-800">Dar de baja empleado</h3>
                <p className="mb-6 text-sm text-gray-500">
                    ¿Estás seguro de que deseas dar de baja a{' '}
                    <span className="font-semibold text-gray-700">{deleteTarget?.nombre}</span>?
                    Se revocará inmediatamente su acceso y credenciales del sistema.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setDeleteTarget(null)}
                        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={confirmDelete}
                        disabled={deleting}
                        className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                    >
                        Eliminar
                    </button>
                </div>
            </Modal>
        </PerfilLayout>
    );
}