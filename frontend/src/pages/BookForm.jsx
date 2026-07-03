import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Card,
	Form,
	Input,
	InputNumber,
	Button,
	Upload,
	message,
	Spin,
} from 'antd';
import { MdCloudUpload, MdSave } from 'react-icons/md';
import api from '../services/api';

const BookForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(!!id);
	const [coverFile, setCoverFile] = useState(null);

	useEffect(() => {
		if (!id) return;
		const fetchBook = async () => {
			try {
				const res = await api.get(`/books/${id}`);
				form.setFieldsValue(res.data);
			} catch {
				message.error('Erro ao carregar livro');
			} finally {
				setFetching(false);
			}
		};
		fetchBook();
	}, [id, form]);

	const handleSubmit = async (values) => {
		setLoading(true);
		try {
			if (id) {
				await api.put(`/books/${id}`, values);
				if (coverFile) {
					const formData = new FormData();
					formData.append('cover', coverFile);
					await api.post(`/books/${id}/cover`, formData);
				}
				message.success('Livro atualizado');
			} else {
				const res = await api.post('/books', values);
				if (coverFile) {
					const formData = new FormData();
					formData.append('cover', coverFile);
					await api.post(`/books/${res.data.id}/cover`, formData);
				}
				message.success('Livro cadastrado');
			}
			navigate('/books');
		} catch {
			message.error('Erro ao salvar livro');
		} finally {
			setLoading(false);
		}
	};

	const uploadProps = {
		beforeUpload: (file) => {
			setCoverFile(file);
			return false;
		},
		onRemove: () => setCoverFile(null),
		fileList: coverFile ? [coverFile] : [],
		maxCount: 1,
		accept: 'image/*',
	};

	if (fetching)
		return (
			<Spin
				size="large"
				style={{ display: 'block', margin: '100px auto' }}
			/>
		);

	return (
		<Card title={id ? 'Editar Livro' : 'Novo Livro'}>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				style={{ maxWidth: 600 }}
			>
				<Form.Item
					name="title"
					label="Título"
					rules={[
						{ required: true, message: 'Informe o título' },
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="author"
					label="Autor"
					rules={[
						{ required: true, message: 'Informe o autor' },
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item name="publisher" label="Editora">
					<Input />
				</Form.Item>
				<Form.Item name="year" label="Ano">
					<InputNumber style={{ width: '100%' }} min={0} max={9999} />
				</Form.Item>
				<Form.Item name="category" label="Categoria">
					<Input />
				</Form.Item>
				<Form.Item name="isbn" label="ISBN">
					<Input />
				</Form.Item>
				<Form.Item
					name="total_quantity"
					label="Quantidade Total"
					rules={[
						{
							required: true,
							message: 'Informe a quantidade total',
						},
					]}
				>
					<InputNumber style={{ width: '100%' }} min={0} />
				</Form.Item>
				<Form.Item
					name="available_quantity"
					label="Quantidade Disponível"
					rules={[
						{
							required: true,
							message: 'Informe a quantidade disponível',
						},
					]}
				>
					<InputNumber style={{ width: '100%' }} min={0} />
				</Form.Item>
				<Form.Item label="Capa do Livro">
					<Upload {...uploadProps}>
						<Button icon={<MdCloudUpload />}>Enviar Capa</Button>
					</Upload>
				</Form.Item>
				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						loading={loading}
						icon={<MdSave />}
					>
						{id ? 'Atualizar' : 'Cadastrar'}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default BookForm;
