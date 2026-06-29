import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<Result
			status="404"
			title="Página não encontrada"
			subTitle="A página que você procura não existe."
			extra={
				<Button type="primary" onClick={() => navigate('/books')}>
					Voltar para Livros
				</Button>
			}
		/>
	);
};

export default NotFound;
