import React, { useState } from 'react';
import './navbar.css'
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../reducers/userReducer';
import { getFiles, searchFiles } from '../../actions/file';
import { getError, showPreloader } from '../../reducers/appReducer';
import avatarLogo from '../../assets/img/user-avatar.svg'
import {API_URL} from "../../config";


const Navbar = () => {
  const isAuth = useSelector(state => state.user.isAuth)  
  const isUpdated = useSelector(state => state.user.isUpdated)
  const isRegistred = useSelector(state => state.user.isRegistred)

  const currentDir = useSelector(state => state.files.currentDir)
  const currentUser = useSelector(state => state.user.currentUser)
    
  const dispatch = useDispatch()
  const [searchName, setSearchName] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(false)
  const avatar = currentUser.avatar ? `${API_URL + currentUser.avatar}` : avatarLogo
  
  const userName = currentUser.name
  const userEmail = currentUser.email
  const isActivated = currentUser.isActivated
  
  
  const errorMessage = useSelector(state => state.app.error)
  
  

  //console.log("User = " + userName);

  function searchChangeHandler(e){
    setSearchName(e.target.value)  
    if(searchTimeout!==false){
      clearTimeout(searchTimeout)
    }
    dispatch(showPreloader())
    if(e.target.value!=="")
    {
      setSearchTimeout(setTimeout((value)=>{
        dispatch(searchFiles(value))
      }, 500, e.target.value))    
    } else {
      dispatch(getFiles(currentDir))
    }   
  }
  //console.log("Activated3" + isActive);

  function logoutHadler(){
    dispatch(logout())
    dispatch(getError(""))
  }

  //const avatarpath = '/cloud' + avatar

  return (
    <div className='navbar'>
        <div className='container'>
            {/* <img src={Logo} alt="" className='navbar__logo' /> */}

            {/* <div className='navbar__header'>CLOUD DISK</div> */}
            <div className='navbar__logo'><NavLink to="/disk"><img src='https://www.polygraph-rubicon.com/img/logo.png' alt="Rubicon" /></NavLink></div>
            
            {/* <div style={{width:'100%', marginLeft:'20px'}}>
              <div style={{width:'150px', float:"left"}}>
              Auth: {isAuth ? "true" : "false"}<br />
              Updated: {isUpdated ? "true" : "false"}<br />
              Registred: {isRegistred ? "true" : "false"}<br />
              </div>
              <div style={{width:'250px', float:"left"}}>
              Email: {userEmail}<br />
              Error: {errorMessage}<br />
              Activated: {isActivated ? "true" : "false"}
              </div>
            </div> */}

            {/* {isAuth && <div className='navbar__searchbar'>
              ??????????: <input 
              value={searchName} 
              onChange={e => searchChangeHandler(e)} 
              className='navbar__search' 
              type="text" 
              placeholder="???????????????? ??????????..."/></div>} */}

            {!isAuth && <div className='navbar__login'><NavLink to="/login"><i></i>????????</NavLink></div>}
            {!isAuth && <div className='navbar__registration'><NavLink to="/registration">??????????????????????</NavLink></div>}
            
            
            {isAuth && <div className='navbar__userName'><NavLink to="/profile" title="?????????????? ????????????????????????"><img src={avatar} alt="User avatar" className="navbar__avatar"/>{userName}</NavLink></div>}
            {isAuth && <button className='navbar__logout__btn' onClick={logoutHadler}>??????????</button>}
            
        </div> 
        <div className='container'>
        {isAuth && isActivated && <div className='navbar__menu'>
          {/* ????????????????: ???????? (user, admin) <NavLink to="/disk">??????????</NavLink> | (admin) <NavLink to="/users">????????????????????????</NavLink> | <NavLink to="/templates">??????????????</NavLink> | <NavLink to="/balance">????????????</NavLink> */}
          <div className='link'><NavLink to="/disk">???????? ??????????</NavLink></div> 
          <div className='link'><NavLink to="/files">?????? ?????????? (Admin)</NavLink></div> 
          <div className='link'><NavLink to="/users">????????????????????????</NavLink></div>  
          {/* <div className='link'><NavLink to="/balance">????????????</NavLink></div>  */}
        </div>}
        {isAuth && !isActivated && <div className='navbar__warning'>
          ?????? ???????????? ???????????? ???????????????????? ???????????????????????? ???????? ?????????????? ????????????! ?????????????????? ???? ???????????? ?? ???????????? ?? ?????? ???? ??????????.
        </div>}
        </div>       
    </div>
  )
}

export default Navbar;