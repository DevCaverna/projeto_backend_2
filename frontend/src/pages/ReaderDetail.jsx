import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
	Card,
	Descriptions,
	Table,
	Button,
	Tag,
	Spin,
	Space,
	message,
} from 'antd';
import { MdEdit, MdBlock, MdArrowBack } from 'react-icons/md';
import { formatCpf, formatPhone } from '../components/MaskedInput';

export default function ReaderDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [reader, setReader] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchReader = async () => {
		setLoading(true);
		try {
			const { data } = await api.get(`/readers/${id}`);
			setReader(data);
		} catch {
			message.error('Erro ao carregar leitor');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchReader();
	}, [id]);

	const handleInactivate = async () => {
		try {
			await api.patch(`/readers/${id}/inactivate`);
			message.success('Leitor inativado');
			fetchReader();
		} catch {
			message.error('Erro ao inativar leitor');
		}
	};

	if (loading)
		return <Spin style={{ display: 'block', margin: '40px auto' }} />;
	if (!reader) return null;

	const loanColumns = [
		{
			title: 'Livro',
			dataIndex: ['book', 'title'],
			key: 'book_title',
		},
		{
			title: 'Data Empréstimo',
			dataIndex: 'loan_date',
			key: 'loan_date',
			render: (v) => (v ? new Date(v).toLocaleDateString('pt-BR') : '-'),
		},
		{
			title: 'Data Devolução',
			dataIndex: 'due_date',
			key: 'due_date',
			render: (v) => (v ? new Date(v).toLocaleDateString('pt-BR') : '-'),
		},
		{
			title: 'Data Retorno',
			dataIndex: 'return_date',
			key: 'return_date',
			render: (v) => (v ? new Date(v).toLocaleDateString('pt-BR') : '-'),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (s) => {
				const map = {
					open: { color: 'blue', label: 'Aberto' },
					returned: { color: 'green', label: 'Devolvido' },
					late: { color: 'red', label: 'Atrasado' },
				};
				const item = map[s] || { color: 'default', label: s };
				return <Tag color={item.color}>{item.label}</Tag>;
			},
		},
	];

	return (
		<>
			<Space style={{ marginBottom: 16 }}>
				<Button
					icon={<MdArrowBack />}
					onClick={() => navigate('/readers')}
				>
					Voltar
				</Button>
				<Button
					icon={<MdEdit />}
					onClick={() => navigate(`/readers/${id}/edit`)}
				>
					Editar
				</Button>
				{reader.status === 'active' && (
					<Button
						icon={<MdBlock />}
						danger
						onClick={handleInactivate}
					>
						Inativar
					</Button>
				)}
			</Space>

			<Card title="Dados do Leitor" style={{ marginBottom: 24 }}>
				<Descriptions column={2} bordered>
					<Descriptions.Item label="Nome">
						{reader.name}
					</Descriptions.Item>
					<Descriptions.Item label="E-mail">
						{reader.email}
					</Descriptions.Item>
					<Descriptions.Item label="CPF">
						{formatCpf(reader.cpf)}
					</Descriptions.Item>
					<Descriptions.Item label="Telefone">
						{formatPhone(reader.phone)}
					</Descriptions.Item>
					<Descriptions.Item label="Endereço" span={2}>
						{reader.address || '-'}
					</Descriptions.Item>
					<Descriptions.Item label="Status">
						<Tag
							color={reader.status === 'active' ? 'green' : 'red'}
						>
							{reader.status === 'active' ? 'Ativo' : 'Inativo'}
						</Tag>
					</Descriptions.Item>
				</Descriptions>
			</Card>

			<Card title="Histórico de Empréstimos">
				<Table
					dataSource={reader.loans || []}
					columns={loanColumns}
					rowKey="id"
					pagination={false}
				/>
			</Card>
		</>
	);
}
