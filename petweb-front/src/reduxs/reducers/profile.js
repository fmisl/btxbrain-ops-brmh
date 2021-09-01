const profileReducer = (state = {username:''}, action) => {
  switch(action.type){
    case 'PROFILE':
      return action.username;
    default:
      return 'Anonymous';
  }
}
export default profileReducer;