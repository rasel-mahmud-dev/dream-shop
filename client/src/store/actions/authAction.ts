import { ACTION_TYPES, Scope } from "store/types";
import apis, { getApi } from "src/apis";
import errorMessageCatch from "src/utills/errorMessageCatch";

export const loginHandler = (user, dispatch) => {
	dispatch({
		type: ACTION_TYPES.LOGIN,
		payload: user,
	});
};

function setToken(token) {
    window.localStorage.setItem("token", token)
}

// login action for customer, seller and admin user separately
export const loginAction = async (userData, dispatch, scope: Scope, cb: (data: object, errorMessage?: string) => void) => {
    try {
        const { status, data } = await apis.post("/api/auth/login", { ...userData, scope: scope });
        if (status === 201) {
            loginHandler(data.user,  dispatch)
            setToken(data.token)
            cb && cb(data.user, "")
        } else {
            cb && cb({}, "unable to connect with server")
        }
        
    } catch (ex) {
        cb && cb({}, errorMessageCatch(ex))
    }
}


export const registrationAction = async (userData, scope: Scope, dispatch, cb: (data: object, errorMessage?: string) => void) => {
    
    try {
        const {data, status} = await apis.post("/api/auth/registration", userData)
        if (status === 201) {
            loginHandler(data.user,  dispatch)
            cb && cb(data.user, "")
        } else {
            cb && cb({}, "Error")
        }
    } catch (ex) {
        cb && cb({}, errorMessageCatch(ex))
    }
    
}

export const currentAuthAction = async (dispatch, scope: Scope, cb) => {
    try {
     
        let response = await getApi().get("/api/auth/current-auth?scope="+scope)
        if (response.status === 200) {
            cb && cb(null, response.data)
            loginHandler(response.data,  dispatch)
        } else {
            cb && cb("login fail", null)
        }
    } catch (ex) {
        cb && cb(errorMessageCatch(ex), null)
        loginHandler(null,  dispatch)
    }
}

export const logoutAction = (dispatch) => {
    window.localStorage.removeItem("token")
    loginHandler(null,  dispatch)
}
