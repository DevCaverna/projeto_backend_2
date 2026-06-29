import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Select, DatePicker, Button, message, Spin } from 'antd';
import dayjs from 'dayjs';
import { MdSave } from 'react-icons/md';
import api from '../services/api';

const LoanForm = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [readers, setReaders] = useState([]);
	const [books, setBooks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const [readersRes, booksRes] = await Promise.all([
					api.get('/readers', { params: { limit: 200 } }),
					api.get('/books', {
						params: { limit: 200, available: true },
					}),
				]);
				setReaders(readersRes.data.readers || readersRes.data);
				setBooks(booksRes.data.books || booksRes.data);
			} catch {
				message.error('Erro ao carregar dados');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const onFinish = async (values) => {
		setSubmitting(true);
		try {
			await api.post('/loans', {
				user_id: values.user_id,
				book_id: values.book_id,
				loan_date: values.loan_date.format('YYYY-MM-DD'),
				due_date: values.due_date.format('YYYY-MM-DD'),
			});
			message.success('Empréstimo registrado com sucesso');
			navigate('/loans');
		} catch {
			message.error('Erro ao registrar empréstimo');
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<Card title="Novo Empréstimo">
				<Spin />
			</Card>
		);
	}

	return (
		<Card
			title={
				<span>
					<MdSave style={{ marginRight: 8 }} />
					Novo Empréstimo
				</span>
			}
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				style={{ maxWidth: 500 }}
			>
				<Form.Item
					name="user_id"
					label="Leitor"
					rules={[{ required: true, message: 'Selecione um leitor' }]}
				>
					<Select
						showSearch
						placeholder="Selecione um leitor"
						optionFilterProp="label"
						options={readers.map((r) => ({
							value: r.id,
							label: `${r.name} (${r.email})`,
						}))}
					/>
				</Form.Item>

				<Form.Item
					name="book_id"
					label="Livro"
					rules={[{ required: true, message: 'Selecione um livro' }]}
				>
					<Select
						showSearch
						placeholder="Selecione um livro"
						optionFilterProp="label"
						options={books.map((b) => ({
							value: b.id,
							label: `${b.title} - ${b.author}`,
						}))}
					/>
				</Form.Item>

				<Form.Item
					name="loan_date"
					label="Data do Empréstimo"
					rules={[{ required: true, message: 'Selecione a data' }]}
				>
					<DatePicker
						format="DD/MM/YYYY"
						disabledDate={(d) => d.isBefore(dayjs(), 'day')}
						style={{ width: '100%' }}
					/>
				</Form.Item>

				<Form.Item
					name="due_date"
					label="Data de Devolução"
					dependencies={['loan_date']}
					rules={[
						{
							required: true,
							message: 'Selecione a data de devolução',
						},
						({ getFieldValue }) => ({
							validator(_, value) {
								const loanDate = getFieldValue('loan_date');
								if (!loanDate || !value)
									return Promise.resolve();
								if (value.isBefore(loanDate, 'day')) {
									return Promise.reject(
										new Error(
											'Data de devolução deve ser depois da data de empréstimo',
										),
									);
								}
								return Promise.resolve();
							},
						}),
					]}
				>
					<DatePicker
						format="DD/MM/YYYY"
						disabledDate={(d) => d.isBefore(dayjs(), 'day')}
						style={{ width: '100%' }}
					/>
				</Form.Item>

				<Form.Item>
					<Button
						type="primary"
						htmlType="submit"
						icon={<MdSave />}
						loading={submitting}
					>
						Salvar
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default LoanForm;
