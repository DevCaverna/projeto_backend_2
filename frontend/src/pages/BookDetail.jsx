import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Card,
	Descriptions,
	Button,
	Image,
	Tag,
	Spin,
	Space,
	Popconfirm,
	message,
} from 'antd';
import {
	MdEdit,
	MdDelete,
	MdArrowBack,
	MdBook,
	MdLibraryBooks,
	MdVisibility,
} from 'react-icons/md';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const COVER_URL =
	'https://m.media-amazon.com/images/I/51NWH4A+7LL._SY445_SX342_ML2_.jpg';

const formatDate = (d) => {
	if (!d) return '-';
	try {
		return new Date(d).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	} catch {
		return '-';
	}
};

const BookDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const [book, setBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const [borrowing, setBorrowing] = useState(false);
	const [hasActiveLoan, setHasActiveLoan] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [bookRes, loansRes] = await Promise.all([
					api.get(`/books/${id}`),
					user?.role === 'reader'
						? api.get('/loans/my').catch(() => null)
						: Promise.resolve(null),
				]);
				setBook(bookRes.data);
				if (loansRes?.data) {
					const myLoans = Array.isArray(loansRes.data)
						? loansRes.data
						: loansRes.data.loans || [];
					const active = myLoans.some(
						(l) =>
							l.status === 'open' &&
							(l.book_id === Number(id) ||
								l.book?.id === Number(id) ||
								l.items?.some(
									(item) =>
										item.book_id === Number(id) ||
										item.book?.id === Number(id),
								)),
					);
					setHasActiveLoan(active);
				}
			} catch {
				message.error('Erro ao carregar livro');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [id, user?.role]);

	const handleDelete = async () => {
		try {
			await api.delete(`/books/${id}`);
			message.success('Livro excluído');
			navigate('/books');
		} catch {
			message.error('Erro ao excluir livro');
		}
	};

	const handleBorrow = async () => {
		setBorrowing(true);
		try {
			const today = new Date();
			const due = new Date(today);
			due.setDate(due.getDate() + 14);
			const fmt = (d) => d.toISOString().split('T')[0];
			await api.post('/loans', {
				book_id: book.id,
				loan_date: fmt(today),
				due_date: fmt(due),
			});
			message.success('Empréstimo realizado com sucesso');
			const res = await api.get(`/books/${id}`);
			setBook(res.data);
		} catch (err) {
			message.error(
				err.response?.data?.error || 'Erro ao realizar empréstimo',
			);
		} finally {
			setBorrowing(false);
		}
	};

	if (loading)
		return (
			<Spin
				size="large"
				style={{ display: 'block', margin: '100px auto' }}
			/>
		);
	if (!book)
		return (
			<Card>
				<p>Livro não encontrado.</p>
			</Card>
		);

	const statusColor = book.status === 'available' ? 'green' : 'red';
	const canEdit = user?.role === 'admin' || user?.role === 'librarian';
	const isReader = user?.role === 'reader';

	return (
		<Card
			title={
				<Space>
					<Button
						icon={<MdArrowBack />}
						onClick={() => navigate('/books')}
						type="text"
					/>
					<span>{book.title}</span>
				</Space>
			}
			extra={
				<Space>
					{isReader && hasActiveLoan && (
						<Button
							icon={<MdVisibility />}
							onClick={() => navigate('/my-loans')}
						>
							Ver empréstimo
						</Button>
					)}
					{isReader &&
						!hasActiveLoan &&
						book.status === 'available' && (
							<Button
								type="primary"
								icon={<MdLibraryBooks />}
								loading={borrowing}
								onClick={handleBorrow}
							>
								Pegar emprestado
							</Button>
						)}
					{canEdit && (
						<Button
							icon={<MdEdit />}
							onClick={() => navigate(`/books/${book.id}/edit`)}
						>
							Editar
						</Button>
					)}
					{canEdit && (
						<Popconfirm
							title="Excluir este livro?"
							onConfirm={handleDelete}
						>
							<Button danger icon={<MdDelete />}>
								Excluir
							</Button>
						</Popconfirm>
					)}
				</Space>
			}
		>
			<Space align="start" size="large" wrap>
				{book.cover_image ? (
					<Image
						width={180}
						src={COVER_URL}
						style={{ objectFit: 'cover', borderRadius: 8 }}
					/>
				) : (
					<div
						style={{
							width: 180,
							height: 270,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: '#f5f5f5',
							borderRadius: 8,
							border: '1px solid #d9d9d9',
						}}
					>
						<MdBook size={64} color="#bfbfbf" />
					</div>
				)}
				<Descriptions column={1} bordered style={{ minWidth: 400 }}>
					<Descriptions.Item label="Título">
						{book.title}
					</Descriptions.Item>
					<Descriptions.Item label="Autor">
						{book.author}
					</Descriptions.Item>
					<Descriptions.Item label="Editora">
						{book.publisher}
					</Descriptions.Item>
					<Descriptions.Item label="Ano">
						{book.year}
					</Descriptions.Item>
					<Descriptions.Item label="Categoria">
						{book.category}
					</Descriptions.Item>
					<Descriptions.Item label="ISBN">
						{book.isbn}
					</Descriptions.Item>
					<Descriptions.Item label="Quantidade Total">
						{book.total_quantity}
					</Descriptions.Item>
					<Descriptions.Item label="Quantidade Disponível">
						{book.available_quantity}
					</Descriptions.Item>
					<Descriptions.Item label="Status">
						<Tag color={statusColor}>
							{book.status === 'available'
								? 'Disponível'
								: 'Indisponível'}
						</Tag>
					</Descriptions.Item>
					<Descriptions.Item label="Criado em">
						{formatDate(book.createdAt || book.created_at)}
					</Descriptions.Item>
					<Descriptions.Item label="Última atualização">
						{formatDate(book.updatedAt || book.updated_at)}
					</Descriptions.Item>
				</Descriptions>
			</Space>
		</Card>
	);
};

export default BookDetail;
