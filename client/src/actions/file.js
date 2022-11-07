import axios from 'axios'
import { hidePreloader, showPreloader } from '../reducers/appReducer';
import { setFiles, addFile, deleteFileAction } from '../reducers/fileReducer';
import { addUploadFile, changeUploadFile, showUploader } from '../reducers/uploadReducer';

import {API_URL} from "../config";
import { Navigate } from 'react-router-dom';

export function getFiles(dirId, sort) {

    return async dispatch => {
        try {
            dispatch(showPreloader())
            let url = `${API_URL}api/files`
            if(dirId){
                url = `${API_URL}api/files?parent=${dirId}`
            }
            if(sort){
                url = `${API_URL}api/files?sort=${sort}`
            }
            if(dirId && sort){
                url = `${API_URL}api/files?parent=${dirId}&sort=${sort}`
            }
            const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })

            //console.log(response.data)
            dispatch(setFiles(response.data))
            
        } catch (e) {
            console.log(e?.response?.data?.message)            
        } finally {
            dispatch(hidePreloader())
        }
    }
}

export function getAllFiles(userId, sort) {

    return async dispatch => {
        try {
            dispatch(showPreloader())
            let url = `${API_URL}api/files/all`

            if(userId){
                url = `${API_URL}api/files/all?user=${userId}`
            }
            if(sort){
                url = `${API_URL}api/files/all?sort=${sort}`
            }
            if(userId && sort){
                url = `${API_URL}api/files/all?user=${userId}&sort=${sort}`
            }
            const response = await axios.get(url, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })

            console.log(response.data)
            dispatch(setFiles(response.data))
            
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

export function createDir(dirId, name) {

    return async dispatch => {
        try {
            const response = await axios.post(`${API_URL}api/files`, {
                name,
                type: 'dir',
                parent: dirId
            }, {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })

            //console.log(response.data)
            dispatch(addFile(response.data))
            
        } catch (e) {
            alert(e.response.data.message)
            console.log(e.response.data.message)

        }
    }
}

export function uploadFile(file, dirId) {
    return async dispatch => {
        try {
            
            const formData = new FormData()
            formData.append("file", file)
            formData.append("filename", file.name)
            
            if(dirId){
                formData.append('parent', dirId)
            }
            const uploadFile = {name:file.name, progress: 0, id: Date.now()}
            dispatch(showUploader())
            dispatch(addUploadFile(uploadFile))


            // for (var pair of formData.entries()) {
            //     console.log(pair[0] + ', ' + pair[1]+ ', ' + pair[2]+ ', ' + pair[3]); 
            // }
            //console.log(formData.entries[0]);

            const response = await axios.post(`${API_URL}api/files/upload`, formData, {
                headers: {'Content-Type': 'multipart/form-data;charset=UTF-8',
                    Authorization: `Bearer ${localStorage.getItem('token')}`},
                onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    //console.log('total', totalLength+"bites")
                    if(totalLength){
                        //let progress = Math.round((progressEvent.loaded * 100) / totalLength)
                        
                        uploadFile.progress=Math.round((progressEvent.loaded * 100) / totalLength)
                        dispatch(changeUploadFile(uploadFile))
                    }
                }
            })
            //console.log(response.data)
            dispatch(addFile(response.data))
            
        } catch (e) {
            console.log(e?.response?.data?.message)            
        }
    }
}

export async function downloadFile(file){
    const response = await fetch(`${API_URL}api/files/download?id=${file._id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    if(response.status === 200){
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href=downloadUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        link.remove()
    }
}

export function deleteFile(file) {
    return async dispatch => {
        try {
            const response = await axios.delete(`${API_URL}api/files?id=${file._id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            //dispatch(deleteFileAction(file._id))
            //alert(response.data.message)
            

            if(window.confirm("Вы уверены, что хотите удалить?")){
                dispatch(deleteFileAction(file._id))
            }

            
        } catch (e) {
            console.log(e.response.data.message)            
        }
    }
}

export function searchFiles(search) {
    return async dispatch => {
        try {
            const response = await axios.get(`${API_URL}api/files/search?search=${search}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            dispatch(setFiles(response.data))
            //alert(response.data.message)
            
        } catch (e) {
            console.log(e.response.data.message)            
        } finally {
            dispatch(hidePreloader())
        }
    }
}
