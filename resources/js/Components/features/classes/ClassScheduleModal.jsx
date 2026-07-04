import React, { useState, useEffect } from 'react';
import Modal from '@/Components/shared/ui/Modal';
import Icon from '@/Components/shared/ui/Icon';
import api from '@/utils/api';

const days = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
];

export default function ClassScheduleModal({ show, onClose, classId, currentDay, currentTime, onSuccess }) {
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            setDay(currentDay !== null && currentDay !== undefined ? currentDay : '');
            setTime(currentTime ? currentTime.substring(0, 5) : '');
        }
    }, [show, currentDay, currentTime]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.patch(`/classes/${classId}/schedule`, {
                day_schedule: parseInt(day),
                time_schedule: time
            });
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update schedule.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onClose={loading ? undefined : onClose} maxWidth="sm">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-title-lg font-title-lg font-bold text-on-surface">
                        Update Class Schedule
                    </h3>
                    <button onClick={onClose} disabled={loading} className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
                        <Icon name="close" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-on-surface-variant">Day of Week</label>
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            required
                            className="p-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select a day</option>
                            {days.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-label-md text-on-surface-variant">Time (HH:MM)</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            required
                            className="p-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="mt-6 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-5 py-2.5 rounded-xl font-label-md text-label-md hover:bg-surface-variant text-on-surface transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || day === '' || time === ''}
                            className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
