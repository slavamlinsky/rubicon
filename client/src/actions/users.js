import axios from 'axios'
import { hidePreloader, showPreloader } from '../reducers/appReducer';
import { setUsers } from '../reducers/usersReducer';

import {API_URL} from "../config";
import { Navigate } from 'react-router-dom';

export function getUsers(sort) {

    return async dispatch => {
        try {
            dispatch(showPreloader())
            let url = `${API_URL}api/users`

            
            if(sort){
                url = `${API_URL}api/users?sort=${sort}`
            }
            
            const response = await axios.get(url, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })

            console.log(response.data)
            dispatch(setUsers(response.data))
            
        } catch (e) {
            console.log(e?.response?.data?.message) 
            if(e?.response?.data?.message=="Auth error"){
                // если ошибка авторизации - перекидываем на страницу авторизации
                <Navigate to="/login" />

            }
        } finally {
            dispatch(hidePreloader())
        }
    }
}

// export function searchUser(search) {
//     return async dispatch => {
//         try {
//             const response = await axios.get(`${API_URL}api/files/search?search=${search}`,{
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`
//                 }
//             })
            
//             dispatch(setFiles(response.data))
//             //alert(response.data.message)
            
//         } catch (e) {
//             console.log(e.response.data.message)            
//         } finally {
//             dispatch(hidePreloader())
//         }
//     }
// }
