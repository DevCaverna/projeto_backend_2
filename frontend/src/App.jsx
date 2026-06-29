import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import BookList from './pages/BookList';
import BookForm from './pages/BookForm';
import BookDetail from './pages/BookDetail';
import ReaderList from './pages/ReaderList';
import ReaderForm from './pages/ReaderForm';
import ReaderDetail from './pages/ReaderDetail';
import LoanList from './pages/LoanList';
import LoanForm from './pages/LoanForm';
import MyLoans from './pages/MyLoans';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import NotFound from './pages/NotFound';

export default function App() {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#6366f1',
					borderRadius: 6,
				},
			}}
		>
			<BrowserRouter>
				<AuthProvider>
					<NotificationProvider>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route
								path="/forgot-password"
								element={<ForgotPassword />}
							/>
							<Route
								element={
									<PrivateRoute>
										<MainLayout />
									</PrivateRoute>
								}
							>
								<Route
									path="/"
									element={<Navigate to="/books" replace />}
								/>
								<Route
									path="/dashboard"
									element={
										<PrivateRoute
											roles={['admin', 'librarian']}
										>
											<Dashboard />
										</PrivateRoute>
									}
								/>
								<Route path="/books" element={<BookList />} />
								<Route
									path="/books/new"
									element={
										<PrivateRoute
											roles={['admin', 'librarian']}
										>
											<BookForm />
										</PrivateRoute>
									}
								/>
								<Route
									path="/books/:id"
									element={<BookDetail />}
								/>
								<Route
									path="/books/:id/edit"
									element={
										<PrivateRoute
											roles={['admin', 'librarian']}
										>
											<BookForm />
										</PrivateRoute>
									}
								/>
								<Route
									path="/readers"
									element={
										<PrivateRoute
											roles={['admin', 'librarian']}
										>
											<ReaderList />
										</PrivateRoute>
									}
								/>
								<Route
									path="/readers/new"
									element={
										<PrivateRoute
											roles={['admin', 'librarian']}
										>
											<ReaderForm />
										</PrivateRoute>
									}
								/>
								<Route
									path="/readers/:id"
									element={
										<PrivateRoute
											roles={['admin', 'librarian']}
										>
											<ReaderDetail />
										</PrivateRoute>
									}
								/>
								<Route
									path="/readers/:id/edit"
									element={
										<PrivateRoute
											roles={['admin', 'librarian']}
										>
											<ReaderForm />
										</PrivateRoute>
									}
								/>
								<Route
									path="/loans"
									element={
										<PrivateRoute
											roles={['admin', 'librarian']}
										>
											<LoanList />
										</PrivateRoute>
									}
								/>
								<Route
									path="/loans/new"
									element={
										<PrivateRoute
											roles={['admin', 'librarian']}
										>
											<LoanForm />
										</PrivateRoute>
									}
								/>
								<Route
									path="/loans/overdue"
									element={
										<PrivateRoute
											roles={['admin', 'librarian']}
										>
											<LoanList />
										</PrivateRoute>
									}
								/>
								<Route
									path="/my-loans"
									element={
										<PrivateRoute roles={['reader']}>
											<MyLoans />
										</PrivateRoute>
									}
								/>
								<Route
									path="/users"
									element={
										<PrivateRoute roles={['admin']}>
											<UserList />
										</PrivateRoute>
									}
								/>
								<Route
									path="/users/new"
									element={
										<PrivateRoute roles={['admin']}>
											<UserForm />
										</PrivateRoute>
									}
								/>
								<Route
									path="*"
									element={
										<PrivateRoute>
											<NotFound />
										</PrivateRoute>
									}
								/>
							</Route>
						</Routes>
					</NotificationProvider>
				</AuthProvider>
			</BrowserRouter>
		</ConfigProvider>
	);
}
