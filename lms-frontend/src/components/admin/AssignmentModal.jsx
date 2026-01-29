import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../../services/employeeService';
import { courseService } from '../../services/courseService';
import Modal from '../common/Modal';

const AssignmentModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const { register, handleSubmit, reset } = useForm();

    const { data: employees } = useQuery({
        queryKey: ['employees'],
        queryFn: () => employeeService.getAll({ page_size: 100 }),
        enabled: isOpen
    });

    const { data: courses } = useQuery({
        queryKey: ['courses'],
        queryFn: () => courseService.getAll({ page_size: 100 }),
        enabled: isOpen
    });

    const onFormSubmit = (data) => {
        const payload = {
            course_id: data.course_id,
            employee_ids: [data.employee_id],
            due_date: data.due_date
        };
        onSubmit(payload);
    };

    const footer = (
        <>
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Cancel
            </button>
            <button
                form="assignment-form"
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light disabled:opacity-50 flex items-center transition-colors shadow-sm"
            >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Assign
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Assign Training"
            footer={footer}
        >
            <form id="assignment-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                    <select
                        {...register('course_id', { required: true })}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors bg-white"
                    >
                        <option value="">Select a course...</option>
                        {courses?.results?.map(course => (
                            <option key={course.id} value={course.id}>{course.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
                    <select
                        {...register('employee_id', { required: true })}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors bg-white"
                    >
                        <option value="">Select an employee...</option>
                        {employees?.results?.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                        {...register('due_date', { required: true })}
                        type="date"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default AssignmentModal;
