import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../../services/assignmentService';
import { Plus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import AssignmentModal from '../../components/admin/AssignmentModal';
import clsx from 'clsx';
import Table from '../../components/common/Table';

const Assignments = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['assignments', search],
        queryFn: () => assignmentService.getAll({ search }),
    });

    const createMutation = useMutation({
        mutationFn: assignmentService.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['assignments']);
            setIsModalOpen(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: assignmentService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['assignments']);
        },
    });

    const handleSubmit = (data) => {
        createMutation.mutate(data);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            deleteMutation.mutate(id);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'InProgress': return 'bg-blue-100 text-blue-800';
            case 'Overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'InProgress': return <Clock className="w-4 h-4 mr-1" />;
            case 'Overdue': return <AlertCircle className="w-4 h-4 mr-1" />;
            default: return <Clock className="w-4 h-4 mr-1" />;
        }
    };

    const columns = [
        {
            header: 'Employee',
            accessor: 'employee',
            render: (employee) => (
                <div>
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.department}</div>
                </div>
            )
        },
        {
            header: 'Course',
            accessor: 'course.title',
            render: (_, row) => <span className="text-sm text-gray-600">{row.course.title}</span>
        },
        {
            header: 'Assigned Date',
            accessor: 'assigned_date',
            render: (date) => <span className="text-sm text-gray-500">{date}</span>
        },
        {
            header: 'Due Date',
            accessor: 'due_date',
            render: (date) => <span className="text-sm text-gray-500">{date}</span>
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (status) => (
                <span className={clsx("px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center", getStatusColor(status))}>
                    {getStatusIcon(status)}
                    {status}
                </span>
            )
        },
        {
            header: 'Progress',
            accessor: 'progress_percentage',
            render: (progress) => (
                <div className="w-full max-w-xs">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-primary h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 inline-block">{progress}%</span>
                </div>
            )
        },
        {
            header: 'Actions',
            accessor: 'id',
            render: (id) => (
                <div className="flex space-x-2 justify-end">
                    <button
                        onClick={() => handleDelete(id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Training Assignments</h1>
            </div>

            <Table
                columns={columns}
                data={data?.results || []}
                isLoading={isLoading}
                search={search}
                onSearchChange={setSearch}
                emptyMessage="No assignments found."
                actions={
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Assign Training
                    </button>
                }
            />

            <AssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                isLoading={createMutation.isPending}
            />
        </div>
    );
};

export default Assignments;
