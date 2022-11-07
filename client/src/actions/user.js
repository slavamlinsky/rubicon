import axios from 'axios'
import { setUser, updated, registred } from '../reducers/userReducer'
import { hidePreloader, showPreloader } from '../reducers/appReducer';
import {API_URL} from "../config";
import { getError } from '../reducers/appReducer';


export const registration = (name, email, password) => {
    
    return async dispatch => {
        try {            
            const params = {name, email, password}
    
            const response = await axios.post(`${API_URL}api/auth/registration`, params)        
            //dispatch(setUser(response.data.user))
            //alert(response.data.user.email)
            dispatch(registred(response.data.user))

            //alert(response.data.message + response.status + response.statusText)
            //localStorage.setItem('token', response.data.token)
            //console.log(response.data);
        } catch (e) {
            //alert(e)      
            console.log(e.response.data.errors);
            dispatch(getError(e.response.data.message))   
            
        }
    }   

    // return async dispatch => {
    //     try {
    //         const params = {name, email, password}

    //         await axios.post(`${API_URL}api/auth/registration`, params).then(response =>{
    //             //alert("THIS IS")
    //             alert(response.data.message + response.status + response.statusText)
               
    //             //вот здесь меняем статус isRegisted на true                
    //             if(response.status===200){
    //                 //alert("Профиль обновлён успешно!")
    //                 dispatch(registred(true))                 
    //             }

    //         }).catch(e => {
    //             console.log(e.message);
    //         })                   

    //     } catch (e) {        
    //         console.log(e);
    //     } 
        
    // }  


    // const params = {name, email, password}

    // await axios.post(`${API_URL}api/auth/registration`, params).then(response =>{
    //     //alert("THIS IS")
    //     alert(response.data.message + response.status + response.statusText)
    //     //вот здесь меняем статус isRegisted на true
    //     //dispatch(registred(true)) 

    // }).catch(e => {
    //     console.log(e.message);
    //     alert(e.message)
    //     //console.log(e.response);
    //     //alert(e.response.status + e.response.message)

    // })
        

    //try {
        //alert (name);
        //alert (email);
        //alert (password);
        //const params = {name, email, password}

        // перед добавлением пользователя желательно проверить (не занят ли email)

        //const response = await axios.post(`${API_URL}api/auth/registration`, params)
        //alert(response.data.message + response.status + response.statusText)
        
        // либо показываем сообщение об успешной регистрации
        // уведомление о необходимости подтвердить регистрацию по ссылке в почте
        // -> /ru/email/verify

        // - вариант автоматической переадресации на страницу авторизации
        //document.location.href="/login";
    // } catch (e) {
    //     alert("Здесь" + e)        
    // }
    
}

export const login = (email, password) => {
    return async dispatch => {
        try {            
            const params = {email, password}
    
            const response = await axios.post(`${API_URL}api/auth/login`, params)        
            //console.log(response.data.user);
            dispatch(setUser(response.data.user))
            dispatch(getError(""))

            localStorage.setItem('token', response.data.token)
            //console.log(response.data);
        } catch (e) {
            //console.log("New" + e);
            //alert("Здесь" + e.response.data.message)   
            dispatch(getError(e.response.data.message)) 
            setTimeout(() => {
                dispatch(getError(""))                
              }, 3500);    
        }
    }    
}

export const forgot = (email) => {
    return async dispatch => {
        try {            
            const params = {email}
    
            const response = await axios.post(`${API_URL}api/auth/forgot`, params)        
            console.log(response.data.message);
            console.log(response);
            dispatch(getError(response.data.message)) 
            //dispatch(setUser(response.data.user))            
            
        } catch (e) {            
            //alert("Напоминание - Ошибка " + e.response.data.message)
            dispatch(getError(e.response.data.message))    
            // dispatch(getError(e.response.data.message)) 
            // setTimeout(() => {
            //     dispatch(getError(""))                
            //   }, 3500);    
        }
    }    
}

export const recovery = (link) => {  
    //console.log("AA"); 
    
    return async dispatch => {
        try {            
            dispatch(showPreloader())
            const params = {link}
    
            const response = await axios.post(`${API_URL}api/auth/recovery`, params)        
            //console.log(response.data.message);
            //console.log(response);
            //dispatch(getError(response.data.message)) 
            //dispatch(setUser(response.data.user))            
            
        } catch (e) {            
            //alert("Напоминание - Ошибка " + e.response.data.message)
            dispatch(getError(e.response.data.message)) 
            console.log(e.response);             
        }  
        finally {
            dispatch(hidePreloader())
        }
        // finally{
        //     setTimeout(() => {
        //         dispatch(getError(""))                
        //         }, 3500);

        // }      
    }    
}

export const passwordReset = (recoveryLink, password) => {
    
    return async dispatch => {
        try {            
            const params = {recoveryLink, password}
            //console.log(params);
    
            const response = await axios.post(`${API_URL}api/auth/reset`, params)        
            
            //alert(response.data.user.email)
            //dispatch(registred(response.data.user))
            dispatch(getError(response.data.message)) 
            //alert(response.data.message + response.status + response.statusText)
            
            //console.log(response.data);
        } catch (e) {
            //alert(e)      
            console.log(e.response.data.errors);
            dispatch(getError(e.response.data.message))               
        }
    }   
    
}

export const auth = () => {
    //alert();
    //this.setLoading(true);
    //добавить проверку для показа формы во время загрузки
    return async dispatch => {
        if(localStorage.getItem('token')!==null){
            try {    
                const response = await axios.get(`${API_URL}api/auth/auth`, 
                {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
                )
                dispatch(setUser(response.data.user))
                localStorage.setItem('token', response.data.token)

                //console.log(response.data);
            } catch (e) {
                //alert("Тут" + e)        
                localStorage.removeItem('token')
            } 
        }
        //finally {
        //     this.setLoading(false);
        // }
    }    
}

export const uploadAvatar = (file) => {    
    return async dispatch => {
        try {    
            const formData = new FormData()
            formData.append("file", file)
            //formData.append("filename", file.name)
            
            //вот тут можно обрезать картинку и добавлять её в formData 

            const response = await axios.post(`${API_URL}api/files/avatar`, formData, 
            {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data))            
        } catch (e) {        
            console.log(e);
        } 
        
    }    
}

export const uploadAva = (file) => {    
    return async dispatch => {
        try {                
            const formData = new FormData()

            formData.append("file", file)
            //formData.append("filename", file.name)
            
            //вот тут можно обрезать картинку и добавлять её в formData 

            const response = await axios.post(`${API_URL}api/files/avatar`, formData, 
            {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data))            
        } catch (e) {        
            console.log(e);
        }        
    }    
}

export const deleteAvatar = () => {    
    return async dispatch => {
        try {
            
            const response = await axios.delete(`${API_URL}api/files/avatar`, 
                {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
            )
            dispatch(setUser(response.data))            
        } catch (e) {        
            console.log(e);
        } 
        
    }    
}

export const updateProfile = (name, email) => {    
    
    return async dispatch => {
        try {
            const params = {name, email}
            const response = await axios.put(`${API_URL}api/files/profile`, params, 
                {headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}}
            )
            //alert(response.status)
            if(response.status===200){
                //alert("Профиль обновлён успешно!")
                dispatch(updated(true))

                setTimeout(() => {
                    dispatch(updated(false))                
                }, 3500);  
            }
            dispatch(setUser(response.data))  
            
                    

        } catch (e) {        
            console.log(e);
        } 
        
    }    
}