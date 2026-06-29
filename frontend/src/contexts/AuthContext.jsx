import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const stored = localStorage.getItem('user');
		const token = localStorage.getItem('token');
		if (stored && token) {
			try {
				setUser(JSON.parse(stored));
			} catch {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				setUser(null);
			}
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		const handleLogout = () => logout();
		window.addEventListener('auth:logout', handleLogout);
		return () => window.removeEventListener('auth:logout', handleLogout);
	}, []);

	const login = async (email, password) => {
		const { data } = await api.post('/auth/login', { email, password });
		localStorage.setItem('token', data.token);
		localStorage.setItem('user', JSON.stringify(data.user));
		setUser(data.user);
		return data.user;
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
	};

	const value = useMemo(
		() => ({ user, loading, login, logout }),
		[user, loading],
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
	return ctx;
};
