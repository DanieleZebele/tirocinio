import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import '@fortawesome/fontawesome-free/js/all.js';

export default function Login() {
  const [pw1, setPw1] = useState('')
  const [pw2, setPw2] = useState('')
  const [comment, setComment] = useState()

  const router = useRouter()
  const username = router.query.username

  async function handleLogOut(){
    const response = await fetch('/api/user/logout',{
        method : 'POST',
        body: JSON.stringify({'username': username}),
        headers:{
          'Content-Type' : 'application/json'
        }
    })
  
    router.replace('../../login')
}

  const change = async () =>{
    const response = await fetch('/api/user/changePw',{
      method : 'POST',
      body: JSON.stringify({username: username, oldPw : pw1 , newPw : pw2}),
      headers:{
        'Content-Type' : 'application/json'
      }
    })

    const data = await response.json()
    return data
  }

  const autorizzazione = async() =>{
    
    if(pw2.length === 0){
      setComment('password non inserita')
      return
    }

    if(pw2.length > 10){
        setComment('password troppo lunga')
        setPw1('')
        return
    }

    if(await change()){
/*
        const response = await fetch('/api/user/logout',{
          method : 'POST',
          body: JSON.stringify({username: username}),
          headers:{
            'Content-Type' : 'application/json'
          }
        })*/

        setComment('password updated')
        setPw1('')
        setPw2('')
    }else{
        setComment('wrong username or password')
        setPw1('')
        setPw2('')
    }
  }

  return(
    <>
        <div className='d-flex'>
            <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100 sticky-top" style={{"width": '280px'}}>
                    <Link href='/'><a className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <span className="fs-4">MyProject</span>
                    </a></Link>
                    <hr></hr>
                    <ul className="nav nav-pills flex-column mb-auto">
                        <li className="nav-item">
                          <Link href={`/protectedPages/usersDashboard/${username}`}><a className="nav-link text-white" aria-current="page">
                            <i className="fab fa-delicious"></i>
                                &ensp;Scan List
                            </a></Link>
                        </li>
                        <li className="nav-item">
                            <Link href={`/protectedPages/allHosts/${username}`}><a className="nav-link text-white" aria-current="page">
                            <i className="fa-solid fa-house-laptop"></i>
                                &ensp;Host List
                            </a></Link>
                        </li>
                        {
                          username === 'admin' ? 
                              <li>
                                <Link href="/protectedPages/adminPages/createUser"><a className="nav-link text-white">
                                <i className="fa-solid fa-user-plus"></i>
                                    &ensp;Create new User
                                </a></Link>
                              </li>
                          : 
                              <></>
                        }
                    </ul>
                    <hr></hr>
                    <div className="dropdown">
                        <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa-regular fa-user"></i>
                        <i className="fa-solid fa-gears"></i>
                            &ensp;
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                            <li><Link href={`/changePw/${username}`}><a className="dropdown-item">change password</a></Link></li>
                            <li><hr className="dropdown-divider"></hr></li>
                            <li><button className="dropdown-item" onClick={handleLogOut}>Sign out</button></li>
                        </ul>
                    </div>
                </div>

                <div className = 'w-100'>
                <h1 className='text-center fw-bolder'>CHANGE PASSWORD</h1>
                    <div className = 'd-flex flex-column bd-highlight justify-content-center mb-3'>
                      <form className = 'd-flex justify-content-center '>
                        <div className="m-3">
                          <label className="form-label">Old password</label>
                          <input type="password" className="form-control" id="exampleInputOldPassword" onChange = {(e) => setPw1(e.target.value)}></input>
                        </div>
                        <div className="m-3">
                          <label className="form-label">New password</label>
                          <input type="password" className="form-control" id="exampleInputNewPassword" onChange = {(e) => setPw2(e.target.value)}></input>
                        </div>
                      </form>
                    </div>

                    <div className = 'ms-5 d-flex justify-content-center'>
                      <button className="btn btn-primary d-flex justify-content-center  btn-lg" onClick={autorizzazione}>Submit</button>
                    </div>

                    <p className = 'm-5 d-flex justify-content-center'>{comment}</p>            
                </div>

            </div>
    </>
  )
}