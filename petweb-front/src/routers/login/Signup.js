import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom'
import useForm from "./useForm"
import validateSignup from "./validateSignup"
import * as services from '../../services/fetchApi'
import logoWhite from '../../images/logo-white.png';
import '../../App.css'

function Signup(){
  const dispatch = useDispatch();
  const history = useHistory();
  const { values, errors, submitting, handleChange, handleSubmit } = useForm({
    initialValues: { first_name:'', last_name:'', username:'', password1:'', password2:'', email:'', phone:'' },
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2))
      // fetchItems()
      let res = null
      try{
        res = await services.Registration(values)
        console.log(res)
        alert("Successfully signed up.")
        history.push('/')
      } catch (e){
        // alert('Failed')
        console.log(e.response.data)
        if (e.response.data.username){
          alert(e.response.data.username)
        }
        if (e.response.data.email){
          alert(e.response.data.email)
        }
        if (e.response.data.password1){
          alert(e.response.data.password1)
        }
        // const errMsg = e.response.data
        // alert(errMsg)
      } finally{
        console.log(res)
      }
        // const status = res[0].status
        // if (!res[0].data.token){
        //   alert(status)
        // } else{
        //   alert("Successfully signed up.")
        //   history.push('/')
        // }
    },
    validate: validateSignup,
  })
  // const fetchItems = async () => {
  //   const data = await fetch('http://localhost:8000/rest-auth/registration/',{
  //     method:'POST',
  //     headers:{
  //       'Content-Type':'application/json'
  //     },
  //     body: JSON.stringify(values)
  //   })
  //   .then(res=>res.json())
  //   .then(json=>{
  //     console.log(json)
  //     if (!json.token){
  //       alert(JSON.stringify(json))
  //     } else{
  //       alert("Successfully signed up.")
  //       history.push('/')
  //     }
  //   })

  //   console.log(data);
  // }
  return (
    <React.Fragment>
      <div style={{position:"absolute", top: "37px", left:"45px"}}><img src={logoWhite} width="180px" onClick={()=>history.push('/')}/></div>
      <form onSubmit={handleSubmit} noValidate className="signup-form">
        <div className="signup-title">SIGN UP</div>
        <label>
          Name
          <div>
            <input
              type="first_name"
              name="first_name"
              placeholder="First name"
              value={values.first_name}
              onChange={handleChange}
            />
            <input
              type="last_name"
              name="last_name"
              placeholder="Last name"
              value={values.last_name}
              onChange={handleChange}
            />
          </div>
        </label>
        <label>
          Username
          <input
            type="username"
            name="username"
            placeholder="Username"
            value={values.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password1"
            placeholder="Password"
            value={values.password1}
            onChange={handleChange}
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={values.password2}
            onChange={handleChange}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone Number
          <input
            type="phone"
            name="phone"
            placeholder="Phone Number"
            value={values.phone}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={submitting} className={"signup-btn"}>SIGN UP</button>
        {/* <button type="submit" disabled={submitting} onClick={()=> dispatch(login())} className={"login-link"}>Login</button> */}
      </form>
    </React.Fragment>
  )
}
export default Signup;