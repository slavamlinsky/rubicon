import MyInput from "../../utils/input/MyInput";
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { setPopupDisplay } from "../../reducers/fileReducer";
import { createDir } from "../../actions/file";

const Popup = () => {
    
    const inputref=useRef();

    const [dirName, setDirName] = useState('');
    const popupDisplay = useSelector(state => state.files.popupDisplay)
    const currentDir = useSelector(state => state.files.currentDir)
    const dispatch = useDispatch()



    function createHandler() {
        if (dirName !== "") {
            dispatch(createDir(currentDir, dirName));
            setDirName('');
            dispatch(setPopupDisplay('none'));
        }
    }
    
    useEffect(() => {        
        inputref.current.focus();
        
      }) 
    

    return (
        <div className="popup" onClick={() => dispatch(setPopupDisplay('none'))} style={{ display: popupDisplay }}>
            <div className="popup__content" onClick={(event => event.stopPropagation())}>
                <div className="popup__header">
                    <div className="popup__title">Создание новой папки</div>
                    <button className="popup__close" onClick={() => dispatch(setPopupDisplay('none'))}>X</button>
                </div>
                {/* <MyInput type="text" placeholder="Введите имя папки" value={dirName} setValue={setDirName}/> */}
                {/* <input className="popup__input" ref={input => input && input.focus()} type="text" placeholder="Введите имя папки" value={dirName} setValue={setDirName} autoFocus/> */}
                {/* <input className="popup__input" ref={input => input && input.focus()} type="text" placeholder="Введите имя папки" value={dirName} onChange={(e) => setDirName(e.target.value)} /> */}
                <input className="popup__input" ref={inputref} type="text" placeholder="Введите имя папки" value={dirName} onChange={(e) => setDirName(e.target.value)} />
                

                <button className="popup__create" onClick={() => createHandler()}>Создать папку</button>                
            </div>
        </div>
    )
}

export default Popup