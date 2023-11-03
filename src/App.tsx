import { FC } from 'react';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import store from './store/index';

const App: FC = () => {
    return (
        <Provider store={store}>
            <Outlet />
        </Provider>
    );
}

export default App;