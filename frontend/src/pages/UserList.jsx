import { useState, useEffect } from 'react';
import {
	Card,
	Table,
	Button,
	Tag,
	Modal,
	Form,
	Input,
	Select,
	Popconfirm,
	Space,
	message,
} from 'antd';
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { formatCpf, formatPhone } from '../components/MaskedInput';

const UserList = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [form] = Form.useForm();

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await api.get('/users');
			setUsers(res.data);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleEdit = (user) => {
		setEditingUser(user);
		form.setFieldsValue(user);
		setEditModalOpen(true);
	};

	const handleEditSave = async () => {
		try {
			const values = await form.validateFields();
			await api.put(`/users/${editingUser.id}`, values);
			message.success('Usuário atualizado com sucesso');
			setEditModalOpen(false);
			fetchUsers();
		} catch {
			if (error.response) message.error('Erro ao atualizar usuário');
		}
	};

	const handleDelete = async (id) => {
		try {
			await api.delete(`/users/${id}`);
			message.success('Usuário removido');
			fetchUsers();
		} catch {
			message.error('Erro ao remover usuário');
		}
	};

	const columns = [
		{ title: 'Nome', dataIndex: 'name', key: 'name' },
		{ title: 'Email', dataIndex: 'email', key: 'email' },
		{
			title: 'CPF',
			dataIndex: 'cpf',
			key: 'cpf',
			render: (v) => formatCpf(v),
		},
		{
			title: 'Telefone',
			dataIndex: 'phone',
			key: 'phone',
			render: (v) => formatPhone(v),
		},
		{
			title: 'Função',
			dataIndex: 'role',
			key: 'role',
			render: (role) => <Tag>{role}</Tag>,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status) => (
				<Tag color={status === 'active' ? 'green' : 'red'}>
					{status}
				</Tag>
			),
		},
		{
			title: 'Ações',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button
						icon={<MdEdit />}
						onClick={() => handleEdit(record)}
					/>
					<Popconfirm
						title="Remover usuário?"
						onConfirm={() => handleDelete(record.id)}
					>
						<Button icon={<MdDelete />} danger />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card
			title="Usuários"
			extra={
				<Button
					type="primary"
					icon={<MdAdd />}
					onClick={() => navigate('/users/new')}
				>
					Novo Usuário
				</Button>
			}
		>
			<Table
				dataSource={users}
				columns={columns}
				rowKey="id"
				loading={loading}
			/>

			<Modal
				title="Editar Usuário"
				open={editModalOpen}
				onOk={handleEditSave}
				onCancel={() => setEditModalOpen(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="name"
						label="Nome"
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name="email"
						label="E-mail"
						rules={[{ required: true, type: 'email' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item name="cpf" label="CPF">
						<Input disabled />
					</Form.Item>
					<Form.Item name="phone" label="Telefone">
						<Input disabled />
					</Form.Item>
					<Form.Item
						name="role"
						label="Função"
						rules={[{ required: true }]}
					>
						<Select>
							<Select.Option value="admin">Admin</Select.Option>
							<Select.Option value="librarian">
								Bibliotecário
							</Select.Option>
							<Select.Option value="reader">Leitor</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="status"
						label="Status"
						rules={[{ required: true }]}
					>
						<Select>
							<Select.Option value="active">Ativo</Select.Option>
							<Select.Option value="inactive">
								Inativo
							</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Card>
	);
};

export default UserList;
