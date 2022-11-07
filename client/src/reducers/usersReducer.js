const SET_USERS="SET_USERS"
const SET_USERSVIEW="SET_USERSVIEW"

const defaultState ={
    users: [],    
    usersview: 'list'
}

export default function usersReducer(state = defaultState, action){
    switch(action.type){
        case SET_USERS: 
            return {...state, users: action.payload}        
        case SET_USERSVIEW:            
            return {...state, usersview: action.payload}
        default:
            return state
    }
}

export const setUsers = (users) => ({type: SET_USERS, payload: users})
export const setUsersView = (payload) => ({type: SET_USERSVIEW, payload})
