import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFiles, getAllFiles, createDir, uploadFile, searchFiles } from '../../actions/file';
import { showPreloader } from '../../reducers/appReducer';
import { popStack, setCurrentDir, setFileView, setPopupDisplay } from '../../reducers/fileReducer';
import FileList from '../disk/fileList/FileList';
import './disk.css';
import Popup from './Popup';
import Uploader from './uploader/Uploader';


const Disk = () => {
    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const loader = useSelector(state => state.app.loader)

    const [dragEnter, setDragEnter] = useState(false)
    const [sort, setSort] = useState('type')

    const [searchName, setSearchName] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(false)

    const isAuth = useSelector(state => state.user.isAuth)  

 

    //const userId = "6321db073bb079c9e2368859"
    
    useEffect(() =>{
        dispatch(getFiles(currentDir, sort))
        //dispatch(getAllFiles(userId, sort))
    }, [currentDir, sort])

    function showPopupHandler(){        
        dispatch(setPopupDisplay('flex'));
        //console.log(document.getElementById('popup_createdir'))
    }

    function backClickHandler(){                
        dispatch(popStack())        
    }

    function fileUploadHandler(event){
        const files = [...event.target.files]
        //console.log(files[0].name);
        
        files.forEach(file => dispatch(uploadFile(file, currentDir)))
    }

    function DragEnterHandler(event){
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(true)
    }

    function DragLeaveHandler(event){
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(false)
    }

    function dropHandler(event){
        event.preventDefault()
        event.stopPropagation()
        let files = [...event.dataTransfer.files]
        console.log(files);
        files.forEach(file => dispatch(uploadFile(file, currentDir)))
        setDragEnter(false)
    }

    function searchChangeHandler(e){
        setSearchName(e.target.value)  
        if(searchTimeout!==false){
          clearTimeout(searchTimeout)
        }
        //dispatch(showPreloader())
        if(e.target.value!=="")
        {
          setSearchTimeout(setTimeout((value)=>{
            dispatch(searchFiles(value))
          }, 50, e.target.value))  
          
        } else {
          dispatch(getFiles(currentDir))
        }
           
      }

    if(loader === true){
        return (
            <div className="loader">
               <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }
    
    return (!dragEnter ?
        <div className="disk" onDragEnter={DragEnterHandler} onDragLeave={DragLeaveHandler} onDragOver={DragEnterHandler}>
            <div className="disk__btns">
                {currentDir &&
                    <button className="disk__back" onClick={() => backClickHandler()}>Назад</button>
                }
                <button className="disk__create" onClick={() => showPopupHandler()}>Создать папку</button>
                
                <div className="disk__upload">
                    <form encType="multipart/form-data;charset=UTF-8">
                        <label htmlFor="disk__upload_input" className="disk__upload_label"><div></div>Загрузить файл</label>
                        <input multiple onChange={(event) => fileUploadHandler(event)} type="file" id="disk__upload_input" className="disk__upload_input"  accept=".zip" />
                    </form>
                </div>
                <div className='disk__search'>
                {isAuth && <div className='navbar__searchbar'>
                Поиск: <input 
                value={searchName} 
                onChange={e => searchChangeHandler(e)} 
                className='navbar__search' 
                type="text" 
                placeholder="Название файла..."/></div>}

                </div>
                <div className='disk__sort'>Сортировать:  
                    <select 
                        className="disk__select" 
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)}>
                        <option value="name">По имени</option>
                        <option value="type">По типу</option>
                        <option value="date">По дате</option>
                    </select>
                </div>
                <div className='disk__view'>
                    <button onClick={() => dispatch(setFileView('plate'))} className="disk__plate"></button> 
                    <button onClick={() => dispatch(setFileView('list'))} className="disk__list"></button>
                </div>
            </div>
            <FileList />
            <Popup/>
            <Uploader/>
        </div> 
        :
        <div className="drop-area" onDrop={dropHandler} onDragEnter={DragEnterHandler} onDragLeave={DragLeaveHandler} onDragOver={DragEnterHandler}>
            Перетащите файлы сюда 
        </div>

    )
}

export default Disk;