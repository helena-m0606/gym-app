import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status }: Props) {
    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/TittanGYM.png"
                        alt="TitanGYM"
                        className="mx-auto h-24 w-auto"
                    />
                    <h1 className="text-3xl font-bold tracking-widest mt-3">
                        <span className="text-orange-500">TITAN</span>
                        <span className="text-gray-800"> GYM</span>
                    </h1>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h2 className="text-xl font-bold mb-1 text-gray-900">Iniciar sesión</h2>
                    <p className="text-gray-500 text-sm mb-6">Ingresa tus credenciales para continuar</p>

                    <Head title="Iniciar sesión" />

                    {status && (
                        <div className="mb-4 text-center text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-gray-700">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        placeholder="correo@ejemplo.com"
                                        className="rounded-xl text-gray-900"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="rounded-xl text-gray-900 [&_button]:opacity-100 [&_button:hover]:opacity-100"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox id="remember" name="remember" />
                                    <Label htmlFor="remember" className="text-sm text-gray-600">Recordarme</Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 font-semibold mt-2"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Iniciar sesión
                                </Button>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}

Login.layout = null;