import { resetAuthState, clearCurrentUser } from './store';
import { setAuthFailureHandler } from './services/api';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import { store } from './store';
import App from './App.tsx';

import './styles/tailwind.css';
import './styles/fonts.css';
import './styles/theme.css';
import './styles/index.css';

setAuthFailureHandler(() => {
    store.dispatch(resetAuthState());
    store.dispatch(clearCurrentUser());
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
