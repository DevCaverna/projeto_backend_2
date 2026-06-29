import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
	const { user } = useAuth();
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);

	const fetchNotifications = useCallback(async () => {
		if (!user) return;
		try {
			const { data } = await api.get('/notifications');
			setNotifications(data);
			const count = data.filter((n) => !n.read).length;
			setUnreadCount(count);
		} catch (e) {
			/* ignore */
		}
	}, [user]);

	useEffect(() => {
		fetchNotifications();
		const interval = setInterval(fetchNotifications, 30000);
		return () => clearInterval(interval);
	}, [fetchNotifications]);

	const markAsRead = async (id) => {
		await api.patch(`/notifications/${id}/read`);
		fetchNotifications();
	};

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				unreadCount,
				markAsRead,
				fetchNotifications,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
}

export const useNotifications = () => useContext(NotificationContext);
