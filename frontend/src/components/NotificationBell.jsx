import { useState, useRef } from 'react';
import { Badge, Popover, List, Typography, Empty } from 'antd';
import { MdNotifications } from 'react-icons/md';
import { useNotifications } from '../contexts/NotificationContext';

const { Text, Small } = Typography;

export default function NotificationBell() {
	const { notifications, unreadCount, markAsRead, fetchNotifications } =
		useNotifications();
	const [open, setOpen] = useState(false);

	const content = (
		<div style={{ width: 360, maxHeight: 400, overflowY: 'auto' }}>
			{notifications.length === 0 ? (
				<Empty
					description="Nenhuma notificação"
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			) : (
				<List
					dataSource={notifications}
					renderItem={(n) => (
						<List.Item
							onClick={() => {
								markAsRead(n.id);
							}}
							style={{
								cursor: 'pointer',
								background: n.read ? 'transparent' : '#e6f4ff',
								padding: '8px 12px',
							}}
						>
							<List.Item.Meta
								description={
									<>
										<Text style={{ fontSize: 13 }}>
											{n.message}
										</Text>
										<br />
										<Text
											type="secondary"
											style={{ fontSize: 11 }}
										>
											{new Date(
												n.created_at,
											).toLocaleDateString('pt-BR')}
										</Text>
									</>
								}
							/>
						</List.Item>
					)}
				/>
			)}
		</div>
	);

	return (
		<Popover
			content={content}
			title="Notificações"
			trigger="click"
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (v) fetchNotifications();
			}}
		>
			<Badge
				count={unreadCount}
				size="small"
				style={{ cursor: 'pointer' }}
			>
				<MdNotifications
					size={20}
					style={{ cursor: 'pointer', verticalAlign: 'middle' }}
				/>
			</Badge>
		</Popover>
	);
}
