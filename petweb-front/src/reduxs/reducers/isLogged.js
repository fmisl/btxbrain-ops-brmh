const loggedReducer = (state = false, action) => {
  switch(action.type){
    case 'LOGIN':
      return true;
    case 'LOGOUT':
      return false;
    default:
      return localStorage.getItem('token') ? true : false;
  }
}
export default loggedReducer;