const counterReducer = (state = {tabX:null, tabY:0, fileID:null}, action) => {
  switch(action.type){
    // case 'INCREMENT':
    //   return Math.min(action.max-1, state + 1);
    // case 'DECREMENT':
    //   return Math.max(0,state - 1);
    case 'TAB_LOC':
      return {...state, tabX: action.tabX, tabY: action.tabY, fileID: action.fileID};
    default:
      return state;
  }
}
export default counterReducer;