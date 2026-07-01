import { useState, useEffect, useCallback } from 'react';
import { Card, Table, Tag, Spin } from 'antd';
import { MdSwapHoriz } from 'react-icons/md';
import api from '../services/api';

const statusColorMap = {
	open: 'blue',
	returned: 'green',
	late: 'red',
};

const MyLoans = () => {
	const [loans, setLoans] = useState([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);

	const fetchLoans = useCallback(async () => {
		setLoading(true);
		try {
			const res = await api.get('/loans/my-loans', {
				params: { page, limit },
			});
			setLoans(res.data.loans);
			setTotal(res.data.total);
		} catch {
			setLoans([]);
		} finally {
			setLoading(false);
		}
	}, [page, limit]);

	useEffect(() => {
		fetchLoans();
	}, [fetchLoans]);

	const columns = [
		{ title: 'Livro', dataIndex: ['book', 'title'], key: 'title' },
		{ title: 'Autor', dataIndex: ['book', 'author'], key: 'author' },
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
	];

	return (
		<Card
			title={
				<span>
					<MdSwapHoriz style={{ marginRight: 8 }} />
					Meus Empréstimos
				</span>
			}
		>
			<Table
				columns={columns}
				dataSource={loans}
				rowKey="id"
				loading={loading}
				pagination={{
					current: page,
					pageSize: limit,
					total,
					onChange: (p) => setPage(p),
					showTotal: (t) => `Total: ${t} empréstimos`,
				}}
			/>
		</Card>
	);
};

export default MyLoans;
