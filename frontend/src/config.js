export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const assetUrl = (path) => {
	if (!path) return '';
	if (/^https?:\/\//i.test(path)) return path;
	if (!path.startsWith('/uploads/') && !path.startsWith('uploads/')) return '';
	return `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
