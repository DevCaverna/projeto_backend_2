import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	Card,
	Table,
	Button,
	Input,
	Select,
	Switch,
	Tag,
	Popconfirm,
	Space,
	Image,
	Tooltip,
} from 'antd';
import {
	MdSearch,
	MdAdd,
	MdVisibility,
	MdEdit,
	MdDelete,
	MdBook,
} from 'react-icons/md';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const COVER_URL =
	'https://m.media-amazon.com/images/I/51NWH4A+7LL._SY445_SX342_ML2_.jpg';

const BookList = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [books, setBooks] = useState([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(false);
	const [searchTitle, setSearchTitle] = useState('');
	const [searchAuthor, setSearchAuthor] = useState('');
	const [searchCategory, setSearchCategory] = useState('');
	const [filterCategory, setFilterCategory] = useState(undefined);
	const [availableOnly, setAvailableOnly] = useState(false);

	const fetchBooks = useCallback(async () => {
		setLoading(true);
		try {
			const params = { page, limit };
			if (searchTitle) params.title = searchTitle;
			if (searchAuthor) params.author = searchAuthor;
			if (searchCategory) params.category = searchCategory;
			if (filterCategory) params.category = filterCategory;
			if (availableOnly) params.available = true;
			const res = await api.get('/books', { params });
			setBooks(res.data.books);
			setTotal(res.data.total);
			setTotalPages(res.data.totalPages);
		} catch {
			// ignore
		} finally {
			setLoading(false);
		}
	}, [
		page,
		limit,
		searchTitle,
		searchAuthor,
		searchCategory,
		filterCategory,
		availableOnly,
	]);

	useEffect(() => {
		fetchBooks();
	}, [fetchBooks]);

	const handleDelete = async (id) => {
		try {
			await api.delete(`/books/${id}`);
			fetchBooks();
		} catch {
			// ignore
		}
	};

	const categories = [
		...new Set(books.map((b) => b.category).filter(Boolean)),
	];

	const canEdit = user?.role === 'admin' || user?.role === 'librarian';

	const columns = [
		{
			title: 'Capa',
			dataIndex: 'cover_image',
			key: 'cover_image',
			width: 80,
			render: (cover) =>
				cover ? (
					<Image
						width={50}
						height={70}
						src={COVER_URL}
						style={{ objectFit: 'cover', borderRadius: 4 }}
					/>
				) : (
					<div
						className="cover-placeholder"
						style={{ width: 50, height: 70 }}
					>
						<MdBook size={24} color="#bfbfbf" />
					</div>
				),
		},
		{ title: 'Título', dataIndex: 'title', key: 'title', ellipsis: true },
		{ title: 'Autor', dataIndex: 'author', key: 'author', ellipsis: true },
		{ title: 'Categoria', dataIndex: 'category', key: 'category' },
		{ title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
		{
			title: 'Disponível/Total',
			key: 'quantity',
			render: (_, r) => `${r.available_quantity}/${r.total_quantity}`,
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status) => (
				<Tag color={status === 'available' ? 'green' : 'red'}>
					{status === 'available' ? 'Disponível' : 'Indisponível'}
				</Tag>
			),
		},
		{
			title: 'Ações',
			key: 'actions',
			render: (_, r) => (
				<Space onClick={(e) => e.stopPropagation()}>
					<Tooltip title="Visualizar">
						<Link to={`/books/${r.id}`}>
							<Button
								type="default"
								icon={<MdVisibility />}
								size="small"
							/>
						</Link>
					</Tooltip>
					{canEdit && (
						<>
							<Tooltip title="Editar">
								<Link to={`/books/${r.id}/edit`}>
									<Button
										type="default"
										icon={<MdEdit />}
										size="small"
									/>
								</Link>
							</Tooltip>
							<Popconfirm
								title="Excluir este livro?"
								onConfirm={() => handleDelete(r.id)}
							>
								<Tooltip title="Excluir">
									<Button
										danger
										icon={<MdDelete />}
										size="small"
									/>
								</Tooltip>
							</Popconfirm>
						</>
					)}
				</Space>
			),
		},
	];

	return (
		<Card
			title="Livros"
			extra={
				user?.role === 'admin' || user?.role === 'librarian' ? (
					<Button
						type="primary"
						icon={<MdAdd />}
						onClick={() => navigate('/books/new')}
					>
						Novo Livro
					</Button>
				) : null
			}
		>
			<Space direction="vertical" style={{ width: '100%' }} size="middle">
				<Space wrap>
					<Input.Search
						placeholder="Buscar título"
						prefix={<MdSearch />}
						allowClear
						onSearch={(val) => {
							setSearchTitle(val);
							setPage(1);
						}}
						style={{ width: 200 }}
					/>
					<Input.Search
						placeholder="Buscar autor"
						prefix={<MdSearch />}
						allowClear
						onSearch={(val) => {
							setSearchAuthor(val);
							setPage(1);
						}}
						style={{ width: 200 }}
					/>
					<Input.Search
						placeholder="Buscar categoria"
						prefix={<MdSearch />}
						allowClear
						onSearch={(val) => {
							setSearchCategory(val);
							setPage(1);
						}}
						style={{ width: 200 }}
					/>
					<Select
						allowClear
						placeholder="Filtrar categoria"
						style={{ width: 180 }}
						value={filterCategory}
						onChange={(val) => {
							setFilterCategory(val);
							setPage(1);
						}}
						options={categories.map((c) => ({
							label: c,
							value: c,
						}))}
					/>
					<Space>
						<span>Disponíveis</span>
						<Switch
							checked={availableOnly}
							onChange={(val) => {
								setAvailableOnly(val);
								setPage(1);
							}}
						/>
					</Space>
				</Space>
				<Table
					rowKey="id"
					dataSource={books}
					columns={columns}
					loading={loading}
					onRow={(r) => ({
						onClick: () => navigate(`/books/${r.id}`),
						style: { cursor: 'pointer' },
					})}
					pagination={{
						current: page,
						pageSize: limit,
						total,
						showTotal: (t) => `Total: ${t} livros`,
						onChange: (p) => setPage(p),
					}}
				/>
			</Space>
		</Card>
	);
};

export default BookList;
