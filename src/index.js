import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './Routes';
import { ParallaxProvider } from 'react-skrollr';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import store from './store';

ReactDOM.render(<Provider store={store}>
        <ParallaxProvider
            init={{
                smoothScrollingDuration: 500,
                smoothScrolling: true,
                forceHeight: false
            }}>
            <Router />
        </ParallaxProvider>
</Provider>,
    document.getElementById('root'));
registerServiceWorker();
