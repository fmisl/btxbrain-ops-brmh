import axios from "axios";
import {IPinUSE} from '../../services/IPs'
import * as services from '../../services/fetchApi'
export function loadItems (data){
  return async dispatch => {
    try {
      const dataRes = await axios.get(IPinUSE+"testing/",{
          headers:{
            'Authorization':'jwt '+data.token
            }
        }).then(res => res.data)
        dispatch(fetchItems(dataRes));
    } catch (err) {

    }
  }
}
// const res3 = await service.getCase({'token':token, id:caseID})
export function loadSlices (data){
  return async dispatch => {
    try {
      const dataRes = await axios.get(IPinUSE+"testing/viewer/"+data.fileID+"/",{
          headers:{
            'Authorization':'jwt '+data.token
            }
        }).then(res => res.data)
        dispatch(addSlices(dataRes,data.fileID));
    } catch (err) {

    }
  }
}
export const emptySlices = () =>{
  return{
    type: 'EMPTY_SLICES',
  }
}
export const addSlices = (slices,fileID) =>{
  return{
    type: 'ADD_SLICES',
    slices: slices,
    fileID: fileID,
  }
}
export function resetSlices (data){
  return async dispatch => {
    try {
      const dataRes = await axios.get(IPinUSE+"testing/viewer/"+data.fileID+"/",{
          headers:{
            'Authorization':'jwt '+data.token
            }
        }).then(res => res.data)
        dispatch(updateSlices(dataRes,data.fileID));
    } catch (err) {

    }
  }
}
export const updateSlices = (slices,fileID) =>{
  return{
    type: 'UPDATE_SLICES',
    slices: slices,
    fileID: fileID,
  }
}
// export const removeSlices = (fileID) =>{
//   return{
//     type: 'REMOVE_SLICES',
//     fileID: fileID,
//   }
// }
export const resetItems = () =>{
  return{
    type: 'RESET_ITEMS',
  }
}
export const fetchItems = (items) =>{
  return{
    type: 'FETCH_ITEMS',
    items: items,
  }
}
export const increment = (max) =>{
  return {
    type: 'INCREMENT',
    max: max
  };
};
export const decrement = (max) =>{
  return {
    type: 'DECREMENT',
    max: max
  };
};
export const updateCentiloid = (items) =>{
  return {
    type: 'UPDATE_CENTILOID',
    items: items
  };
};
export const tab_location = (loc) =>{
  return {
    type: 'TAB_LOC',
    tabX: loc.tabX,
    tabY: loc.tabY,
    fileID: loc.fileID,
  };
};
export const login = () =>{
  return {
    type: 'LOGIN',
  };
};
export const logout = () =>{
  return {
    type: 'LOGOUT',
  };
};
export const profile = (text) =>{
  return {
    type: 'PROFILE',
    username: text
  };
};
export const resetStack = () =>{
  return {
    type: 'RESET_STACK',
  }
}
export const addStack = (Stack) =>{
  return {
    type: 'ADD_STACK',
    Stack: Stack,
  }
}
export const updateStack = (Stack) =>{
  return {
    type: 'UPDATE_STACK',
    Stack: Stack,
  }
}
export const removeStack = (fileID) =>{
  return {
    type: 'REMOVE_STACK',
    fileID: fileID,
  }
}
export const changeColor = (color) =>{
  return{
    type: 'CHANGE_COLOR',
    color: color,
  }
}
export const openSelect = () =>{
  return {
    type: 'OPEN_SELECT',
  }
}
export const openItem = (itemID) =>{
  return {
    type: 'OPEN_ITEM',
    itemID: itemID,
  }
}
export const closeItem = (itemID) =>{
  return {
    type: 'CLOSE_ITEM',
    itemID: itemID,
  }
}
export const selectItem = (itemID) =>{
  return {
    type: 'SELECT_ITEM',
    itemID: itemID,
  }
}
export const unselectItem = (itemID) =>{
  return {
    type: 'UNSELECT_ITEM',
    itemID: itemID,
  }
}
export const groupItem = (groupID) =>{
  return {
    type: 'GROUP_ITEM',
    groupID: groupID,
  }
}
export const ungroupItemSelect = () =>{
  return {
    type: 'UNGROUP_ITEM_SELECT',
  }
}
export const ungroupItemIndividual = (itemID) =>{
  return {
    type: 'UNGROUP_ITEM_INDIVIDUAL',
    itemID: itemID,
  }
}
export const selectAllTrue = () =>{
  return {
    type: 'SELECT_ALL_TRUE',
  }
}
export const selectAllFalse = () =>{
  return {
    type: 'SELECT_ALL_FALSE',
  }
}
export const selectAllGroup = (groupID) =>{
  return {
    type: 'SELECT_ALL_GROUP',
    groupID: groupID,
  }
}
export const unSelectAllGroup = (groupID) =>{
  return {
    type: 'UNSELECT_ALL_GROUP',
    groupID: groupID,
  }
}