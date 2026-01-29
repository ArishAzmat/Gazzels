import { useQuery } from '@tanstack/react-query';
import { assignmentService } from '../../services/assignmentService';
import { BookOpen, Clock, CheckCircle, PlayCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery({
        queryKey: ['my-assignments'],
        queryFn: () => assignmentService.getMyAssignments(),
    });

    const getStatusBadge = (status) => {
        const config = {
            'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'InProgress': 'bg-primary/5 text-primary border-primary/10',
            'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
            'Overdue': 'bg-red-50 text-red-700 border-red-100',
        };
        return config[status] || 'bg-gray-50 text-gray-700 border-gray-100';
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-primary tracking-tight">My Trainings</h1>
                <p className="text-secondary font-medium mt-1">Keep track of your assigned courses and certifications.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20 bg-white/50 rounded-2xl border border-dashed border-gray-200">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data?.results?.map((assignment) => (
                        <div key={assignment.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${getStatusBadge(assignment.status)}`}>
                                        {assignment.status}
                                    </span>
                                    <div className="flex items-center text-xs text-secondary font-medium">
                                        <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                        {assignment.course.duration_minutes} mins
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-primary-light transition-colors line-clamp-1">
                                    {assignment.course.title}
                                </h3>
                                <p className="text-secondary text-sm mb-6 line-clamp-2 font-medium">
                                    {assignment.course.description}
                                </p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-secondary uppercase tracking-tight">Progress</span>
                                        <span className="text-primary">{assignment.progress_percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(44,62,80,0.3)]"
                                            style={{ width: `${assignment.progress_percentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                                    <span className="text-xs text-secondary font-medium italic">
                                        Due {new Date(assignment.due_date).toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => navigate(`/course/${assignment.id}`)}
                                        className="inline-flex items-center px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-light transition-all shadow-sm hover:shadow-md"
                                    >
                                        <PlayCircle className="w-4 h-4 mr-1.5" />
                                        {assignment.status === 'Pending' ? 'Start Course' : 'Continue'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {data?.results?.length === 0 && (
                        <div className="col-span-full py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                            <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
                                <BookOpen className="h-8 w-8 text-secondary" />
                            </div>
                            <h3 className="text-lg font-bold text-primary">No Trainings Assigned</h3>
                            <p className="mt-2 text-secondary font-medium max-w-sm">
                                You're all caught up! Reach out to your supervisor if you're looking for new learning opportunities.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
