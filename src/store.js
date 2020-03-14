
import rootReducers from './reducer/rootReducer';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(rootReducers, applyMiddleware(thunk));
export default store;