import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../../services/employeeService';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import EmployeeModal from '../../components/admin/EmployeeModal';
import Table from '../../components/common/Table';
import { useToast } from '../../context/ToastContext';

const Employees = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();
    const toast = useToast();

    const { data, isLoading } = useQuery({
        queryKey: ['employees', search],
        queryFn: () => employeeService.getAll({ search }),
    });

    const createMutation = useMutation({
        mutationFn: employeeService.create,
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            setIsModalOpen(false);
            toast.success('Employee created successfully!');
        },
        onError: () => {
            toast.error('Failed to create employee');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => employeeService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            setIsModalOpen(false);
            toast.success('Employee updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update employee');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: employeeService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['employees']);
            toast.success('Employee deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete employee');
        },
    });

    const handleSubmit = (data) => {
        if (selectedEmployee) {
            updateMutation.mutate({ id: selectedEmployee.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleAdd = () => {
        setSelectedEmployee(null);
        setIsModalOpen(true);
    };

    const columns = [
        {
            header: 'Name',
            accessor: 'name',
            render: (_, row) => (
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">
                        {row.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-primary">{row.name}</div>
                        <div className="text-xs text-secondary">{row.email}</div>
                    </div>
                </div>
            )
        },
        { header: 'Code', accessor: 'employee_code' },
        { header: 'Department', accessor: 'department' },
        { header: 'Role', accessor: 'role' },
        {
            header: 'Status',
            accessor: 'is_active',
            render: (isActive) => (
                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                    }`}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            header: 'Actions',
            align: 'right',
            render: (_, row) => (
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => handleEdit(row)}
                        className="p-1 text-secondary hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <Table
                title="Employees"
                search={search}
                onSearchChange={setSearch}
                columns={columns}
                data={data?.results || []}
                isLoading={isLoading}
                actions={
                    <button
                        onClick={handleAdd}
                        className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                    </button>
                }
            />

            <EmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedEmployee}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default Employees;
