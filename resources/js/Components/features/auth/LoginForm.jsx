import React from 'react';
import FormField from '@/Components/features/auth/FormField';
import RememberMe from '@/Components/features/auth/RememberMe';
import Button from '@/Components/shared/ui/Button';
import Icon from '@/Components/shared/ui/Icon';
import { Link } from '@inertiajs/react';

export default function LoginForm({
    data,
    setData,
    errors,
    processing,
    submit,
    canResetPassword,
}) {
    return (
        <form onSubmit={submit} className="space-y-md">
            <FormField
                label="Email or Username"
                id="email"
                type="email"
                placeholder="e.g. alex.student@diajar.com"
                required
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={errors.email}
                autoComplete="username"
                isFocused
            />

            <FormField
                label="Password"
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                error={errors.password}
                autoComplete="current-password"
                headerAction={
                    canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="font-label-sm text-label-sm text-primary hover:underline transition-all"
                        >
                            Forgot Password?
                        </Link>
                    )
                }
            />

            <RememberMe
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
            />

            <Button type="submit" disabled={processing}>
                Sign In
                <Icon name="login" className="text-[18px]" />
            </Button>
        </form>
    );
}
