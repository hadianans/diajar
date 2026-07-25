import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import SuccessOverlay from '@/Components/features/auth/SuccessOverlay';

export default function Login({ status, canResetPassword }) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
            onSuccess: () => {
                setShowSuccess(true);
            },
        });
    };

    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden transition-colors duration-300">
            <Head title="Masuk" />

            {/* Glowing Accent Orbs in the background */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

            <main className="w-full max-w-[400px] flex flex-col items-center z-10">
                {/* Header Brand */}
                <header className="mb-8 text-center animate-fade-in">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-surface-container-high border border-outline-variant rounded-xl flex items-center justify-center shadow-md">
                            <img src="/logo.png" alt="Diajar Logo" className="w-8 h-8 object-contain" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">
                        Selamat Datang!
                    </h1>
                    <p className="text-sm text-on-surface-variant mt-1">
                        Masuk ke akun LMS anda
                    </p>
                </header>

                {/* Main Card */}
                <section className="relative group w-full bg-surface-container/70 backdrop-blur-xl border border-outline-variant p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-primary/5 hover:border-outline">
                    {/* Glow Border Accent at the top of the card */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/70 transition-all duration-500" />

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email / Username Field */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                    Alamat Email
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="alex.student@diajar.com"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-outline-variant focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder-outline text-sm text-on-surface"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-error mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                    Kata Sandi
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs text-primary hover:underline hover:text-primary/80 transition-colors"
                                    >
                                        Lupa?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-surface border border-outline-variant focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 placeholder-outline text-sm text-on-surface"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px] select-none align-middle">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-error mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <label className="flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-outline-variant bg-surface text-primary focus:ring-primary/20 w-4 h-4 transition-all cursor-pointer"
                                />
                                <span className="ml-2 text-xs font-medium text-on-surface-variant">
                                    Ingat saya
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-sm text-on-primary bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150 rounded-xl shadow-lg shadow-primary/15 hover:shadow-primary/25 cursor-pointer"
                        >
                            {processing ? (
                                <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Masuk
                                    <span className="material-symbols-outlined text-[18px]">login</span>
                                </>
                            )}
                        </button>
                    </form>
                </section>

                {/* Footer Credits */}
                <footer className="mt-8 text-center space-y-4 w-full animate-fade-in">
                    <p className="text-xs text-on-surface-variant">
                        Belum punya akun?{' '}
                        <a className="text-primary font-semibold hover:underline" href="#">
                            Hubungi administrator anda
                        </a>
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-xs text-outline">
                        <a className="hover:text-on-surface-variant transition-colors" href="#">
                            Kebijakan Privasi
                        </a>
                        <span className="w-1 h-1 bg-outline-variant rounded-full" />
                        <a className="hover:text-on-surface-variant transition-colors" href="#">
                            Ketentuan Layanan
                        </a>
                    </div>
                </footer>
            </main>

            <SuccessOverlay show={showSuccess} />
        </div>
    );
}
