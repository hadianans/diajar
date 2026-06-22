import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function ActiveClassCard({ id, subject, subjectIcon, title, grade, studentsCount, year, additionalStudents, onAction }) {
    return (
        <section className="space-y-stack-sm">
            <h2 className="text-label-sm font-label-sm tracking-wider text-outline uppercase px-1">Active Class</h2>
            
            <div className="relative overflow-hidden rounded-2xl bg-primary-container text-on-primary-container p-6 shadow-lg border-2 border-primary group transition-all hover:translate-y-[-2px]">
                {/* Abstract background pattern */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                
                <div className="relative flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Icon name={subjectIcon} className="text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }} />
                            <span className="text-label-md font-label-md opacity-90">{subject}</span>
                        </div>
                        <h3 className="text-headline-md font-headline-md leading-tight">{title}</h3>
                        <div className="flex flex-col gap-0.5 opacity-80">
                            <span className="text-label-sm font-label-sm">{grade} • {studentsCount} Students</span>
                            <span className="text-label-sm font-label-sm italic">{year}</span>
                        </div>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Icon name="school" className="text-white text-3xl" />
                    </div>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {/* Mock Avatars */}
                        <div className="w-8 h-8 rounded-full border-2 border-primary-container overflow-hidden bg-surface">
                            <img className="w-full h-full object-cover" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMUubWX26UP0dtZOnkVeK8z1CfTzxB6CFiI99tBEOpHCw6glxZ5iKBlmWYxLKr808Feb7CfyjQQcCT4DGrxDN-d6WShU9MnXjDRhmZsqtmDJSNaIoiGCgyYds5ZMBEY6nuhK5S1wr_5f5Ig5dZW3cHCw06DrdtiG5ldhmTKhw0tZi8TKWO7evBJDFwVuQDJ3JL_Z5U4_AWls94n3JlkOBvmNjGrxVJMfbwwpr1TWGpGe9qoXkP6wVoVcTu6L-TiFy38NivEn5UP2Q" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-primary-container overflow-hidden bg-surface">
                            <img className="w-full h-full object-cover" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4ue0NT0Uh5l7jCrOlOwANGcT70bYWV8Y-YF5zBm27dvA-Iqi2MBiSXryjT3OUPMGk-wySfNI9pgUN47PcO53YBow3Da2bOn9p3AjY5jSQ-2sEipH6L-28_GOk9ra5uFNe49PbPdJM9sN3IfchG1ALez7fND5RWzEro3Fe9c-pxJj-_dB_xzNQcBM87KqDx1koIXS7dlf4_9QXV8db64tqapDWYwjTXZNqnvKeoblIUnOz0Wb1LSXuQWlQFIdjkBC-mesrnZqPgw4" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-primary-container overflow-hidden bg-surface">
                            <img className="w-full h-full object-cover" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCsPI82YkJmU0QCXxElTqt8O7U-joXRCRqEqGWT2YEeceetQUQLe4vJHUgMnrg20NVSVZsb138ivaeqX5ftUD7bsiABQ_HnaJ1hHxtmPuda39O0FoDR3JwDgGKIdMHouFIefWyhNI4TEn7YPHHwAQz6QC8UTqgkfjmD2-hruxJoGiAYdxDesRGG0G-_hAyETbxJk3OtG0_focav2f3pPoeO91DrzDmGjNCWD1u6aWHuEAZ70jKg2TvC-VktOCTu4JhsXYChannZK4" />
                        </div>
                        {additionalStudents > 0 && (
                            <div className="w-8 h-8 rounded-full border-2 border-primary-container bg-primary-fixed-dim flex items-center justify-center text-[10px] font-bold text-primary">
                                +{additionalStudents}
                            </div>
                        )}
                    </div>
                    
                    <Link 
                        href={route('teacher.classes.show', id)}
                        className="bg-white text-primary px-6 py-2.5 rounded-xl font-label-md text-label-md shadow-md active:scale-95 transition-transform inline-block text-center"
                    >
                        View Class
                    </Link>
                </div>
            </div>
        </section>
    );
}
