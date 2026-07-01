import { Card, Form, Input, Select, Button, message } from 'antd';
import { MdSave } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserForm = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();

	const handleSubmit = async (values) => {
		try {
			await api.post('/users', values);
			message.success('Usuário criado com sucesso');
			navigate('/users');
		} catch {
			message.error('Erro ao criar usuário');
		}
	};

	return (
		<Card title="Novo Usuário">
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				style={{ maxWidth: 480 }}
			>
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
				<Form.Item
					name="password"
					label="Senha"
					rules={[{ required: true, min: 6 }]}
				>
					<Input.Password />
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
				<Form.Item>
					<Button type="primary" htmlType="submit" icon={<MdSave />}>
						Salvar
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default UserForm;
