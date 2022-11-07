import React from 'react';
import './file.css';
import dirLogo from '../../../../assets/img/dir.svg';
import fileLogo from '../../../../assets/img/file.svg';
import { useDispatch, useSelector } from 'react-redux';
import { pushToStack, setCurrentDir } from '../../../../reducers/fileReducer';
import { deleteFile, downloadFile} from '../../../../actions/file'
import sizeFormat from '../../../../utils/sizeFormat';


const File = ({file}) => {

  const dispatch = useDispatch()
  const currentDir = useSelector(state => state.files.currentDir)
  const fileView = useSelector(state => state.files.view )


  function openDirHandler(){
    if(file.type === 'dir'){
      dispatch(pushToStack(currentDir))     
      dispatch(setCurrentDir(file._id))       
    }
  }

  function downloadClickHandler(e){
    e.stopPropagation()
    downloadFile(file)
  }

  function deleteClickHandler(e){
    e.stopPropagation()    
    dispatch(deleteFile(file)) 
  }
  if(fileView==='plate')
    {
      const foldericon = file.type === 'dir'? dirLogo : fileLogo
      //const foldericonpath = '/cloud'+foldericon
      return (        
        <div className="file-plate" onClick={() => openDirHandler()}>
            <div className="file-plate__icon">
                
                <img src={foldericon} alt="Rubicon Server Page" className="file__img"/>
            </div>
            <div className="file-plate__name">{file.name}</div>  
            <div className="file-plate__btns">
              {file.type!=="dir" && <button onClick={(e) => downloadClickHandler(e)} className="file-plate__btn file__download">DownLoad</button>}
              <button onClick={(e)=> deleteClickHandler(e)} className="file-plate__btn file__delete">Delete</button>
            </div>            
        </div>
      )

    }

    if(fileView==='list')
    {
        const foldericon = file.type === 'dir'? dirLogo : fileLogo
        //const foldericonpath = '/cloud'+ foldericon
      return (        
        //<div className="file" onClick={file.type === 'dir' ? ()=> openDirHandler() : ''}>
        <div className="file" onClick={() => openDirHandler()}>
            <div className="file__icon">
                <img src={foldericon} alt="Rubicon Server Page" className="file__img"/>
            </div>
            <div className="file__name">{file.name}</div>
            <div className="file__date">{file.date.slice(0,10)}</div>
            <div className="file__size">{sizeFormat(file.size)}</div>
            {file.type!=="dir" && <button onClick={(e) => downloadClickHandler(e)} className="file__btn file__download">DownLoad</button>}
            <button onClick={(e)=> deleteClickHandler(e)} className="file__btn file__delete">Delete</button>
        </div>
      )
    }
}

export default File