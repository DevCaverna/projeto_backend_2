import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children, roles }) {
	const { user, loading } = useAuth();

	if (loading)
		return (
			<div style={{ textAlign: 'center', padding: '100px 0' }}>
				<Spin size="large" />
			</div>
		);
	if (!user) return <Navigate to="/login" replace />;
	if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
	return children;
}
