import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../../services/courseService';
import { Plus, Search, Edit2, Trash2, Loader2, BookOpen, Clock } from 'lucide-react';
import CourseModal from '../../components/admin/CourseModal';

const Courses = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['courses', search],
        queryFn: () => courseService.getAll({ search }),
    });

    const createMutation = useMutation({
        mutationFn: courseService.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['courses']);
            setIsModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => courseService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['courses']);
            setIsModalOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: courseService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['courses']);
        },
    });

    const handleSubmit = (data) => {
        if (selectedCourse) {
            updateMutation.mutate({ id: selectedCourse.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleAdd = () => {
        setSelectedCourse(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                <button
                    onClick={handleAdd}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Course
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-primary/20 focus:border-primary transition-all hover:border-gray-300"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.results?.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                                        {course.category}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(course)} className="text-gray-400 hover:text-primary transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(course.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-50 pt-4">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                                        {course.duration_minutes} mins
                                    </div>
                                    <div className="flex items-center">
                                        <BookOpen className="w-4 h-4 mr-1 text-gray-400" />
                                        {course.lessons?.length || 0} Lessons
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <CourseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedCourse}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default Courses;
