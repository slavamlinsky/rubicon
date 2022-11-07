import React, { useEffect } from "react";
import Navbar from "./navbar/Navbar";
import './app.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Registration from "./authorization/Registration";
import Login from "./authorization/Login";
import Activate from "./authorization/Activate";
import Forgot from "./authorization/Forgot"
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../actions/user";
import Disk from "../components/disk/Disk";
import Users from "../components/users/Users"
import Profile from "./profile/Profile";
import Balance from "./balance/Balance";


function App() {
  const isAuth = useSelector(state => state.user.isAuth)

  const currentUser = useSelector(state => state.user.currentUser)
  const isActivated = currentUser.isActivated
  
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(auth());
    
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
    <div className="app">
      <Navbar/>     
      <div className="wrap">
        {!isAuth && !isActivated && 
        <Routes>
          <Route path='/login' element={<Login/>}/>          
          <Route path='/activate' element={<Activate/>}/>
          <Route path='/registration' element={<Registration/>}/>
          <Route path='/forgot/:link' element={<Forgot/>}/>
          <Route path='/forgot' element={<Forgot/>}/>          
          <Route path="*" element={<Navigate to="/login" />} />          
        </Routes>  
        } 
        {isAuth && !isActivated && 
        <Routes>          
          <Route path='/activate' element={<Activate/>}/>
          <Route path="*" element={<Navigate to="/activate" />} />          
        </Routes>  
        }    
        {isAuth && isActivated && 
        <Routes>          
          <Route path='/disk' element={<Disk/>}/>
          <Route path='/users' element={<Users/>}/>
          <Route path='/balance' element={<Balance/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path="*" element={<Navigate to="/disk" />} />
        </Routes>  
        }
        
      </div>
      {/* <h1>Cloud Disk</h1>    */}
    </div>
    </BrowserRouter>
    
  );
  
}

export default App;
