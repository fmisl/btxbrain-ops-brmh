import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom'
import '../../App.css'
import logoWhite from '../../images/logo-white.png';

function Forgot(){
  const dispatch = useDispatch();
  const history = useHistory();
  const [values, setValues] = useState({'username':'', 'email':'', 'phone':''})
  // const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
    console.log([name],":", value )
  }

  const handleSubmit = async (event) => {
    setSubmitting(true)
    event.preventDefault()
    alert('submit')
    // await new Promise((r) => setTimeout(r, 1000))
    // setErrors(validate(values))
  }
  return (
    <React.Fragment>
      <div style={{position:"absolute", top: "37px", left:"45px"}}><img src={logoWhite} width="180px" onClick={()=>history.push('/')}/></div>
      <form onSubmit={handleSubmit} noValidate className="forgot-form">
        {/* <div onClick={()=>history.push('/signup')} className="signup-link">SIGN UP</div>  */}
        <div className="forgot-title">PASSWORD</div>
        <label>
          USERNAME
          <input
            type="username"
            name="username"
            placeholder="username"
            value={values.username}
            onChange={handleChange}
            // className={errors.email && "errorInput"}
            // className={"input-id"}
          />
          {/* {errors.username && <span className="errorMessage">{errors.username}</span>} */}
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="email"
            value={values.email}
            onChange={handleChange}
            // className={errors.email && "errorInput"}
            // className={"input-pw"}
          />
          {/* {errors.password && ( <span className="errorMessage">{errors.password}</span>)} */}
        </label>
        <label>
          Phone Number
          <input
            type="phone"
            name="phone"
            placeholder="phone"
            value={values.phone}
            onChange={handleChange}
            // className={errors.email && "errorInput"}
            // className={"input-pw"}
          />
          {/* {errors.password && ( <span className="errorMessage">{errors.password}</span>)} */}
        </label>
        <button type="submit" disabled={submitting} className={"forgot-btn"}>FIND PASSWORD</button>
        {/* <button type="submit" disabled={submitting} onClick={()=> dispatch(login())} className={"login-link"}>Login</button> */}
      </form>
    </React.Fragment>
  )
}
export default Forgot;