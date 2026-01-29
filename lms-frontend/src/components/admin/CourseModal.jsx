import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import Modal from '../common/Modal';

const CourseModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
    const { register, control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            lessons: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "lessons"
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('title', initialData.title);
                setValue('description', initialData.description);
                setValue('category', initialData.category);
                setValue('duration_minutes', initialData.duration_minutes);
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
                form="course-form"
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light disabled:opacity-50 flex items-center transition-colors shadow-sm"
            >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {initialData ? 'Update Course' : 'Create Course'}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Course' : 'Create New Course'}
            footer={footer}
            size="xl"

        >
            <form id="course-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                        <input
                            {...register('title', { required: true })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            {...register('category', { required: true })}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors bg-white"
                        >
                            <option value="">Select Category</option>
                            <option value="Safety">Safety</option>
                            <option value="Technical">Technical</option>
                            <option value="Quality">Quality</option>
                            <option value="Process">Process</option>
                            <option value="Soft Skills">Soft Skills</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                        <input
                            {...register('duration_minutes', { required: true, min: 1 })}
                            type="number"
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2.5 transition-colors"
                        />
                    </div>
                </div>

                {!initialData && (
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Lessons</h3>
                            <button
                                type="button"
                                onClick={() => append({ title: '', content: '', duration_minutes: 15, order: fields.length + 1 })}
                                className="flex items-center px-3 py-1.5 text-sm text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Lesson
                            </button>
                        </div>

                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <span className="mt-2 text-sm font-bold text-gray-400">{index + 1}.</span>
                                    <div className="flex-1 space-y-3">
                                        <input
                                            {...register(`lessons.${index}.title`, { required: true })}
                                            placeholder="Lesson Title"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                        />
                                        <textarea
                                            {...register(`lessons.${index}.content`)}
                                            placeholder="Lesson Content"
                                            rows={2}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                        />
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-gray-500">Duration:</label>
                                            <input
                                                {...register(`lessons.${index}.duration_minutes`, { required: true, min: 1 })}
                                                type="number"
                                                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                            />
                                            <span className="text-xs text-gray-500">mins</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-gray-400 hover:text-red-500 mt-2 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
};

export default CourseModal;
