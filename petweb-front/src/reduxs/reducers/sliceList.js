const sliceListReducer = (state = [], action) => {
  switch(action.type){
    case 'EMPTY_SLICES':
      return []
    case 'ADD_SLICES':
      return [
        ...state, 
        {fileID:action.fileID, B64:action.slices,}
      ]
    case 'UPDATE_SLICES':
      return state.map((v, i) => {
        if (v.fileID == action.fileID) {
          return {
              ...v, 
              B64:action.slices,
            }
        } else {
          return {
            ...v, 
          }
        }
      });
    default:
      return [...state]
  }
}
export default sliceListReducer;