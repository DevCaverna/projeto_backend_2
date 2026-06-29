import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { Card, Form, Input, Button, message, Spin } from 'antd';
import { MdSave } from 'react-icons/md';
import { CpfInput, PhoneInput } from '../components/MaskedInput';

export default function ReaderForm() {
	const { id } = useParams();
	const isEdit = Boolean(id);
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (isEdit) {
			setLoading(true);
			api.get(`/readers/${id}`)
				.then(({ data }) => {
					form.setFieldsValue({
						name: data.name,
						email: data.email,
						cpf: data.cpf,
						phone: data.phone,
						address: data.address,
					});
				})
				.catch(() => message.error('Erro ao carregar leitor'))
				.finally(() => setLoading(false));
		}
	}, [id, isEdit, form]);

	const onFinish = async (values) => {
		setSaving(true);
		try {
			const payload = { ...values };
			if (isEdit && !payload.password) delete payload.password;
			if (isEdit) {
				await api.put(`/readers/${id}`, payload);
				message.success('Leitor atualizado');
			} else {
				await api.post('/readers', payload);
				message.success('Leitor cadastrado');
			}
			navigate('/readers');
		} catch (err) {
			message.error(err.response?.data?.error || 'Erro ao salvar');
		} finally {
			setSaving(false);
		}
	};

	if (loading)
		return <Spin style={{ display: 'block', margin: '40px auto' }} />;

	return (
		<Card title={isEdit ? 'Editar Leitor' : 'Novo Leitor'}>
			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				style={{ maxWidth: 600 }}
			>
				<Form.Item
					name="name"
					label="Nome"
					rules={[{ required: true, message: 'Informe o nome' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="email"
					label="E-mail"
					rules={[
						{
							required: true,
							type: 'email',
							message: 'Email inválido',
						},
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="password"
					label={
						isEdit
							? 'Nova senha (deixe vazio para manter)'
							: 'Senha'
					}
					rules={
						isEdit
							? []
							: [{ required: true, message: 'Informe a senha' }]
					}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item name="cpf" label="CPF">
					<CpfInput />
				</Form.Item>
				<Form.Item name="phone" label="Telefone">
					<PhoneInput />
				</Form.Item>
				<Form.Item name="address" label="Endereço">
					<Input.TextArea rows={3} />
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						icon={<MdSave />}
						loading={saving}
					>
						Salvar
					</Button>
					<Button
						style={{ marginLeft: 8 }}
						onClick={() => navigate('/readers')}
					>
						Cancelar
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
}
