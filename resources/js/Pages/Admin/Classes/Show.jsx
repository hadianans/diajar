import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ClassSummaryCard from '@/Components/features/classes/ClassSummaryCard';
import LinkedCohortCard from '@/Components/features/classes/LinkedCohortCard';
import StudentsAccessCard from '@/Components/features/classes/StudentsAccessCard';
import Icon from '@/Components/shared/ui/Icon';

const mockStudents = [
    { id: 1, name: 'Alex Rivers', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUcVRJDRmWT4STza-5TElW43iIbVaHxGi1nrqtXymFE9Trwov29yA85UW9kyHD4Ui5e2HJD1k2GEcVTQSYqeG38nGc1ByncQhlPRhuflF_rxRbScEtFqO2e-AR5A2_qRLdKKt_WZbIioAXZgOeAExyceIDkZRoWLWKsb5V_jyb6z0wPqW0Zoej737dmWeTrvwvYyZGg5tG0hf6RghvzxJIeLuPfCnaCeM6abYs-hfVSmnInEPDjU1nsKYvAPRuUCOPO70rCfes7jM' },
    { id: 2, name: 'Sarah Miller', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDum2ERHBnbC0qCGCIMa2Ywayt8hRYVGmoHvzAl_pmyQbbcrCOMTUZLkErPfby8HSdgxB4jR6x_6_FJlBFEBlq0qgD6bLkZAfZ9ljxK1FrDCyY7fFr3GDP5kQNYH-wVv8wiRdJlF4rM078zxSytDBhgDY2pfsBbSn0Nl_k_ArtWSNcttxzzlN7r72rWCLKNbyXt3kqxgdCgaGHUXiaLoLDOs9CbvTlPr1znrQDONxKGT9Yd8y05GqnntLUag5KIvXxjoj_ioDwTZnQ' },
    { id: 3, name: 'Julian Chen', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWnjqjNSkrIoup0DrtN2k-5V3cj2da0mDmimBJE05W4Xf4CImYpcimvD9-at8wrVp0GL_GGFoxHaZS-8h_MD9YzrTlvvHUtohwn-ehX9AyAnhp0OJPi0lEFTbDRj4Tu0NuTneDlzGej5LcW17iuEAtx4vx0QeBvWL-CCDcAuFBSf7B33uIdx3ohB2V-MIjs_n2twvcwKB8Z2_Kt0ef1M8p1U2uoYP1xc4K4zktLk2kno2Pb8nH8NEhEMDMWznA-9KiW-IihTNu-us' },
    { id: 4, name: 'Elena Rodriguez', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLkUUDwRMn-lKB4Ws4MA4TbWSeS32yz8fSvuqARdNDJAiNiCdCutlCsj9DOfUl0Y2sGK_F_Bnh-z7lVRAOlXvROJtEpjHoRueMGZW42L_xn5URosXcZwqBztRQve_PBcHumeloe8U-18XxA-NGXYNgF9PkExIKFWfZDPBgRi4fpVDZmWoAFO-oHYaFnlyuMBLNunIHDAumK2yLsPwunaf6tSLNTzkV8Gb7dyneLcMPFMMwHcZcb0JB6s24ih-PC7ZhruY_P4rxNtU' },
    { id: 5, name: 'Mark Thompson', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPzpaHb7flOEattXzyAv2d0cJc7jxhiaCFTeDL1LJjOw3r1z572WsfMsZa3jmr9UyY0X1-UbKuDQVthPBpc4SufaI8zDdasQgikqPI7KNFq6DUs1QCZ2Fb99yl59P6sz0J0k8Kw7L6LZm43WoCBxVzI8e5E4iNmqgDW_HLmWdjEYVasFsAGBAHmvfrB7O2WKSD4AdDNLuvwKP8DW1pDbmrUEIYFCN6_UlVqrrRBCCcF4LVx0tvS-fa0p8v2wZTqX-T8Zg0gIqlBe8' },
    { id: 6, name: 'Lily Watson', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk2bGft0myk1il4JjMUjt375LuHlK_oewDKj1WzW2ijmWCmxE28r79ei3tQ9mZa8TmHbUOWhsWAc9j6NQuTNNKsZnhI5or2SylsqjFK0IPfoacpLdWBYNzxm8epRUFjarCauryGFE-NIPCyH8PC1tUGLMuTChQGMgV69xO-Q0AEjEyP6GMSiaxAS09PUER7LVTRCfruI3zUR5QtAjEazOBEC2l3i_Ioz5KcV_CsinEGIn-2KcGOd1XtM-84XVt8eguzFeqrleW6js' },
    { id: 7, name: 'David Kim', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiyrgca4IrVEAqogj9qoiB-zuTUOGGafWK73aBZC5iX_SMleJvf1bQt_K0tLLzSEWkWBACDrq3Hnzmn4V4ULA6ZBGlUbOgwbrjZkadNHcpVcmJYLqJniHK7SABWXa_H0Z7UNCdeWCuYDwZHZJ2IZos1Jtc82-jpZbiePout2Zn13dhs4Wv0tdzMbSW-G3FjEUmQyZAsiffy-rAe-G8pteo5gl3dFWiWBU5OLaWAY2bn5uI6_vI6qXlBaf6ttxvXb2Sux_NhouWo6w' },
    { id: 8, name: 'Aisha Khan', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqz-1gvUkKKoUcGWaIqS1C4ZqxYzxZXxrjZSRpNIr_UZKnY69HPJpWd9zMeywdJA1UNOYXO3B9t6Ex04kL2QnWzjKeBy_uaJnyhv5t6d840zPuK-JRRCM3Nnk_E9xWcLGxPXih6C5q7qwgMfzWnsX_jFeE3X9ae1DKyo17I08v4eAqlSyqj12bT5ROEOLzwJ-qjKupAne1RJZQAmogJRrFL_YkXT5iKFkkCH25opUl8mMGDLv9P9Hm34SkhnrdjZ7DLtaVRHRQa4E' }
];

export default function Show({ classId }) {
    // Presentation roles switcher states
    const [selectedRole, setSelectedRole] = useState('admin');
    const [activeTab, setActiveTab] = useState('Academic');

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        if (role === 'admin') {
            setActiveTab('Academic');
        } else if (role === 'teacher') {
            setActiveTab('Class');
        } else {
            setActiveTab('Dashboard');
        }
    };

    const viewLabelMap = {
        admin: 'Admin View',
        teacher: 'Teacher View',
        student: 'Student View',
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleActionClick = (actionName) => {
        alert(`Initiated action: ${actionName} flow...`);
    };

    // Hero title info card
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Interactive demo role nav switcher */}
            <div className="p-4 bg-surface-container-low border border-outline-variant rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                        Interactive Demo Mode (Switch Navbars)
                    </span>
                    <p className="text-sm text-on-surface">Toggle role menus layout to check customized views:</p>
                </div>
                <div className="flex gap-2">
                    {['admin', 'teacher', 'student'].map((r) => (
                        <button
                            key={r}
                            onClick={() => handleRoleChange(r)}
                            className={`px-4 py-2 rounded-lg font-label-sm text-xs capitalize transition-all border ${
                                selectedRole === r
                                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
                             }`}
                            type="button"
                        >
                            {r} Navbar
                        </button>
                    ))}
                </div>
            </div>

            {/* Hero details */}
            <div className="flex flex-col gap-2">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background font-extrabold tracking-tight">
                    Biology — Grade 11A
                </h2>
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md font-bold">
                        2024/2025 Academic Year
                    </span>
                    <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md flex items-center gap-1 font-bold">
                        <Icon name="check_circle" className="text-[16px] fill-icon" style={{ fontVariationSettings: "'FILL' 1" }} />
                        Fully Configured
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title={`Class Configuration - Biology 11A`} />

            <DashboardTemplate
                role={selectedRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="Class Configuration"
                viewLabel={viewLabelMap[selectedRole]}
                showBack={true}
                onBack={handleBack}
                headerSection={headerSection}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                    {/* Left Column: Summary and Group Card */}
                    <div className="md:col-span-7 flex flex-col gap-gutter">
                        <ClassSummaryCard
                            subject="Biology"
                            teacher="Prof. Anderson"
                            schedule="Mon, Wed • 09:00 AM"
                            academicYear="2024/2025"
                            onEditScheduleClick={() => handleActionClick('Edit Schedule')}
                        />

                        <LinkedCohortCard
                            cohortName="11A - Grade 11"
                            activeStudentsCount={22}
                            onChangeGroupClick={() => handleActionClick('Change Student Group')}
                            onCohortClick={() => handleActionClick('View Student Group Details')}
                        />
                    </div>

                    {/* Right Column: Students Preview Box */}
                    <div className="md:col-span-5">
                        <StudentsAccessCard
                            students={mockStudents}
                            onViewAllClick={() => handleActionClick('View All Access Students')}
                            onStudentClick={(s) => handleActionClick(`View Student Profile details for ${s.name}`)}
                        />
                    </div>
                </div>

                {/* Destructive zone */}
                <footer className="mt-stack-lg pt-stack-lg border-t border-outline-variant flex justify-center w-full">
                    <button
                        onClick={() => {
                            if (confirm('DANGER: This action cannot be undone. All class data, logs, and configurations for Biology Grade 11A will be permanently deleted. Are you absolutely sure?')) {
                                handleActionClick('Delete Class');
                            }
                        }}
                        className="px-8 py-3 rounded-xl border border-error text-error font-headline-md text-headline-md hover:bg-error-container/10 transition-all active:scale-95 flex items-center gap-2 font-bold"
                        type="button"
                    >
                        <Icon name="delete_forever" className="text-[22px]" />
                        <span>Delete Class</span>
                    </button>
                </footer>
            </DashboardTemplate>
        </>
    );
}
