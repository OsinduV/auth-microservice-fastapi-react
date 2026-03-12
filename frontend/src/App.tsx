import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app/routes';
import { AuthProvider } from './modules/auth/context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
