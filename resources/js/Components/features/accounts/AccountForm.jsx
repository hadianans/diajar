import React, { useState, useEffect } from 'react';
import RoleSelectCard from '@/Components/features/accounts/RoleSelectCard';
import AvatarUpload from '@/Components/features/accounts/AvatarUpload';
import Icon from '@/Components/shared/ui/Icon';

export default function AccountForm({ initialData = {}, isEdit = false, onSubmit, onCancel }) {
    // Form fields state
    const [role, setRole] = useState(initialData.role || 'admin');
    const [name, setName] = useState(initialData.name || '');
    const [username, setUsername] = useState(initialData.username || '');
    const [email, setEmail] = useState(initialData.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl || '');

    // Username checking state
    const [isUsernameChecking, setIsUsernameChecking] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

    // Password visibility state
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Simulated username checker
    useEffect(() => {
        if (username.length < 3) {
            setIsUsernameChecking(false);
            setIsUsernameAvailable(false);
            return;
        }

        setIsUsernameChecking(true);
        setIsUsernameAvailable(false);

        const timer = setTimeout(() => {
            setIsUsernameChecking(false);
            setIsUsernameAvailable(true);
        }, 800);

        return () => clearTimeout(timer);
    }, [username]);

    const handleGeneratePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let newPass = "";
        for (let i = 0; i < 12; i++) {
            newPass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(newPass);
        setConfirmPassword(newPass);
        setIsPasswordVisible(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (!name || !username || !email) {
            alert('Please fill out all required fields marked with *');
            return;
        }

        if (!isEdit && (password !== confirmPassword)) {
            alert('Passwords do not match');
            return;
        }

        if (onSubmit) {
            onSubmit({
                role,
                name,
                username,
                email,
                password,
                avatarUrl
            });
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-stack-lg max-w-xl mx-auto bg-white border border-outline-variant p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            {/* Header controls block */}
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30 mb-stack-md">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onCancel}
                        className="p-1.5 hover:bg-surface-container-low rounded-full transition-colors active:scale-95 duration-100 flex items-center justify-center border border-outline-variant/20 shadow-sm"
                        type="button"
                        title="Cancel"
                    >
                        <Icon name="close" className="text-on-surface-variant text-[20px]" />
                    </button>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight">
                        {isEdit ? 'Edit Account' : 'New Account'}
                    </h3>
                </div>
                <button
                    type="submit"
                    className="bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary px-6 py-2 rounded-full font-label-md text-label-md active:scale-95 transition-all shadow-md font-bold"
                >
                    Save
                </button>
            </div>

            {/* Role Select Grid */}
            <section>
                <h4 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider font-semibold">
                    Account Role
                </h4>
                <div className="grid grid-cols-1 gap-3">
                    <RoleSelectCard
                        title="Admin"
                        description="Full system control"
                        isSelected={role === 'admin'}
                        onClick={() => setRole('admin')}
                    />
                    <RoleSelectCard
                        title="Teacher"
                        description="Manage content & grade"
                        isSelected={role === 'teacher'}
                        onClick={() => setRole('teacher')}
                    />
                    <RoleSelectCard
                        title="Student"
                        description="Access courses & tasks"
                        isSelected={role === 'student'}
                        onClick={() => setRole('student')}
                    />
                </div>
            </section>

            {/* Profile Avatar Upload */}
            <section className="flex justify-center border-t border-b border-outline-variant/30 py-6 my-6">
                <AvatarUpload
                    avatarUrl={avatarUrl}
                    onUploadClick={() => {
                        const demoUrl = 'https://lh3.googleusercontent.com/a/default-user=s120';
                        setAvatarUrl(demoUrl);
                        alert('Demo Profile picture selected!');
                    }}
                />
            </section>

            {/* Basic Information Inputs */}
            <section className="space-y-stack-md">
                <h4 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider font-semibold">
                    Basic Info
                </h4>

                {/* Name */}
                <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                        Full Name *
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#F1F5F9] border-none rounded-xl p-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md focus:shadow-sm"
                        placeholder="e.g. Aditiya Wijaya"
                        type="text"
                        required
                    />
                </div>

                {/* Username */}
                <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                        Username *
                    </label>
                    <div className="relative">
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#F1F5F9] border-none rounded-xl p-4 pr-12 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md focus:shadow-sm"
                            placeholder="aditiya_w"
                            type="text"
                            required
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                            {isUsernameChecking && (
                                <Icon name="sync" className="text-primary animate-spin text-lg" />
                            )}
                            {isUsernameAvailable && !isUsernameChecking && (
                                <Icon name="check_circle" className="text-secondary text-lg fill-icon" style={{ fontVariationSettings: "'FILL' 1" }} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                        Email Address *
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#F1F5F9] border-none rounded-xl p-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md focus:shadow-sm"
                        placeholder="name@diajar.edu"
                        type="email"
                        required
                    />
                </div>
            </section>

            {/* Password Setup block */}
            <section className="pt-6 border-t border-outline-variant/30 space-y-stack-md">
                <h4 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                    Security
                </h4>

                {/* Password Field */}
                <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                        Password {isEdit && '(Optional)'}
                    </label>
                    <div className="relative">
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#F1F5F9] border-none rounded-xl p-4 pr-12 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md focus:shadow-sm"
                            placeholder="••••••••"
                            type={isPasswordVisible ? 'text' : 'password'}
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsPasswordVisible(!isPasswordVisible);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant active:scale-90 transition-transform p-1 hover:bg-surface-container-high rounded-full flex items-center justify-center"
                            type="button"
                        >
                            <Icon name={isPasswordVisible ? 'visibility_off' : 'visibility'} className="text-[20px]" />
                        </button>
                    </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                        Confirm Password
                    </label>
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#F1F5F9] border-none rounded-xl p-4 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md font-body-md focus:shadow-sm"
                        placeholder="••••••••"
                        type={isPasswordVisible ? 'text' : 'password'}
                    />
                </div>

                {/* Password Generator Button */}
                <button
                    onClick={handleGeneratePassword}
                    className="flex items-center gap-2 text-primary font-label-md text-label-md hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors w-fit active:scale-95 duration-100 font-semibold"
                    type="button"
                >
                    <Icon name="key" className="text-[18px]" />
                    <span>Generate Secure Password</span>
                </button>

                {/* Secure password note card */}
                <div className="bg-surface-container p-4 rounded-xl flex gap-3 items-start border border-primary/10 hover:border-primary/20 transition-all duration-300">
                    <Icon name="info" className="text-primary text-[20px] flex-shrink-0 mt-0.5" />
                    <p className="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
                        Note: Credentials are not automatically sent. Please ensure you share the password securely with the user after saving.
                    </p>
                </div>
            </section>
        </form>
    );
}
