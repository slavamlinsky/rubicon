import React, {useState} from 'react'
import './profile.css'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAvatar, uploadAvatar, updateProfile, uploadAva } from '../../actions/user'
import avatarLogo from '../../assets/img/user-avatar.svg'
import {API_URL} from "../../config";

const Profile = () => {
    const dispatch = useDispatch()

    const isUpdated = useSelector(state => state.user.isUpdated)
    const currentUser = useSelector(state => state.user.currentUser)

    const avatar = currentUser.avatar ? `${API_URL + currentUser.avatar}` : avatarLogo
    
    const [userName, setUserName] = useState(currentUser.name)
    const [userEmail, setUserEmail] = useState(currentUser.email)

    let quality = 0.9;           
    let ImageBlob;
    
    
    //const userName = currentUser.name
    //const userEmail = currentUser.email

    function changeAvatarHandler(e){
        // e.preventDefault
        //const file = e.target.files[0]
        //dispatch(uploadAvatar(file))
        
        //уменьшение изображения

        

        if (e.target.files) {
            let imageVal = e.target.files[0];

            var reader = new FileReader();

            reader.onload = function (e) {
                var img = document.createElement("img");

                const outputImageAspectRatio = 1;

                img.onload = function (event) {

                    const inputWidth = img.naturalWidth;
                    const inputHeight = img.naturalHeight;
                    let skipX, skipY
                    
                    if(inputWidth > inputHeight){
                        skipX = (inputWidth - inputHeight)/2;
                        skipY = 0;
                    }else{
                        skipX = 0;
                        skipY = (inputHeight - inputWidth)/2;
                    }
                
                    

                    // get the aspect ratio of the input image
                    const inputImageAspectRatio = inputWidth / inputHeight;
                    
                    //alert(inputImageAspectRatio);
                    
                    // if it's bigger than our target aspect ratio
                    let outputWidth = inputWidth;
                    let outputHeight = inputHeight;
                    
                    if (inputImageAspectRatio > outputImageAspectRatio) {
                        outputWidth = inputHeight * outputImageAspectRatio;        
                    } else if (inputImageAspectRatio < outputImageAspectRatio) {
                        outputHeight = inputWidth / outputImageAspectRatio;
                    }

                    //alert(img.naturalWidth + '*' + img.naturalHeight + 'px');
                    //alert(skipX + " " + skipY);
                    //alert('Новое изображение' + outputWidth + '*' + outputHeight + 'px');
                    

                    // This line is dynamically creating a canvas element
                    var canvas = document.createElement("canvas");

                    // set it to the same size as the image
                    canvas.width = "200";
                    canvas.height = "200";                  
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, skipX, skipY, outputWidth, outputHeight, 0, 0, 200, 200);                  


                    //This line is used to display the resized image in the body
                    //var url = canvas.toDataURL(imageVal.type);

                    //document.getElementById("avatar-img").src = url;
                    
                    // преобразуем canvas в blob файл перед отпарвкой
                    canvas.toBlob(
                        (blob) => {                            
                          if (blob) {                            
                            
                            ImageBlob = blob;
                            dispatch(uploadAva(ImageBlob))

                            //compressedImage.src = URL.createObjectURL(compressedImageBlob);
                            //document.querySelector("#size").innerHTML = bytesToSize(blob.size);
                            document.getElementById("avatar-img").src = URL.createObjectURL(ImageBlob);;
                          }
                        },
                        "image/jpeg",
                        quality
                    );                    

                    //dispatch(uploadAva(imageVal))                

                }

                img.src = e.target.result;
            }
            reader.readAsDataURL(imageVal);
            //dispatch(uploadAva(ImageBlob))
            
        }
        
        

        //dispatch(uploadAva(file))
    }  

    function profileEmailHandler(e){
        setUserEmail(e.target.value)          
        //alert(e.target.value)
    }

    function profileUserNameHandler(e){
        setUserName(e.target.value)          
        //alert(e.target.value)
    }


    return (
        <div className='profile'>
            <div id="ava" className='profile__avatar'><img width="200" id="avatar-img" src={avatar} alt="User avatar"></img></div>
            <div className='profile__header'>Профиль пользователя</div>                
                <div className='profile__row'>
                    <div className='profile__label'>Email адрес</div>
                    <div className='profile__field'>
                        <input className='profile__input' type="text" placeholder='' 
                        value={userEmail}
                        onChange={e => profileEmailHandler(e)}
                        disabled/></div>
                </div>
                <div className='profile__row'>
                    <div className='profile__label'>Фамилия и имя</div>
                    <div className='profile__field'><input className='profile__input' type="text" placeholder='' 
                    value={userName}
                    onChange={e => profileUserNameHandler(e)}/></div>
                </div>
                <div className='profile__row'>
                    <div className='profile__label'>Ваш аватар</div>
                    <div className='profile__field'><button onClick={()=> dispatch(deleteAvatar())} className="delete-avatar">Удалить</button>
                        <label className='profile__avalabel'>
                            <input className='profile__avaimage' onChange={(e) => changeAvatarHandler(e)} type="file" placeholder='Загрузить аватар' accept=".jpg,.jpeg,.png"/>
                            Загрузить фото
                        </label><br/>                        
                        <span className='upload__description'>JPG или PNG. 50x50 пикселей. (до 10 кб)</span>
                    </div>
                </div>                
                <div className='profile__row'> 
                    <div className='profile__label'></div>                   
                    <div className='profile__field center'>
                        {isUpdated && <div className='updated_success'>Обновлено успешно</div>}    
                    </div>
                </div>
                {/*                 
                <div className='profile__row'>
                </div>
                <div className='profile__row'>
                    <div className='profile__label'>Текущий пароль</div>
                    <div className='profile__field'><input className='profile__password' type="password" placeholder='' value='password259'/></div>
                </div>
                <div className='profile__row'>
                    <div className='profile__label'>Новый пароль</div>
                    <div className='profile__field'><input className='profile__password' type="password" placeholder=''/></div>
                </div>
                <div className='profile__row'>
                    <div className='profile__label'>Подтвердите пароль</div>
                    <div className='profile__field'><input className='profile__password' type="password" placeholder=''/></div>
                </div> */}
                <div className='profile__row'>  
                    <div className='profile__label'></div>                  
                    <div className='profile__field center'>                        
                        <button onClick={()=> dispatch(updateProfile(userName, userEmail))} className="profile__savebtn">Сохранить</button>                        
                    </div>
                </div>                            
        </div>
    )
}

export default Profile