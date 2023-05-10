import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { store } from './app/store';
import App from './App';
import GlobalStyles from './components/GlobalStyles';
import MyErrorBoundary from './layouts/components/ErrorBoundary/ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <GlobalStyles>
            <Router>
                <MyErrorBoundary>
                    <App />
                </MyErrorBoundary>
            </Router>
        </GlobalStyles>
    </Provider>
);
