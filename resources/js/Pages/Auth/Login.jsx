import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import LoginTemplate from '@/Components/shared/layout/LoginTemplate';
import BrandHeader from '@/Components/features/auth/BrandHeader';
import LoginForm from '@/Components/features/auth/LoginForm';
import LoginFooter from '@/Components/features/auth/LoginFooter';
import SuccessOverlay from '@/Components/features/auth/SuccessOverlay';

export default function Login({ status, canResetPassword }) {
    const [showSuccess, setShowSuccess] = useState(false);

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
        <>
            <Head title="Log in" />

            <LoginTemplate
                header={<BrandHeader title="Login" />}
                footer={<LoginFooter />}
                overlay={<SuccessOverlay show={showSuccess} />}
            >
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <LoginForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submit={submit}
                    canResetPassword={canResetPassword}
                />
            </LoginTemplate>
        </>
    );
}
