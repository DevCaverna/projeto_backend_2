import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	Card,
	Table,
	Button,
	Select,
	DatePicker,
	Tag,
	Popconfirm,
	Space,
	message,
} from 'antd';
import { MdSwapHoriz, MdCheckCircle, MdAdd } from 'react-icons/md';
import api from '../services/api';

const { RangePicker } = DatePicker;

const statusColorMap = {
	open: 'blue',
	returned: 'green',
	late: 'red',
};

const LoanList = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const isOverdue = location.pathname.includes('/overdue');

	const [loans, setLoans] = useState([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [statusFilter, setStatusFilter] = useState(
		isOverdue ? 'open' : undefined,
	);
	const [dateRange, setDateRange] = useState(null);

	const fetchLoans = useCallback(async () => {
		setLoading(true);
		try {
			const params = { page, limit };
			if (statusFilter) params.status = statusFilter;
			if (dateRange) {
				params.start_date = dateRange[0].format('YYYY-MM-DD');
				params.end_date = dateRange[1].format('YYYY-MM-DD');
			}
			const url = isOverdue ? '/loans/overdue' : '/loans';
			const res = isOverdue
				? await api.get(url)
				: await api.get(url, { params });
			const data = isOverdue
				? {
						loans: res.data,
						total: res.data.length,
						page: 1,
						totalPages: 1,
					}
				: res.data;
			setLoans(data.loans);
			setTotal(data.total);
			setPage(data.page || 1);
		} catch {
			message.error('Erro ao carregar empréstimos');
		} finally {
			setLoading(false);
		}
	}, [page, limit, statusFilter, dateRange, isOverdue]);

	useEffect(() => {
		fetchLoans();
	}, [fetchLoans]);

	const handleReturn = async (id) => {
		try {
			await api.put(`/loans/${id}/return`);
			message.success('Devolução registrada com sucesso');
			fetchLoans();
		} catch {
			message.error('Erro ao registrar devolução');
		}
	};

	const handleDateRangeChange = (dates) => {
		setDateRange(dates);
		setPage(1);
	};

	const handleStatusChange = (value) => {
		setStatusFilter(value);
		setPage(1);
	};

	const columns = [
		{ title: 'Leitor', dataIndex: ['user', 'name'], key: 'reader' },
		{ title: 'Livro', dataIndex: ['book', 'title'], key: 'book' },
		{
			title: 'Data Empréstimo',
			dataIndex: 'loan_date',
			key: 'loan_date',
			render: (val) =>
				val ? new Date(val).toLocaleDateString('pt-BR') : '-',
		},
		{
			title: 'Data Devolução',
			dataIndex: 'due_date',
			key: 'due_date',
			render: (val) =>
				val ? new Date(val).toLocaleDateString('pt-BR') : '-',
		},
		{
			title: 'Devolvido Em',
			dataIndex: 'return_date',
			key: 'return_date',
			render: (val) =>
				val ? new Date(val).toLocaleDateString('pt-BR') : '-',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status) => (
				<Tag color={statusColorMap[status] || 'default'}>
					{status === 'open'
						? 'Aberto'
						: status === 'returned'
							? 'Devolvido'
							: 'Atrasado'}
				</Tag>
			),
		},
		{
			title: 'Ações',
			key: 'actions',
			render: (_, record) => (
				<Space>
					{(record.status === 'open' || record.status === 'late') && (
						<Popconfirm
							title="Confirmar devolução?"
							onConfirm={() => handleReturn(record.id)}
							okText="Sim"
							cancelText="Não"
						>
							<Button type="link" icon={<MdCheckCircle />}>
								Registrar Devolução
							</Button>
						</Popconfirm>
					)}
				</Space>
			),
		},
	];

	return (
		<Card
			title={
				<Space>
					<MdSwapHoriz size={22} />
					<span>
						{isOverdue ? 'Empréstimos em Atraso' : 'Empréstimos'}
					</span>
				</Space>
			}
			extra={
				!isOverdue && (
					<Button
						type="primary"
						icon={<MdAdd />}
						onClick={() => navigate('/loans/new')}
					>
						Novo Empréstimo
					</Button>
				)
			}
		>
			<Space style={{ marginBottom: 16 }} wrap>
				{!isOverdue && (
					<Select
						allowClear
						placeholder="Filtrar por status"
						style={{ width: 180 }}
						value={statusFilter}
						onChange={handleStatusChange}
						options={[
							{ value: 'open', label: 'Aberto' },
							{ value: 'returned', label: 'Devolvido' },
							{ value: 'late', label: 'Atrasado' },
						]}
					/>
				)}
				{!isOverdue && (
					<RangePicker
						value={dateRange}
						onChange={handleDateRangeChange}
					/>
				)}
			</Space>
			<Table
				columns={
					isOverdue
						? columns.filter((c) => c.key !== 'actions')
						: columns
				}
				dataSource={loans}
				rowKey="id"
				loading={loading}
				pagination={
					isOverdue
						? false
						: {
								current: page,
								pageSize: limit,
								total,
								onChange: (p) => setPage(p),
								showTotal: (t) => `Total: ${t} empréstimos`,
							}
				}
			/>
		</Card>
	);
};

export default LoanList;
