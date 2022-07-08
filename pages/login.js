import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

export default function Login() {
  const [pw, setPw] = useState('')
  const [username, setUsername] = useState('')
  const [comment, setComment] = useState()
  const router = useRouter()

  const fetchPw = async () =>{
    const response = await fetch('/api/user/login',{
      method : 'POST',
      body: JSON.stringify({username : username, password : pw}), //body: JSON.stringify(new Users({username: username, password: pw})),//, token: "ABCD"
      headers:{
        'Content-Type' : 'application/json'
      }
    })
    const data = await response.json()
    return data
  }

  const autorizzazione = async() =>{
    if(await fetchPw()){

      if(username === 'admin'){
        router.replace('./protectedPages/usersDashboard/admin')
      }
      else{
        router.replace(`./protectedPages/usersDashboard/${username}`)
      }
      
    }else{
      setComment('wrong username or password')
    }
  }

  return(
    <div >
      <h1 className='text-center fw-bolder'>LOGIN</h1>

      <div className = 'd-flex flex-column bd-highlight justify-content-center mb-3'>
        <form className = 'd-flex justify-content-center '>
          <div className="m-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" id="exampleInputUser" onChange = {(e) => setUsername(e.target.value)}></input>
          </div>
          <div className="m-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword" onChange = {(e) => setPw(e.target.value)}></input>
          </div>
        </form>

        <p className = 'ms-5 d-flex justify-content-center'>{comment}</p>

        <div className = 'ms-5 d-flex justify-content-center'>
          <button className="btn btn-primary d-flex justify-content-center  btn-lg" onClick={autorizzazione}>Submit</button>
        </div>

      </div>



    </div>
  )
}