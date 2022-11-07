import React, {useState} from 'react'
import './authorization.css';
import MyInput from '../../utils/input/MyInput';
import { NavLink } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import {login} from '../../actions/user';



const Login = () => {

  //console.log("login");

  // const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch()

  const errorMessage = useSelector(state => state.app.error) 
  let ruErrorMessage

  switch(errorMessage){
    case "User not found":
      ruErrorMessage = 'Пользователь не найден'
      break;
    case "Invalid password":
      ruErrorMessage = 'Неверный пароль'
      break;
    default:
      ruErrorMessage=''
  }
  
  function LoginSend(){
    if(!email){
      alert('Пожалуйста, введите email')
    }
    if(!password){
      alert('Пожалуйста, введите пароль')
    }
    if(email && password){
      dispatch(login(email, password)) 
    }
  }

  

  return (
    <div className='authorization'>
          <div className="authorization__header">Вход в систему</div>                
          <MyInput value={email} setValue={setEmail} type="text" placeholder='Введите email'/>
          <MyInput value={password} setValue={setPassword} type="password" placeholder='Введите пароль'/>
          {ruErrorMessage
          ?
          <div className="authorization__error">{ruErrorMessage}</div>
          :
          <div></div>
          }
          

          {/* <button onClick={() => dispatch(login(email, password))} className="authorization__btn">Войти</button> */}
          <button onClick={LoginSend} className="authorization__btn">Войти</button>
          <br></br>  
          <NavLink to="/forgot">Забыли пароль?</NavLink>
          
    </div>
  )
}

export default Login;