import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import './authorization.css';
import MyInput from '../../utils/input/MyInput';
import {registration, regnew} from '../../actions/user';
import { getError } from '../../reducers/appReducer';
import { Navigate } from 'react-router-dom';


const Registration = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const currentUser = useSelector(state => state.user.currentUser)
  const dispatch = useDispatch()
  const isRegistred = useSelector(state => state.user.isRegistred)

  const userEmail = currentUser.email

  const errorMessage = useSelector(state => state.app.error) 
  let ruErrorMessage = ""

  if(errorMessage.substr(0, 15)==="User with email"){
    //("User with email")
     ruErrorMessage = "Пользователь с таким email уже существует"
     
    setTimeout(() => {
      dispatch(getError(""))                
    }, 3500); 
  }

  // switch(errorMessage){
  //   case "User not found":
  //     ruErrorMessage = 'Пользователь не найден'
  //     break;
  //   case "Invalid password":
  //     ruErrorMessage = 'Неверный пароль'
  //     break;
  //   default:
  //     ruErrorMessage=''
  // }

    

  return (
    <div>
    {!isRegistred ? 
      <div className='authorization'> 
        {/* <div className="authorization__header"><h4>Title: {title}</h4></div>  */}
        <div className="authorization__header">Создание аккаунта</div>
        <MyInput value={name} setValue={setName} type="text" placeholder='Введите фамилию и имя'/>          
        <MyInput value={email} setValue={setEmail} type="text" placeholder='Введите email'/>
        <MyInput value={password} setValue={setPassword} type="password" placeholder='Введите пароль' maxLength='12'/>
        
        {ruErrorMessage
          ?
          <div className="authorization__error">{ruErrorMessage}</div>
          :
          <div></div>
        }

        <button onClick={() => dispatch(registration(name, email, password))} className="authorization__btn">Зарегистрироваться</button>
        {/* <button onClick={regimsya} className="authorization__btn">Регимся</button> */}
      </div>  
      :     
      <Navigate to="/activate" />

      // <div className='confirmation'>    
      //   <div style={{textAlign:'center'}}>
      //     {/* тут можно какую-то красивую ещё картинку */}
      //   <img src='https://cdn2.iconfinder.com/data/icons/komiko/128/cartoon-01-4-512.png' width='150px' alt="" />  
      //   </div>        
      //   <div className="confirmation__header">Подтвердите Ваш Email</div>
      //   <div className="confirmation__message">
      //     <p>Вы успешно зарегистрировались в системе. Для начала работы <b>осталось активировать вашу учётную запись</b>.</p> 
      //     <p>На почту {userEmail} отправлено письмо. Откройте его и перейдите по ссылке для активации.</p> 
      //     <p>Если не можете найти письмо, проверьте папку "спам".</p> 
      //     <p>Если у Вас возникли другие проблемы с регистрацией, свяжитесь с администратором и мы Вам поможем.</p> 
      //   </div>
        

      //</div>
    }    
    </div>
  )
}

export default Registration;