import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, theme } from 'antd';
import {
	MdMenuBook,
	MdPeople,
	MdSwapHoriz,
	MdDashboard,
	MdPeopleAlt,
	MdAdd,
	MdLogout,
	MdLibraryBooks,
	MdWarning,
} from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const menuItems = [
		...(user?.role !== 'reader'
			? [
					{
						key: '/dashboard',
						icon: <MdDashboard />,
						label: 'Dashboard',
					},
				]
			: []),
		{
			key: '/books',
			icon: <MdMenuBook />,
			label: 'Livros',
			...(user?.role !== 'reader'
				? {
						children: [
							{
								key: '/books',
								icon: <MdLibraryBooks />,
								label: 'Todos os Livros',
							},
							{
								key: '/books/new',
								icon: <MdAdd />,
								label: 'Novo Livro',
							},
						],
					}
				: {}),
		},
		...(user?.role !== 'reader'
			? [
					{
						key: '/readers',
						icon: <MdPeople />,
						label: 'Leitores',
						children: [
							{
								key: '/readers',
								icon: <MdPeople />,
								label: 'Todos os Leitores',
							},
							{
								key: '/readers/new',
								icon: <MdAdd />,
								label: 'Novo Leitor',
							},
						],
					},
				]
			: []),
		...(user?.role === 'admin' || user?.role === 'librarian'
			? [
					{
						key: '/loans',
						icon: <MdSwapHoriz />,
						label: 'Empréstimos',
						children: [
							{
								key: '/loans',
								icon: <MdSwapHoriz />,
								label: 'Todos',
							},
							{
								key: '/loans/new',
								icon: <MdAdd />,
								label: 'Novo Empréstimo',
							},
							{
								key: '/loans/overdue',
								icon: <MdWarning />,
								label: 'Atrasados',
							},
						],
					},
				]
			: []),
		...(user?.role === 'reader'
			? [
					{
						key: '/my-loans',
						icon: <MdSwapHoriz />,
						label: 'Meus Empréstimos',
					},
				]
			: []),
		...(user?.role === 'admin'
			? [
					{
						key: '/users',
						icon: <MdPeopleAlt />,
						label: 'Usuários',
						children: [
							{
								key: '/users',
								icon: <MdPeopleAlt />,
								label: 'Todos os Usuários',
							},
							{
								key: '/users/new',
								icon: <MdAdd />,
								label: 'Novo Usuário',
							},
						],
					},
				]
			: []),
	];

	const getSelectedKey = () => {
		const path = location.pathname;
		if (path.startsWith('/books')) return '/books';
		if (path.startsWith('/readers')) return '/readers';
		if (path.startsWith('/loans')) return '/loans';
		if (path.startsWith('/users')) return '/users';
		if (path.startsWith('/my-loans')) return '/my-loans';
		if (path.startsWith('/dashboard')) return '/dashboard';
		return path;
	};

	const getOpenKey = () => {
		const path = location.pathname;
		if (path.startsWith('/books')) return '/books';
		if (path.startsWith('/readers')) return '/readers';
		if (path.startsWith('/loans')) return '/loans';
		if (path.startsWith('/users')) return '/users';
		return null;
	};

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={setCollapsed}
				theme="dark"
				width={220}
			>
				<div className="site-logo">
					<MdMenuBook size={24} />
					{!collapsed && 'Biblioteca'}
				</div>
				<Menu
					theme="dark"
					mode="inline"
					selectedKeys={[getSelectedKey()]}
					defaultOpenKeys={[getOpenKey()]}
					items={menuItems}
					onClick={({ key }) => navigate(key)}
				/>
			</Sider>
			<Layout>
				<Header
					style={{
						background: colorBgContainer,
						padding: '0 24px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						borderBottom: '1px solid #f0f0f0',
					}}
				>
					<div style={{ fontWeight: 600, fontSize: 16 }}>
						{location.pathname === '/dashboard' && 'Dashboard'}
						{location.pathname.startsWith('/books') && 'Livros'}
						{location.pathname.startsWith('/readers') && 'Leitores'}
						{location.pathname.startsWith('/loans') &&
							'Empréstimos'}
						{location.pathname.startsWith('/users') && 'Usuários'}
						{location.pathname.startsWith('/my-loans') &&
							'Meus Empréstimos'}
					</div>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 16,
						}}
					>
						<NotificationBell />
						<span style={{ color: '#666' }}>{user?.name}</span>
						<Button
							type="text"
							icon={<MdLogout size={18} />}
							onClick={handleLogout}
						>
							Sair
						</Button>
					</div>
				</Header>
				<Content
					style={{
						margin: 24,
						padding: 24,
						background: colorBgContainer,
						borderRadius: borderRadiusLG,
						minHeight: 280,
					}}
				>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
}
