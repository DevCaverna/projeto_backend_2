import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
	Card,
	Table,
	Button,
	Input,
	Tag,
	Popconfirm,
	Space,
	Tooltip,
	message,
} from 'antd';
import { MdSearch, MdAdd, MdVisibility, MdEdit, MdBlock } from 'react-icons/md';
import { formatCpf, formatPhone } from '../components/MaskedInput';

export default function ReaderList() {
	const navigate = useNavigate();
	const [readers, setReaders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [name, setName] = useState('');

	const fetchReaders = async (p = page) => {
		setLoading(true);
		try {
			const { data } = await api.get('/readers', {
				params: { page: p, limit: 10, name },
			});
			setReaders(data.readers);
			setTotal(data.total);
		} catch {
			message.error('Erro ao carregar leitores');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchReaders();
	}, [page]);

	const handleSearch = (value) => {
		setName(value);
		setPage(1);
		fetchReaders(1);
	};

	const handleInactivate = async (id) => {
		try {
			await api.patch(`/readers/${id}/inactivate`);
			message.success('Leitor inativado');
			fetchReaders();
		} catch {
			message.error('Erro ao inativar leitor');
		}
	};

	const columns = [
		{ title: 'Nome', dataIndex: 'name', key: 'name' },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{ title: 'CPF', dataIndex: 'cpf', key: 'cpf', render: (v) => formatCpf(v) },
		{
			title: 'Telefone',
			dataIndex: 'phone',
			key: 'phone',
			render: (v) => formatPhone(v),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status) => (
				<Tag color={status === 'active' ? 'green' : 'red'}>
					{status === 'active' ? 'Ativo' : 'Inativo'}
				</Tag>
			),
		},
		{
			title: 'Ações',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Tooltip title="Visualizar">
						<Link to={`/readers/${record.id}`}>
							<MdVisibility size={18} />
						</Link>
					</Tooltip>
					<Tooltip title="Editar">
						<Link to={`/readers/${record.id}/edit`}>
							<MdEdit size={18} />
						</Link>
					</Tooltip>
					{record.status === 'active' && (
						<Popconfirm
							title="Inativar leitor?"
							onConfirm={() => handleInactivate(record.id)}
						>
							<Tooltip title="Inativar">
								<MdBlock
									size={18}
									style={{
										cursor: 'pointer',
										color: '#ff4d4f',
									}}
								/>
							</Tooltip>
						</Popconfirm>
					)}
				</Space>
			),
		},
	];

	return (
		<Card
			title="Leitores"
			extra={
				<Button
					type="primary"
					icon={<MdAdd />}
					onClick={() => navigate('/readers/new')}
				>
					Novo Leitor
				</Button>
			}
		>
			<Input.Search
				placeholder="Buscar por nome..."
				prefix={<MdSearch />}
				allowClear
				onSearch={handleSearch}
				style={{ marginBottom: 16, maxWidth: 400 }}
			/>
			<Table
				dataSource={readers}
				columns={columns}
				rowKey="id"
				loading={loading}
				pagination={{
					current: page,
					pageSize: 10,
					total,
					onChange: (p) => setPage(p),
				}}
			/>
		</Card>
	);
}
