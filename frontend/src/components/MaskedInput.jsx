import { Input } from 'antd';

const strip = (v) => (v || '').replace(/\D/g, '');

const maskCpf = (digits) => {
	const d = strip(digits).slice(0, 11);
	if (d.length <= 3) return d;
	if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
	if (d.length <= 9)
		return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
	return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const maskPhone = (digits) => {
	const d = strip(digits).slice(0, 11);
	if (d.length <= 2) return `(${d}`;
	if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
	return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export const CpfInput = ({ value, onChange, ...props }) => (
	<Input
		value={value ? maskCpf(value) : ''}
		onChange={(e) => onChange?.(strip(e.target.value))}
		maxLength={14}
		{...props}
	/>
);

export const PhoneInput = ({ value, onChange, ...props }) => (
	<Input
		value={value ? maskPhone(value) : ''}
		onChange={(e) => onChange?.(strip(e.target.value))}
		maxLength={15}
		{...props}
	/>
);

export function formatCpf(v) {
	return v ? maskCpf(v) : '-';
}

export function formatPhone(v) {
	return v ? maskPhone(v) : '-';
}
