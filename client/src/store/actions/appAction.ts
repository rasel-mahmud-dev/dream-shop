import { ACTION_TYPES } from "../types"


export const toggleNotify=(status, notificationType, message)=>{ 
  return {
    type: ACTION_TYPES.TOGGLE_NOTIFY,
    payload: {message: message, isNotify: status, notificationType}  
  }
}


export const closeNotify=()=>{ 
  return {
    type: ACTION_TYPES.TOGGLE_NOTIFY,
    payload: {message: "", isNotify: false, notificationType: ""}  
  }
}


export const toggleBackdrop=(data: {isOpen: boolean, scope: "app" | "global" | "custom"})=>{
  return {
    type: ACTION_TYPES.TOGGLE_BACKDROP,
    payload: data
  }
}

