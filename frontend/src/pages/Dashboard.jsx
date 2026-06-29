import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin, message } from 'antd';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
} from 'recharts';
import { MdMenuBook, MdPeople, MdSwapHoriz, MdWarning } from 'react-icons/md';
import api from '../services/api';

const COLORS = [
	'#6366f1',
	'#f59e0b',
	'#10b981',
	'#ef4444',
	'#8b5cf6',
	'#ec4899',
	'#14b8a6',
	'#f97316',
];

const Dashboard = () => {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState(null);
	const [loansByMonth, setLoansByMonth] = useState([]);
	const [booksByCategory, setBooksByCategory] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [statsRes, loansRes, categoriesRes] = await Promise.all([
					api.get('/dashboard/stats'),
					api.get('/dashboard/loans-by-month'),
					api.get('/dashboard/books-by-category'),
				]);
				setStats(statsRes.data);
				setLoansByMonth(loansRes.data);
				setBooksByCategory(categoriesRes.data);
			} catch {
				message.error('Erro ao carregar dados do dashboard');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const categoriesData = booksByCategory.map((c) => ({
		...c,
		count: Number(c.count),
	}));

	if (loading) {
		return (
			<div style={{ textAlign: 'center', padding: 80 }}>
				<Spin size="large" />
			</div>
		);
	}

	const mostLoanedColumns = [
		{ title: 'Título', dataIndex: ['book', 'title'], key: 'title' },
		{ title: 'Autor', dataIndex: ['book', 'author'], key: 'author' },
		{
			title: 'Qtd. Empréstimos',
			dataIndex: 'loan_count',
			key: 'loan_count',
		},
	];

	return (
		<>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Total de Livros"
							value={stats.totalBooks}
							prefix={<MdMenuBook />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Total de Leitores"
							value={stats.totalReaders}
							prefix={<MdPeople />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Empréstimos Ativos"
							value={stats.activeLoans}
							prefix={<MdSwapHoriz />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Empréstimos em Atraso"
							value={stats.overdueLoans}
							prefix={<MdWarning />}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
				<Col xs={24} lg={12}>
					<Card title="Empréstimos por Mês">
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={loansByMonth}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="count" fill="#6366f1" />
							</BarChart>
						</ResponsiveContainer>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title="Livros por Categoria">
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={categoriesData}
									dataKey="count"
									nameKey="category"
									cx="50%"
									cy="50%"
									outerRadius={100}
									label
								>
									{categoriesData.map((_, index) => (
										<Cell
											key={index}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</Card>
				</Col>
			</Row>

			<Card title="Livros Mais Emprestados" style={{ marginTop: 16 }}>
				<Table
					dataSource={stats.mostLoaned}
					columns={mostLoanedColumns}
					rowKey="book_id"
					pagination={false}
				/>
			</Card>
		</>
	);
};

export default Dashboard;
