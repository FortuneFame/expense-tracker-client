import { FC } from 'react';
// import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import AuthProvider from './Context/Provider/AuthProvider';
// import store from './store/index';

const App: FC = () => {
    return (
        <AuthProvider>
        {/* // <Provider store={store}> */}
            <Outlet />
        {/* // </Provider> */}
    </AuthProvider>
            );
}

export default App;