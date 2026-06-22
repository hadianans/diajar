import React from 'react';
import RecommendedCard from '@/Components/features/student-dashboard/RecommendedCard';

export default function RecommendedCarousel({ courses = [], onSeeMoreClick, onCourseClick }) {
    return (
        <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Recommended
                </h3>
                {onSeeMoreClick && (
                    <button
                        onClick={onSeeMoreClick}
                        className="text-primary font-label-md text-label-md hover:underline font-semibold active:scale-95 transition-all duration-100"
                        type="button"
                    >
                        See more
                    </button>
                )}
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
                {courses.length === 0 ? (
                    <div className="p-6 text-center text-on-surface-variant bg-surface-container-lowest border border-outline-variant rounded-2xl w-full font-label-md">
                        No recommended courses.
                    </div>
                ) : (
                    courses.map((course) => (
                        <RecommendedCard
                            key={course.id}
                            subject={course.subject}
                            title={course.title}
                            duration={course.duration}
                            imageUrl={course.imageUrl}
                            onClick={() => onCourseClick && onCourseClick(course)}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
