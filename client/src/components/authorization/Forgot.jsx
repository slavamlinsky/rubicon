import React, {useEffect, useState} from 'react'
import './authorization.css';
import MyInput from '../../utils/input/MyInput';
import { NavLink } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import {forgot, passwordReset, recovery} from '../../actions/user';


const Forgot = () => {

    const url = window.location    
    const recoveryLink = url.pathname.split("/")[2]
    const loader = useSelector(state => state.app.loader)

    useEffect(() => {
        if(recoveryLink){
            dispatch(recovery(recoveryLink))
        }
        
      }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const [email, setEmail] = useState("")  
    const [password, setPassword] = useState("")    
    const dispatch = useDispatch()
  
    const errorMessage = useSelector(state => state.app.error) 
    let ruErrorMessage
  
    switch(errorMessage){
        case "Email was send":
            ruErrorMessage = 'Письмо успешно отправлено'
            break;
        case "User not found":
            ruErrorMessage = 'Пользователь (email) не найден'
            break;
        case "Time has expired":
            ruErrorMessage = 'Время действия ссылки истекло'
            break;
        case "Server Error":
            ruErrorMessage = 'Ошибка сервера'
            break;
        default:
            ruErrorMessage=''
    }
    
    function ForgotSend(){
      if(!email){
        alert('Пожалуйста, введите email')
      }      
      if(email){
        dispatch(forgot(email)) 
      }
    }

    if(loader === true){
        return (
            <div className="loader">
               <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }
  
    if(!recoveryLink){  
        return (
        <div className='authorization'>
                <div className="authorization__header">Напоминание пароля</div>                
                <MyInput value={email} setValue={setEmail} type="text" placeholder='Введите Ваш email'/>            
                
                {ruErrorMessage
                ?
                <div className="authorization__error">{ruErrorMessage}</div>
                :
                <div></div>
                }
                
    
                {/* <button onClick={() => dispatch(login(email, password))} className="authorization__btn">Войти</button> */}
                <button onClick={ForgotSend} className="authorization__btn">Отправить</button>
                <br></br>
                <p style={{fontSize: '.875em'}}>Письмо со ссылкой для восстановления пароля будет отправлено Вам на почту.
                    Все свои вопросы пишите администратору admin@polygraph-rubicon.com</p>  
                <br></br>                
                <NavLink to="/login">Вспомнили пароль?</NavLink>
                
        </div>
        )
    }
    if(recoveryLink){
        if(errorMessage){
            if(errorMessage=="Password was updated"){
                return (
                    <div className='authorization'>
                    <div className="authorization__header">Обновление пароля</div>    
                    
                    <div className="authorization__error">Пароль обновлён успешно!</div><br></br>
                        
                    Теперь можно перейти к авторизации <br></br><NavLink to="/login">на странице входа</NavLink>
                    <br></br>                
                    </div>
                )

            }
            else{
                return (
                <div className='authorization'>
                    <div className="authorization__header">Напоминание пароля</div>                
                    <MyInput value={email} setValue={setEmail} type="text" placeholder='Введите Ваш email'/>            
                    
                    {ruErrorMessage
                    ?
                    <div className="authorization__error">{ruErrorMessage}</div>
                    :
                    <div></div>
                    }
                    
        
                    {/* <button onClick={() => dispatch(login(email, password))} className="authorization__btn">Войти</button> */}
                    <button onClick={ForgotSend} className="authorization__btn">Отправить</button>
                    <br></br>
                    <p style={{fontSize: '.875em'}}>Письмо со ссылкой для восстановления пароля будет отправлено Вам на почту.
                        Все свои вопросы пишите администратору admin@polygraph-rubicon.com</p>  
                    <br></br>                
                    <NavLink to="/login">Вспомнили пароль?</NavLink>                
                </div>
                )
            }
        }

        if(!errorMessage){
            return (
            <div className='authorization'>
            <div className="authorization__header">Обновление пароля</div>    
            <MyInput value={password} setValue={setPassword} type="password" placeholder='Введите новый пароль' maxLength='12'/>
        
                {ruErrorMessage
                ?
                <div className="authorization__error">{ruErrorMessage}</div>
                :
                <div></div>
                }

        <button onClick={() => dispatch(passwordReset(recoveryLink, password))} className="authorization__btn">Сохранить</button>
            </div>
            )
        }
        
        
        // return (
        //     <div className='authorization'>
        //     <div className="authorization__header">Создайте новый пароль</div>    
        //         {recoveryLink}
        //     </div>
        //     )
    }
  }
  
  export default Forgot;