import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

import '@fortawesome/fontawesome-free/js/all.js';

export default function Login() {
  const [pw1, setPw1] = useState('')
  const [user, setUsername] = useState('')
  const [comment, setComment] = useState()

  const router = useRouter()

  async function handleLogOut(){
    const response = await fetch('/api/user/logout',{
        method : 'POST',
        body: JSON.stringify({'username': 'admin'}),
        headers:{
          'Content-Type' : 'application/json'
        }
    })
  
    router.replace('../../login')
  }

  const crea = async () =>{
    const response = await fetch('/api/user/createUser',{
      method : 'POST',
      body: JSON.stringify({username: user, password : pw1 }),
      headers:{
        'Content-Type' : 'application/json'
      }
    })

    const data = await response.json()
    return data
  }

  const creazione = async() =>{
    
    if(pw1.length === 0){
      setComment('insert password')
      return
    }

    if(pw1.length > 10){
        setComment('password too long')
        setPw1('')
        return
    }

    try{
        if(await crea()){
            setComment(`user ${user} created`)
            setPw1('')
            setUsername('')
        }else{
            setComment(`username ${user} already exists`)
            setPw1('')
            setUsername('')
        }
    }catch(err){
        console.log(err)
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
                    <Link href="/protectedPages/usersDashboard/admin"><a className="nav-link text-white" aria-current="page">
                    <i className="fab fa-delicious"></i>
                        &ensp;Scan List
                    </a></Link>
                </li>
                <li className="nav-item">
                    <Link href="/protectedPages/allHosts/admin"><a className="nav-link text-white" aria-current="page">
                    <i className="fa-solid fa-house-laptop"></i>
                        &ensp;Host List
                    </a></Link>
                </li>
                <li>
                    <Link href="/adminPages/allUsers"><a className="nav-link text-white">
                    <i className="fa-solid fa-users"></i>
                        &ensp;User List
                    </a></Link>
                </li>
                <li>
                    <a className="nav-link active">
                    <i className="fa-solid fa-user-plus"></i>
                        &ensp;Create new User
                    </a>
                </li>
            </ul>
            <hr></hr>
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fa-regular fa-user"></i>
                <i className="fa-solid fa-gears"></i>
                    &ensp;
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    <li><Link href='/changePw/admin'><a className="dropdown-item">cambia password</a></Link></li>
                    <li><hr className="dropdown-divider"></hr></li>
                    <li><button className="dropdown-item" onClick={handleLogOut}>Sign out</button></li>
                </ul>
            </div>
        </div>

        <div className='w-100'>
          <h1 className='text-center fw-bolder'>CREATE NEW USER</h1>

          <div className = 'd-flex flex-column bd-highlight justify-content-center mb-3'>
            <form className = 'd-flex justify-content-center '>
              <div className="m-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" id="exampleInputUser" aria-describedby="emailHelp" onChange = {(e) => setUsername(e.target.value)}></input>
              </div>
              <div className="m-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword" onChange = {(e) => setPw1(e.target.value)}></input>
              </div>
            </form>
          </div>

          <div className = 'ms-5 d-flex justify-content-center'>
            <button className="btn btn-primary d-flex justify-content-center  btn-lg" onClick={creazione}>Submit</button>
          </div>

          <p  className = 'm-5 d-flex justify-content-center'>{comment}</p>           
        </div>

    </div>
    </>
  )
}