import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
	Card,
	Form,
	Input,
	Button,
	Typography,
	message,
} from 'antd';
import { MdEmail, MdLock, MdLibraryBooks } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

export default function Login() {
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (values) => {
		setLoading(true);
		try {
			await login(values.email, values.password);
			navigate('/');
		} catch (err) {
			message.error(err.response?.data?.error || 'Erro ao fazer login');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			}}
		>
			<Card
				style={{
					width: '100%',
					minWidth: 360,
					maxWidth: 420,
					margin: 24,
				}}
			>
				<div style={{ textAlign: 'center', marginBottom: 24 }}>
					<MdLibraryBooks
						size={40}
						style={{ color: '#667eea', marginBottom: 8 }}
					/>
					<Title level={2} style={{ margin: 0 }}>
						Biblioteca
					</Title>
					<Text type="secondary">
						Sistema de Gerenciamento
					</Text>
				</div>

				<Form
					layout="vertical"
					onFinish={handleSubmit}
					autoComplete="off"
				>
					<Form.Item
						name="email"
						label="E-mail"
						rules={[
							{
								required: true,
								message: 'Informe o e-mail',
							},
							{
								type: 'email',
								message: 'E-mail inválido',
							},
						]}
					>
						<Input
							prefix={<MdEmail />}
							placeholder="seu@email.com"
						/>
					</Form.Item>

					<Form.Item
						name="password"
						label="Senha"
						rules={[
							{
								required: true,
								message: 'Informe a senha',
							},
						]}
					>
						<Input.Password
							prefix={<MdLock />}
							placeholder="••••••"
						/>
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							block
							loading={loading}
						>
							Entrar
						</Button>
					</Form.Item>
				</Form>

				<div style={{ textAlign: 'center' }}>
					<Link to="/forgot-password">Esqueceu a senha?</Link>
				</div>
			</Card>
		</div>
	);
}
