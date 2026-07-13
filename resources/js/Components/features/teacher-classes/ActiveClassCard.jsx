import React from 'react';
import { Link } from '@inertiajs/react';
import Icon from '@/Components/shared/ui/Icon';

export default function ActiveClassCard({ id, groupId, subject, subjectIcon, title, grade, studentsCount, year, additionalStudents, onAction }) {
    return (
        <section className="space-y-stack-sm">
            <h2 className="text-label-sm font-label-sm tracking-wider text-outline uppercase px-1">Active Class</h2>
            
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant hover:border-primary/50 hover:shadow-md group transition-all">
                {/* Subtle top accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-tertiary opacity-80"></div>
                
                <div className="relative flex justify-between items-start">
                    <div className="space-y-1.5 w-full">
                        <h3 className="text-headline-md font-headline-md leading-tight text-on-surface pr-2">{title}</h3>
                        <div className="flex items-center gap-1.5 text-on-surface-variant">
                            <Icon name={subjectIcon} className="text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }} />
                            <span className="text-label-md font-label-md font-medium">{subject}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-on-surface-variant/80 pt-2">
                            <span className="text-label-sm font-label-sm">{grade} • {studentsCount} Students</span>
                            <span className="text-label-sm font-label-sm italic">{year}</span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {/* Mock Avatars */}
                        <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-surface-container shadow-sm">
                            <img className="w-full h-full object-cover" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMUubWX26UP0dtZOnkVeK8z1CfTzxB6CFiI99tBEOpHCw6glxZ5iKBlmWYxLKr808Feb7CfyjQQcCT4DGrxDN-d6WShU9MnXjDRhmZsqtmDJSNaIoiGCgyYds5ZMBEY6nuhK5S1wr_5f5Ig5dZW3cHCw06DrdtiG5ldhmTKhw0tZi8TKWO7evBJDFwVuQDJ3JL_Z5U4_AWls94n3JlkOBvmNjGrxVJMfbwwpr1TWGpGe9qoXkP6wVoVcTu6L-TiFy38NivEn5UP2Q" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-surface-container shadow-sm">
                            <img className="w-full h-full object-cover" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4ue0NT0Uh5l7jCrOlOwANGcT70bYWV8Y-YF5zBm27dvA-Iqi2MBiSXryjT3OUPMGk-wySfNI9pgUN47PcO53YBow3Da2bOn9p3AjY5jSQ-2sEipH6L-28_GOk9ra5uFNe49PbPdJM9sN3IfchG1ALez7fND5RWzEro3Fe9c-pxJj-_dB_xzNQcBM87KqDx1koIXS7dlf4_9QXV8db64tqapDWYwjTXZNqnvKeoblIUnOz0Wb1LSXuQWlQFIdjkBC-mesrnZqPgw4" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-surface-container shadow-sm">
                            <img className="w-full h-full object-cover" alt="Student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCsPI82YkJmU0QCXxElTqt8O7U-joXRCRqEqGWT2YEeceetQUQLe4vJHUgMnrg20NVSVZsb138ivaeqX5ftUD7bsiABQ_HnaJ1hHxtmPuda39O0FoDR3JwDgGKIdMHouFIefWyhNI4TEn7YPHHwAQz6QC8UTqgkfjmD2-hruxJoGiAYdxDesRGG0G-_hAyETbxJk3OtG0_focav2f3pPoeO91DrzDmGjNCWD1u6aWHuEAZ70jKg2TvC-VktOCTu4JhsXYChannZK4" />
                        </div>
                        {additionalStudents > 0 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-variant flex items-center justify-center text-[10px] font-bold text-on-surface-variant shadow-sm z-10">
                                +{additionalStudents}
                            </div>
                        )}
                    </div>
                    
                    <Link 
                        href={`/teacher/classes/${id}${groupId ? `?group_id=${groupId}` : ''}`}
                        className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-5 py-2 rounded-xl font-label-md text-label-md transition-colors active:scale-95 inline-block text-center font-bold"
                    >
                        View Class
                    </Link>
                </div>
            </div>
        </section>
    );
}
