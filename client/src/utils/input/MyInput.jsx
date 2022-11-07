import React from 'react'
import './myInput.css'

const MyInput = (props) => {
  return (    
        <input className="myinput" onChange={(event) => props.setValue(event.target.value)}           
          id={props.id} 
          value={props.value} 
          type={props.type} 
          placeholder={props.placeholder}
          maxLength={props.maxLength}/>    
  )
}

export default MyInput