import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const [credentials, setCredentials] = useState({name:"",email:"",password:"",cpassword:""})
  let navigate = useNavigate();

  const handleSubmit = async (e) =>{
      e.preventDefault();
      const response = await fetch("http://localhost:5000/api/auth/CreateUser",{
          method:"POST",
          headers:{
              "Content-type" : "application/json"
          },
          body: JSON.stringify({name:credentials.name,email:credentials.email,password:credentials.password})
      })
      const json = await response.json();
      console.log(json);
      if(json.success){
        //Saving the token
        localStorage.setItem("token",json.authToken);
        props.showAlert("Successfully created your account","success");
        navigate("/");
      }
      else{
        props.showAlert("Invalid Credentials","danger")
      }
  }
  const onChange = (e) =>{
      setCredentials({...credentials,[e.target.name]: e.target.value})
  }   
  return (
    <>
    <div>
    <form onSubmit={handleSubmit}>
    <div className="mb-3">
    <label htmlFor="name" className="form-label">Name</label>
    <input type="text" className="form-control" id="name" name="name" onChange={onChange} minLength={3}/>
  </div>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={7} required/>
  </div>
  <div className="mb-3">
    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
    <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={7} required/>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>
  </>
  )  
}


export default Signup