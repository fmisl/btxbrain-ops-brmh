import counterReducer from './counter';
import loggedReducer from './isLogged';
import stackManagerReducer from './stackManager';
import fileListReducer from './fileList';
import sliceListReducer from './sliceList';
import {combineReducers} from 'redux';

  //counter: counterReducer
const allReducers = combineReducers({
  counter: counterReducer,
  isLogged: loggedReducer,
  stackManager: stackManagerReducer,
  fileList: fileListReducer,
  sliceList: sliceListReducer,
})
export default allReducers;