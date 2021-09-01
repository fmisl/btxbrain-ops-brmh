const stackManagerReducer = (state = [], action) => {
  switch(action.type){
    case 'RESET_STACK':
      return []
    case 'ADD_STACK':
      return [...action.Stack];
    case 'UPDATE_STACK':
      return action.Stack.map((v, i) => {
        if (v.fileID === action.Stack.fileID) 
          return {...v, currentC:action.Stack.currentC, currentS: action.Stack.currentS, currentA: action.Stack.currentA}
        else return {...v}
        });
    case 'REMOVE_STACK':
      return state.filter((v, i) => {return v.fileID !== action.fileID});
    default:
      return state;
  }
}
export default stackManagerReducer;