import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import UserList from './userList/UserList';
import { getFiles, getAllFiles, createDir, uploadFile } from '../../actions/file';

import './users.css';
import { setUsersView } from '../../reducers/usersReducer';
import { getUsers } from '../../actions/users';

const Users = () => {
    const dispatch = useDispatch()
    
    const loader = useSelector(state => state.app.loader)
    
    const [sort, setSort] = useState('type')
    
    useEffect(() =>{        
        dispatch(getUsers(sort))
    }, [sort])

    if(loader === true){
        return (
            <div className="loader">
               <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }
    
    return (
        <div className="disk">
            <h1 style={{textAlign:"center"}}>Модуль управления пользователями</h1>
            <div className="disk__btns">
                {/* {currentDir &&
                    <button className="disk__back" onClick={() => backClickHandler()}>Назад</button>
                } */}                
                
                
                <div className='users__sort' style={{marginLeft:"auto"}}>Сортировать:  
                    <select 
                        className="users__select" 
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)}>
                        <option value="name">По имени</option>
                        <option value="email">По email</option>
                        <option value="date">По дате</option>
                    </select>
                </div>
                <div className='users__view'>
                    <button onClick={() => dispatch(setUsersView('plate'))} className="disk__plate"></button> 
                    <button onClick={() => dispatch(setUsersView('list'))} className="disk__list"></button>
                </div>
            </div>
            <UserList />
            
        </div>         

    )  
}

export default Users