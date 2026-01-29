import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, ClipboardList, TrendingUp, Loader2, Calendar, CheckCircle2, Clock } from 'lucide-react';
import clsx from 'clsx';
import StatsCard from '../../components/common/StatsCard';
import { reportService } from '../../services/reportService';
import { employeeService } from '../../services/employeeService';
import { courseService } from '../../services/courseService';
import { assignmentService } from '../../services/assignmentService';

const AdminDashboard = () => {
    // Fetch all data needed for dashboard
    const { data: employees, isLoading: employeesLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: () => employeeService.getAll({}),
    });

    const { data: courses, isLoading: coursesLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: () => courseService.getAll({}),
    });

    const { data: assignments, isLoading: assignmentsLoading } = useQuery({
        queryKey: ['assignments'],
        queryFn: () => assignmentService.getAll({}),
    });

    const isLoading = employeesLoading || coursesLoading || assignmentsLoading;

    // Calculate statistics
    const stats = {
        totalEmployees: employees?.count || 0,
        totalCourses: courses?.count || 0,
        totalAssignments: assignments?.count || 0,
        completedAssignments: assignments?.results?.filter(a => a.status === 'Completed').length || 0,
        pendingAssignments: assignments?.results?.filter(a => a.status === 'Pending').length || 0,
        inProgressAssignments: assignments?.results?.filter(a => a.status === 'InProgress').length || 0,
    };

    const completionRate = stats.totalAssignments > 0
        ? ((stats.completedAssignments / stats.totalAssignments) * 100).toFixed(1)
        : 0;

    // Get recent assignments
    const recentAssignments = assignments?.results?.slice(0, 5) || [];

    const getStatusBadge = (status) => {
        const config = {
            'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'InProgress': 'bg-primary/5 text-primary border-primary/10',
            'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
            'Overdue': 'bg-red-50 text-red-700 border-red-100',
        };
        return config[status] || 'bg-gray-50 text-gray-700 border-gray-100';
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-primary tracking-tight">Dashboard Overview</h1>
                <p className="text-secondary font-medium mt-1">Monitor training progress and system activity at a glance.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Employees"
                    value={stats.totalEmployees}
                    icon={Users}
                    color="primary"
                    subtitle="Active team members"
                />
                <StatsCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    icon={BookOpen}
                    color="secondary"
                    subtitle="Published trainings"
                />
                <StatsCard
                    title="Total Assignments"
                    value={stats.totalAssignments}
                    icon={ClipboardList}
                    color="accent"
                    subtitle={`${stats.pendingAssignments} awaiting start`}
                />
                <StatsCard
                    title="Completion Rate"
                    value={`${completionRate}%`}
                    icon={TrendingUp}
                    color="success"
                    subtitle={`${stats.completedAssignments} courses finished`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-lg font-bold text-primary">Recent Training Activity</h2>
                        <a href="/admin/assignments" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">View All</a>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentAssignments.length > 0 ? (
                            recentAssignments.map((assignment) => (
                                <div key={assignment.id} className="p-6 hover:bg-gray-50/50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-primary group-hover:text-primary-light transition-colors">
                                                {assignment.course.title}
                                            </h3>
                                            <p className="text-sm text-secondary mt-1">
                                                {assignment.employee.name} • {assignment.employee.department}
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-secondary font-medium">
                                                <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" /> Due: {assignment.due_date}</span>
                                                {assignment.progress_percentage > 0 && (
                                                    <span className="flex items-center"><TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-500" /> {assignment.progress_percentage}% Done</span>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${getStatusBadge(assignment.status)}`}>
                                            {assignment.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-secondary font-medium">
                                No recent activity to show
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Breakdown & Quick Actions */}
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-primary mb-6">Status Breakdown</h2>
                        <div className="space-y-4">
                            {[
                                { label: 'Completed', value: stats.completedAssignments, color: 'emerald', icon: CheckCircle2 },
                                { label: 'In Progress', value: stats.inProgressAssignments, color: 'primary', icon: Clock },
                                { label: 'Pending', value: stats.pendingAssignments, color: 'amber', icon: Calendar },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center">
                                        <div className={clsx("p-2 rounded-lg bg-gray-50 mr-3 text-gray-400")}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-semibold text-secondary">{item.label}</span>
                                    </div>
                                    <span className="text-lg font-bold text-primary">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary rounded-2xl shadow-lg border border-primary-light p-6 text-white min-h-[300px] flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
                            <p className="text-sm text-highlight font-medium mb-6">Efficiently manage your training portal.</p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Add Employee', icon: Users, to: '/admin/employees' },
                                    { label: 'New Course', icon: BookOpen, to: '/admin/courses' },
                                    { label: 'Assign Training', icon: ClipboardList, to: '/admin/assignments' },
                                ].map((action) => (
                                    <a
                                        key={action.label}
                                        href={action.to}
                                        className="flex items-center px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10 group"
                                    >
                                        <action.icon className="w-5 h-5 mr-3 text-highlight group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-bold tracking-wide">{action.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
