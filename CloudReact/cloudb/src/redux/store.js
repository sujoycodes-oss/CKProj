import { createStore, combineReducers } from 'redux';
// import {thunk} from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
// import storageSession from 'redux-persist/lib/storage/session'; 
import authReducer from './reducers/authReducer';
import storage from 'redux-persist/lib/storage'; 


const persistConfig = {
    key: "root",
    storage,
    whitelist: ['auth']
};

const rootReducer = combineReducers({
    auth: authReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export const persistor = persistStore(store);
