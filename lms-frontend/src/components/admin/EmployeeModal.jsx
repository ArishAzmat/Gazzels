import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from '../common/Modal';

const EmployeeModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('name', initialData.name);
                setValue('email', initialData.email);
                setValue('employee_code', initialData.employee_code);
                setValue('department', initialData.department);
                setValue('role', initialData.role);
            } else {
                reset();
            }
        }
    }, [isOpen, initialData, reset, setValue]);

    const handleFormSubmit = (data) => {
        onSubmit(data);
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
                // We use form="employee-form" to submit via footer button, or handle onClick manually. 
                // Since this is outside the form, let's use the form id approach or keep buttons inside form?
                // Generic Modal renders footer outside body. 
                // Let's trigger form submit cleanly.
                // A better approach for generic modal forms is to put buttons inside the form if they need to be type="submit".
                // BUT, simply adding form attribute matches the form id.
                form="employee-form"
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light disabled:opacity-50 flex items-center transition-colors shadow-sm"
            >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {initialData ? 'Update' : 'Create'}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Employee' : 'Add New Employee'}
            footer={footer}
        >
            <form id="employee-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        {...register('name', { required: true })}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        {...register('email', { required: true })}
                        type="email"
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors"
                        placeholder="john@example.com"
                    />
                </div>

                {!initialData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Min 8 chars'
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                        message: 'UpperCase, LowerCase & Number'
                                    }
                                })}
                                type="password"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors"
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                            <input
                                {...register('password_confirm', {
                                    required: 'Required',
                                    validate: (value) =>
                                        value === watch('password') || 'Mismatch'
                                })}
                                type="password"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors"
                            />
                            {errors.password_confirm && (
                                <p className="mt-1 text-xs text-red-600">{errors.password_confirm.message}</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code</label>
                        <input
                            {...register('employee_code', { required: true })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors"
                            placeholder="EMP-001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            {...register('role', { required: true })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors bg-white"
                        >
                            <option value="Employee">Employee</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                        {...register('department', { required: true })}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors bg-white"
                    >
                        <option value="">Select Department</option>
                        <option value="Production">Production</option>
                        <option value="Quality">Quality</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Logistics">Logistics</option>
                        <option value="IT">IT</option>
                    </select>
                </div>
            </form>
        </Modal>
    );
};

export default EmployeeModal;
