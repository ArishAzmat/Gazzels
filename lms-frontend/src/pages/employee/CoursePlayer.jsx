import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../../services/assignmentService';
import { progressService } from '../../services/progressService';
import { CheckCircle, PlayCircle, ArrowLeft, Loader2, ChevronRight, AlertCircle, Clock, BookOpen } from 'lucide-react';
import clsx from 'clsx';

const CoursePlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeLesson, setActiveLesson] = useState(null);

    const { data: assignments, isLoading } = useQuery({
        queryKey: ['my-assignments'],
        queryFn: () => assignmentService.getMyAssignments(),
    });

    const assignment = assignments?.results?.find(a => a.id === id);
    const course = assignment?.course;

    const completeMutation = useMutation({
        mutationFn: progressService.markComplete,
        onSuccess: () => {
            queryClient.invalidateQueries(['my-assignments']);
        },
    });

    useEffect(() => {
        if (course && course.lessons && course.lessons.length > 0 && !activeLesson) {
            setActiveLesson(course.lessons[0]);
        }
    }, [course, activeLesson]);

    if (isLoading) return <div className="flex justify-center items-center h-96"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
    if (!assignment) return (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-gray-100 shadow-sm text-center p-8">
            <AlertCircle className="w-16 h-16 text-secondary mb-4" />
            <h2 className="text-xl font-bold text-primary">Assignment Not Found</h2>
            <p className="text-secondary mt-2">The requested training could not be found or you don't have access to it.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-6 px-6 py-2 bg-primary text-white rounded-xl font-bold">Back to Dashboard</button>
        </div>
    );

    const handleLessonSelect = (lesson) => {
        setActiveLesson(lesson);
    };

    const handleMarkComplete = () => {
        if (!activeLesson) return;
        completeMutation.mutate({
            assignment_id: assignment.id,
            lesson_id: activeLesson.id
        });
    };

    const activeIndex = course.lessons.indexOf(activeLesson);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-8">
            {/* Sidebar - Lesson List */}
            <div className="w-full md:w-96 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 border-b bg-gray-50/50">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-xs font-bold text-secondary hover:text-primary transition-colors mb-4 uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Courses
                    </button>
                    <h2 className="text-xl font-bold text-primary truncate mb-4" title={course.title}>{course.title}</h2>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-secondary">Course Progress</span>
                            <span className="text-primary">{assignment.progress_percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-500 shadow-[0_0_4px_rgba(44,62,80,0.2)]"
                                style={{ width: `${assignment.progress_percentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                    {course.lessons?.map((lesson, index) => (
                        <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className={clsx(
                                "w-full flex items-center px-6 py-4 transition-all duration-200 text-left border-l-4",
                                activeLesson?.id === lesson.id
                                    ? "bg-primary/5 border-primary"
                                    : "border-transparent hover:bg-gray-50"
                            )}
                        >
                            <div className="mr-4">
                                <div className={clsx(
                                    "p-2 rounded-lg transition-colors",
                                    activeLesson?.id === lesson.id ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                                )}>
                                    <PlayCircle className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className={clsx(
                                    "text-sm font-bold truncate transition-colors",
                                    activeLesson?.id === lesson.id ? "text-primary" : "text-gray-600"
                                )}>
                                    {index + 1}. {lesson.title}
                                </p>
                                <div className="flex items-center mt-1">
                                    <Clock className="w-3 h-3 text-gray-400 mr-1" />
                                    <span className="text-[10px] text-secondary font-medium tracking-wide uppercase">{lesson.duration_minutes} mins</span>
                                </div>
                            </div>
                            {activeLesson?.id === lesson.id && <ChevronRight className="w-4 h-4 text-primary ml-2" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content - Video/Text Player */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                {activeLesson ? (
                    <>
                        <div className="p-8 border-b bg-white flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Current Lesson</span>
                                <h1 className="text-3xl font-bold text-primary mt-1">{activeLesson.title}</h1>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-secondary font-medium text-sm">Step {activeIndex + 1} of {course.lessons.length}</span>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                            <div className="bg-primary/5 border border-primary/10 rounded-2xl mb-10 flex items-center justify-center aspect-video max-h-[480px] shadow-inner group">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                                        <PlayCircle className="w-12 h-12 text-primary" />
                                    </div>
                                    <p className="text-primary font-bold text-lg">Training Content Placeholder</p>
                                    <p className="text-secondary text-sm font-medium mt-1">Video or Interactive Module</p>
                                </div>
                            </div>

                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-1 w-8 bg-primary rounded-full" />
                                    <h3 className="text-xl font-bold text-primary uppercase tracking-wider text-sm">Module Details</h3>
                                </div>
                                <p className="text-secondary text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                    {activeLesson.content || "Experience the core learning principles of this module. This section contains the primary training materials and resources needed for successful completion of the course objectives."}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gray-50/80 backdrop-blur-sm flex justify-between items-center">
                            <button
                                disabled={activeIndex === 0}
                                onClick={() => setActiveLesson(course.lessons[activeIndex - 1])}
                                className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-secondary hover:bg-gray-100 disabled:opacity-30 transition-all flex items-center shadow-sm"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </button>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleMarkComplete}
                                    disabled={completeMutation.isPending}
                                    className="px-6 py-2.5 bg-success/10 text-success border border-success/20 rounded-xl shadow-sm text-sm font-bold hover:bg-success/20 focus:outline-none transition-all flex items-center"
                                >
                                    {completeMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                    Mark Complete
                                </button>

                                <button
                                    disabled={activeIndex === course.lessons.length - 1}
                                    onClick={() => setActiveLesson(course.lessons[activeIndex + 1])}
                                    className="px-6 py-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 text-sm font-bold hover:bg-primary-light focus:outline-none transition-all flex items-center disabled:opacity-30"
                                >
                                    Next Lesson
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-secondary">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-10 h-10 text-gray-300" />
                        </div>
                        <p className="font-bold text-lg">Ready to start?</p>
                        <p className="text-sm font-medium">Select a module from the left to begin your training session.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursePlayer;
