import React from 'react';
import './fileList.css';
import {useSelector } from 'react-redux';
import File from './file/File';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const FileList = () => {  

    
    //  const files = [{_id:1, name: 'Первая папка', type: 'dir', size: '50', date: '20.02.2022'},
    //  {_id:2, name: 'Вторая папка', type: 'file', size: '50', date: '20.02.2022'},
    //  {_id:3, name: 'Третья папка', type: 'dir', size: '50', date: '20.02.2022'}
    //  ].map(file => <File file={file} key={file._id}/>)

    const files = useSelector(state => state.files.files)
    const fileView = useSelector(state => state.files.view )

    //const files = useSelector(state => state.files.files);
    //const userName = useSelector(state => state.user.currentUser.name);

    //console.log(files + userName);

    if(files.length === 0){
        return (
            <div className="nofiles">Файлы (папки) не найдены</div>
        )
    }
    if(fileView==='plate')
    {
        return (
            <div className="fileplate">                
                {/* <TransitionGroup> */}
                    {files.map(file => 
                        // <CSSTransition 
                        //     key={file._id}
                        //     timeout={5000}
                        //     classNames={'file'}
                        //     exit={false}
                        // >
                            <File file={file} key={file._id}/>
                        // </CSSTransition>
                    )}
                {/* </TransitionGroup>                 */}
            </div>
            )
    }

    if(fileView==='list')
    {  
        return (
        <div className="filelist">
            <div className="filelist__header">
                <div className="filelist__name">Имя файла</div>
                <div className="filelist__status">Статус</div>
                <div className="filelist__date">Дата загрузки</div>
                <div className="filelist__size">Размер</div>
            </div>
            <TransitionGroup>
                {files.map(file => 
                    <CSSTransition 
                        key={file._id}
                        timeout={5000}
                        classNames={'file'}
                        exit={false}
                    >
                        <File file={file}/>
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


export default FileList;