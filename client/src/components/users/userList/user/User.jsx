import React from 'react';
import './user.css';
import avatarLogo from '../../../../assets/img/user-avatar.svg'

import { useDispatch, useSelector } from 'react-redux';
import {API_URL} from "../../../../config";


const User = ({user}) => {

  const dispatch = useDispatch()  
  const usersView = useSelector(state => state.users.usersview )


//   function deleteClickHandler(e){
//     e.stopPropagation()    
//     dispatch(deleteFile(file)) 
//   }

  if(usersView==='plate')
    {
        const avatar = user.avatar ? `${API_URL + user.avatar}` : avatarLogo
      //const foldericonpath = '/cloud'+foldericon
      
      return (        
        //<div className="user-plate" onClick={() => openDirHandler()}>
        <div className="user-plate">
            <div className="user-plate__icon">
                
                <img src={avatar} alt="User Page" className="user-plate__img"/>
            </div>
            <div className="user-plate__name"><strong>{user.name}</strong><br></br>({user.email})</div>  
            <div className="user-plate__btns">
              {/* {file.type!=="dir" && <button onClick={(e) => downloadClickHandler(e)} className="file-plate__btn file__download">DownLoad</button>}
              <button onClick={(e)=> deleteClickHandler(e)} className="file-plate__btn file__delete">Delete</button> */}
              <button className="user-plate__btn user__balance">Баланс</button>
              <button className="user-plate__btn user__delete">Удалить</button>
            </div>            
        </div>
      )

    }

    let Role = "Роль"
    let RoleName = "Название роли"
    let RoleClass = "Style"

    if(usersView==='list')
    {
        const avatar = user.avatar ? `${API_URL + user.avatar}` : avatarLogo
        console.log(user.roles);
       
        if(Array.isArray(user.roles)){
          if(user.roles.includes("USER")){
            Role = "U"
            RoleClass = "user"
            RoleName = "Пользователь"
          }
          if(user.roles.includes("ADMIN")){
            Role = "A"
            RoleClass = "admin"
            RoleName = "Администратор"
          }
          
        }
        
      return (        
        
        // <div className="file" onClick={() => openDirHandler()}>
        <div className="user">
            <div className="user__avatar">
                <img src={avatar} alt="User photo" className="user__img"/>
            </div>            
            <div className="user__name">{user.name}<br></br><small>({user._id})</small></div>
            <div className="user__email">{user.email}</div>
            <div className="user__roles"><div title={RoleName} className={RoleClass}>{Role}</div></div>
            <div className="user__size">2{user.roles}</div>
            <div className="user__size">3{RoleName}</div>
            {/* {file.type!=="dir" && <button onClick={(e) => downloadClickHandler(e)} className="file__btn file__download">DownLoad</button>}
            <button onClick={(e)=> deleteClickHandler(e)} className="file__btn file__delete">Delete</button> */}
        </div>
      )
    }
}

export default User