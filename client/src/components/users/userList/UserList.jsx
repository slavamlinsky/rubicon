import React from 'react';
import './userList.css';
import { useSelector } from 'react-redux';
//import User from './users/User';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import User from './user/User';


const UserList = () => {   
    

    const users = useSelector(state => state.users.users)
    const usersView = useSelector(state => state.users.usersview )

    //console.log(users);
    console.log(usersView);
    

    //const files = useSelector(state => state.files.files);
    //const userName = useSelector(state => state.user.currentUser.name);

    //console.log(files + userName);

    if(users.length === 0){
        return (
            <div className="nousers">Пользователи не найдены</div>
        )
    }
    if(usersView==='plate')
    {
        return (
            <div className="userplate">                
                {/* <TransitionGroup> */}
                    {users.map(user => 
                        // <CSSTransition 
                        //     key={file._id}
                        //     timeout={5000}
                        //     classNames={'file'}
                        //     exit={false}
                        // >
                            <User user={user} key={user._id}/>
                        // </CSSTransition>
                    )}
                {/* </TransitionGroup>                 */}
            </div>
            )
    }

    if(usersView==='list')
    {  
        return (
        <div className="userlist">
            <div className="userlist__header">                
                <div className="userlist__name">Имя Фамилия</div>
                <div className="userlist__email">Email</div>
                <div className="userlist__roles">Роли</div>
                <div className="userlist__date">Добавлен</div>
                <div className="userlist__balance">Баланс</div>
                <div className="userlist__status">Статус</div>

            </div>
            <TransitionGroup>
                {users.map(user => 
                    <CSSTransition 
                        key={user._id}
                        timeout={5000}
                        classNames={'user'}
                        exit={false}
                    >
                        <User user={user}/>
                    </CSSTransition>
                )}
            </TransitionGroup>
            {/* <div className="lines">
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
            </div> */}
        </div>
        )
    }
}


export default UserList;