import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DashboardTemplate from '@/Components/shared/layout/DashboardTemplate';
import ContinueLearningCard from '@/Components/features/student-dashboard/ContinueLearningCard';
import ProgressRing from '@/Components/features/student-dashboard/ProgressRing';
import UpcomingDeadlines from '@/Components/features/student-dashboard/UpcomingDeadlines';
import TargetsBox from '@/Components/features/student-dashboard/TargetsBox';
import SavedLaterBox from '@/Components/features/student-dashboard/SavedLaterBox';
import RecommendedCarousel from '@/Components/features/student-dashboard/RecommendedCarousel';
import Icon from '@/Components/shared/ui/Icon';

const mockDeadlines = [
    { id: 1, title: 'Calculus Quiz', type: 'Assignment', dueDate: 'Due Tomorrow', icon: 'event_upcoming', badgeBgClass: 'bg-error-container text-on-error-container' },
    { id: 2, title: 'Midterm Physics', type: 'Assessment', dueDate: 'Oct 24', icon: 'school', badgeBgClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' }
];

const mockTargets = [
    { id: 1, text: 'Complete Chemistry Module', isCompleted: true },
    { id: 2, text: 'Read Chapter 5: Genetics', isCompleted: false },
    { id: 3, text: 'Practice Differentiation Problems', isCompleted: false }
];

const mockSaved = [
    { id: 1, title: 'Lab Experiment', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1sB5WI2jMu_Tg7Nio5WWfyn2BLFNfmISpraveCd-3PaK3jjPmP3JnkS1eXFuBuz2awuMQfqmokALVJWyWukxJ-uALRKu0ggTUC0CUOKz_WCzsKhzRm-AfWOxupzzftGWRTqkDDThiyIw75LKZIT01FX2SLo6fIILRohpsXDkisww9ZECYfRn9RUbfJDVMRB-45OmqWQ-p_qjZD5SRxbw9_EExsGeKTvlzmIT9sn3x2qyILjW3buM-afya3qQKc3_3ZU5BYF8X4aE', altText: 'Lab' },
    { id: 2, title: 'Math Workspace', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJgpZISohppUELjuQFhFMuekKWHv-NvgXph3cF7KL9wzbmoJaJgltklY7UzLdxEyzHd4lh3evgwgUS-S24iXDZi9InBBjRV94gb9f5_ZUpFLtlXJmui-gRbdiywQvVjk34ZISrHUyl_nUA8mlxv8dc6-YTHvi_cOrzyNsZk7j0kZVRREyk2u0wChkzIWauz9KYHe93OMdpenuBrW9lL3juJMLxA8VWry3ar2XiFY7Qp-llhdtJ08x1RxPTKyFce8JJa4sIK2mul5Q', altText: 'Math' }
];

const mockCourses = [
    { id: 1, subject: 'Mathematics', title: 'Intro to Calculus', duration: '12h total', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUjPvXGaSr53Gd1q2UT9Z1b1JhpL9oPmyvFHkCz-0naK_8XD69ExnnUIamr42HtOWZmldSHayEQl41zo8n0UE3pHT4sXBt06BspERE-aW7teJqxFjlRHl5Tno8oA-dO5gXR7lzDfMNqEs05wFD0OQBiIHYL6MMIOEhCR7FMgd5uZNo9KeJ4C6K5gB07Dnpikf55aaGIS6gwRrpqTC8JsQK6ARq3fg3TxarJAyXr-7ueiiYiKbKatFoBhvwI68Gw8ti9fFeO6mSJrg' },
    { id: 2, subject: 'History', title: 'World History II', duration: '8h total', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxyQ2jGPiLUCR-ZqpF_2VS5EfO0FX_2GaLyfvELeVW0gfX4i4maeldUdjS9J_u_pzwJWiNRziNguO5pP4CQzQqHdYoCx_rCHvYX_UekF50NoBwfv3_F_NrzgQ73hoRBLA8exHMtNvHaw8Vk2SCzgDZX2F-GJZV-queYtjEsLRMgEtuFp8JtlNyV0r9WT1C0I5QJ5diks82Gqmgw9K16VC-CRiqLOmXhot1bS9CJQUY9uSX4Yzr8FtSf0xEJP2mteCgDh2eR21WYDw' }
];

const studentAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6Rf5DaR4Wze9X-HL9US2EQyGjzGe2LngYff-rVObk0a3J9256T9d5aXr6DPKoyNo2EXdEd9g7yNwJYaqnq8zzFHBCDtqtmGYCO09ZdTav-S8d_dT9LIOsJfD1BIYnWEqivVwQYTB1X7WcDRi_JaCRFgVcmgf8A2aT7T2aAycM9o5gbvttoLotgpl2Mfan6gfA_j53aMExPEwcV43HmuFx96lW7eEwMnjS4eJN86oIh6ZLE_cmE6o5v-Jm6p5LkHB6xnbIsylQ6T0';

export default function Homepage() {
    // Presentation role selector
    const [selectedRole, setSelectedRole] = useState('student');
    const [activeTab, setActiveTab] = useState('Home');
    const [greeting, setGreeting] = useState('Hi');

    // Dynamic greeting based on clock
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        if (role === 'admin') {
            setActiveTab('Dashboard');
        } else if (role === 'teacher') {
            setActiveTab('Home');
        } else {
            setActiveTab('Home');
        }
    };

    const viewLabelMap = {
        admin: 'Admin View',
        teacher: 'Teacher View',
        student: 'Student View',
    };

    const handleActionClick = (actionName) => {
        alert(`Initiated action: ${actionName} flow...`);
    };

    // Header switcher and welcome greeting details
    const headerSection = (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Interactive demo mode switcher */}
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

            {/* Greeting */}
            <div className="flex justify-between items-center bg-white border border-outline-variant/40 rounded-2xl p-4 shadow-sm">
                <div>
                    <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-extrabold tracking-tight">
                        {greeting}, Alex!
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Grade 11 — Science A
                    </p>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-fixed flex-shrink-0">
                    <img
                        className="w-full h-full object-cover"
                        src={studentAvatar}
                        alt="Student Avatar Profile"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Diajar LMS - Home" />

            <DashboardTemplate
                role={selectedRole}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                title="Diajar LMS"
                viewLabel={viewLabelMap[selectedRole]}
                showBack={false}
                headerSection={headerSection}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
                    {/* Left Column: Course Cards, Actions, Deadlines, Suggestions */}
                    <div className="lg:col-span-8 flex flex-col gap-stack-lg">
                        
                        {/* Continue Learning card widget */}
                        <ContinueLearningCard
                            subject="Biology"
                            title="Photosynthesis Deep Dive"
                            type="Video Lesson"
                            progress={65}
                            onContinueClick={() => handleActionClick('Continue Biology Video Lesson')}
                        />

                        {/* Assignments and Assessments Action cells */}
                        <section className="grid grid-cols-2 gap-gutter">
                            <button
                                onClick={() => handleActionClick('Open Assignments list')}
                                className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl active:scale-[0.98] transition-all hover:shadow-md hover:bg-surface-container-low text-left w-full shadow-sm"
                                type="button"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container flex-shrink-0">
                                    <Icon name="assignment" className="text-[20px]" />
                                </div>
                                <span className="font-label-md text-label-md text-on-surface font-bold">
                                    Assignments
                                </span>
                            </button>

                            <button
                                onClick={() => handleActionClick('Open Assessments list')}
                                className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl active:scale-[0.98] transition-all hover:shadow-md hover:bg-surface-container-low text-left w-full shadow-sm"
                                type="button"
                            >
                                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0">
                                    <Icon name="quiz" className="text-[20px]" />
                                </div>
                                <span className="font-label-md text-label-md text-on-surface font-bold">
                                    Assessments
                                </span>
                            </button>
                        </section>

                        {/* Upcoming deadlines list */}
                        <UpcomingDeadlines
                            deadlines={mockDeadlines}
                            onDeadlineClick={(deadline) => handleActionClick(`View Deadline for ${deadline.title}`)}
                        />

                        {/* Suggestions slider */}
                        <RecommendedCarousel
                            courses={mockCourses}
                            onSeeMoreClick={() => handleActionClick('Open Course Recommendations Directory')}
                            onCourseClick={(course) => handleActionClick(`View Course Details for ${course.title}`)}
                        />

                    </div>

                    {/* Right Column: Progress Rings, Targets, and Bookmarks */}
                    <div className="lg:col-span-4 flex flex-col gap-stack-lg">
                        
                        {/* Overall Progress rings summary container */}
                        <section className="bg-surface-container-low rounded-[24px] p-6 border border-outline-variant hover:shadow-md transition-shadow duration-300">
                            <h3 className="font-headline-md text-headline-md text-on-surface mb-6 font-bold">
                                Learning Progress
                            </h3>
                            <div className="flex justify-around items-center gap-2">
                                <ProgressRing percentage={80} label="Materials" colorClass="text-primary" />
                                <ProgressRing percentage={45} label="Homework" colorClass="text-secondary" />
                                <ProgressRing percentage={20} label="Tests" colorClass="text-tertiary" />
                            </div>
                        </section>

                        {/* Targets interactive checklist */}
                        <TargetsBox
                            initialTargets={mockTargets}
                            onViewAllClick={() => handleActionClick('View All Targets')}
                        />

                        {/* Bookmark cells */}
                        <SavedLaterBox
                            savedItems={mockSaved}
                            onAddNewClick={() => handleActionClick('Add Bookmarked Item')}
                            onItemClick={(item) => handleActionClick(`Open Bookmarked Item ${item.title}`)}
                        />

                    </div>
                </div>

                {/* Mobile floating quick add button */}
                <button
                    onClick={() => handleActionClick('Quick Add Action')}
                    className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-xl flex items-center justify-center active:scale-95 transition-transform hover:bg-primary/95 z-40"
                    type="button"
                    title="Quick Add"
                >
                    <Icon name="add" className="text-2xl text-white" />
                </button>
            </DashboardTemplate>
        </>
    );
}
