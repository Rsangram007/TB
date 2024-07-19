import React from 'react';
import ReactDOM from 'react-dom';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

const store = configureStore();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Provider store={store}>
        <div>
          <App />
          <ToastContainer
            position="top-center"
            autoClose={3000}
            pauseOnHover={false}
            theme="dark"
          />
        </div>
      </Provider>
    </AuthProvider>
  </BrowserRouter>
);
