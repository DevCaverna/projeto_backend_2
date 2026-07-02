import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
	Card,
	Form,
	Input,
	Button,
	Steps,
	Typography,
	message,
	Result,
	Alert,
} from 'antd';
import { MdEmail, MdLock, MdVpnKey } from 'react-icons/md';
import api from '../services/api';

const { Title } = Typography;

export default function ForgotPassword() {
	const [searchParams] = useSearchParams();
	const initialToken = searchParams.get('token') || '';
	const [step, setStep] = useState(initialToken ? 'token' : 'email');
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(initialToken);

	const [emailForm] = Form.useForm();
	const [resetForm] = Form.useForm();

	const stepIndex = step === 'email' ? 0 : step === 'token' ? 1 : 2;

	const handleForgot = async (values) => {
		setLoading(true);
		try {
			const { data } = await api.post('/auth/forgot-password', {
				email: values.email,
			});
			setToken(data.token || '');
			resetForm.setFieldsValue({ token: data.token || '' });
			message.success(data.message);
			if (data.token) setStep('token');
		} catch (err) {
			message.error(
				err.response?.data?.error || 'Erro ao solicitar recuperação',
			);
		} finally {
			setLoading(false);
		}
	};

	const handleReset = async (values) => {
		setLoading(true);
		try {
			await api.post('/auth/reset-password', {
				token: values.token,
				password: values.password,
			});
			setStep('done');
			message.success('Senha redefinida com sucesso!');
		} catch (err) {
			message.error(
				err.response?.data?.error || 'Erro ao redefinir senha',
			);
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
					<MdVpnKey
						size={32}
						style={{ color: '#667eea', marginBottom: 8 }}
					/>
					<Title level={3} style={{ margin: 0 }}>
						Recuperar Senha
					</Title>
				</div>

				<Steps
					current={stepIndex}
					size="small"
					style={{ marginBottom: 32 }}
					items={[
						{ title: 'E-mail' },
						{ title: 'Token' },
						{ title: 'Pronto' },
					]}
				/>

				{step === 'email' && (
					<Form
						form={emailForm}
						layout="vertical"
						onFinish={handleForgot}
						autoComplete="off"
					>
						<Form.Item
							name="email"
							label="E-mail"
							rules={[
								{ required: true, message: 'Informe o e-mail' },
								{ type: 'email', message: 'E-mail inválido' },
							]}
						>
							<Input
								prefix={<MdEmail />}
								placeholder="seu@email.com"
							/>
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								block
								loading={loading}
							>
								Solicitar Recuperação
							</Button>
						</Form.Item>

						<div style={{ textAlign: 'center' }}>
							<Link to="/login">Voltar ao login</Link>
						</div>
					</Form>
				)}

				{step === 'token' && (
					<>
						{token ? (
							<Alert
								message="Token de recuperação"
								description={token}
								type="warning"
								showIcon
								style={{ marginBottom: 16 }}
							/>
						) : (
							<Alert
								message="Informe o token recebido"
								description="Use o token enviado pelo canal de recuperação para definir uma nova senha."
								type="info"
								showIcon
								style={{ marginBottom: 16 }}
							/>
						)}

						<Form
							form={resetForm}
							initialValues={{ token: initialToken }}
							layout="vertical"
							onFinish={handleReset}
							autoComplete="off"
						>
							<Form.Item
								name="token"
								label="Token"
								rules={[
									{
										required: true,
										message: 'Informe o token',
									},
								]}
							>
								<Input
									prefix={<MdVpnKey />}
									placeholder="Token recebido por e-mail"
								/>
							</Form.Item>

							<Form.Item
								name="password"
								label="Nova Senha"
								rules={[
									{
										required: true,
										message: 'Informe a nova senha',
									},
									{
										min: 6,
										message: 'Mínimo de 6 caracteres',
									},
								]}
							>
								<Input.Password
									prefix={<MdLock />}
									placeholder="••••••"
								/>
							</Form.Item>

							<Form.Item
								name="confirm"
								label="Confirmar Senha"
								dependencies={['password']}
								rules={[
									{
										required: true,
										message: 'Confirme a nova senha',
									},
									({ getFieldValue }) => ({
										validator(_, value) {
											if (
												!value ||
												getFieldValue('password') ===
													value
											) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error(
													'Senhas não coincidem',
												),
											);
										},
									}),
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
									Redefinir Senha
								</Button>
							</Form.Item>
						</Form>
					</>
				)}

				{step === 'done' && (
					<Result
						status="success"
						title="Senha redefinida!"
						subTitle="Sua senha foi alterada com sucesso."
						extra={[
							<Link to="/login" key="login">
								<Button type="primary">Fazer Login</Button>
							</Link>,
						]}
					/>
				)}
			</Card>
		</div>
	);
}
