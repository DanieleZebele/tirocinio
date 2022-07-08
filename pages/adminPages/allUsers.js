import React from 'react'
import Link from "next/link"
import { useRouter } from "next/router"
import {useState, useEffect} from 'react'

import '@fortawesome/fontawesome-free/js/all.js';


export default function Dashboard({ind}) {

    const router = useRouter()
    const [users, setUsers] = useState(null)

    const [limit, setLimit] = useState(5)
    const [skip, setSkip] = useState(0)

    const [isAscending2, setIsAscending2] = useState(false)
    
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

    async function handleTrash(username){
        
        await fetch('/api/user/deleteUser', {
            method : 'DELETE',
            body: JSON.stringify({username: username}), //192.168.1.133//192.168.1.0/24
            headers:{
              'Content-Type' : 'application/json'
            }
        })
        seeUserList()
    }

    async function handleReset(username){
        
        await fetch('/api/user/changePw', {
            method : 'POST',
            body: JSON.stringify({username: username, admin: true, password: username}), //192.168.1.133//192.168.1.0/24
            headers:{
              'Content-Type' : 'application/json'
            }
        })
    }

    async function seeUserList(){

        let resp = await fetch('/api/user/getUsers', {
                method : 'POST',
                body: JSON.stringify({isAscending: isAscending2, limit: limit, skip: skip}),
                headers:{
                  'Content-Type' : 'application/json'
                }
            })
        let dat = await resp.json()

        let total = dat.pop()

        console.log(limit, skip, total)

        setUsers(<>
            <div>
                <span className="m-3">items in a page:</span>
                <button className="btn btn-secondary m-1" onClick={()=>{setLimit(5); setSkip(0)}}>5</button>
                <button className="btn btn-secondary m-1" onClick={()=>{setLimit(10); setSkip(0)}}>10</button>
                <button className="btn btn-secondary m-1" onClick={()=>{setLimit(20); setSkip(0)}}>20</button>
                <button className="btn btn-secondary m-1" onClick={()=>{setLimit(total); setSkip(0)}}>all</button>
            </div>

            <div className="accordion" id="accordionPanelsStayOpenExampl">

            <table className = "table table-bordered table-striped table-dark m-3 w-75">
                <thead>
                    
                <tr>
                    <td></td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                        setSkip(0)
                        setIsAscending2(false)
                        }}>v</button>
                        <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setSkip(0)
                            setIsAscending2(true)
                            }}>^</button>
                        username
                    </td>
                    <td>reset password</td>
                </tr>
                </thead>
                <tbody>
                {
                    dat.map((d) => {

                        return(
                            <React.Fragment  key = {d.username}>
                                <tr>
                                    <td>
                                        <button className='btn btn-danger' data-bs-toggle="collapse" data-bs-target={`#_${d.username}trash`} aria-expanded="true">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button> 
                                    </td>
                                    <td scope="row">{d.username}</td>
                                    <td>
                                        <button className='btn btn-warning' data-bs-toggle="collapse" data-bs-target={`#_${d.username}reset`} aria-expanded="true">
                                            <i className="fa-solid fa-arrow-rotate-left"></i>
                                        </button> 
                                    </td>
                                </tr>
                                {
                                    <tr>
                                        <td colSpan = "3" >
                                            <div id={`_${d.username}trash`} className="accordion-collapse collapse m-0">
                                                <div className="accordion-body border border-secondary border-5">
                                                    {
                                                        <>
                                                            <p>do you really want to delete {d.username}?</p>
                                                            <button className="btn btn-success me-5" data-bs-toggle="collapse" data-bs-target={`#_${d.username}trash`} onClick={()=>{handleTrash(d.username)}}>yes</button>    
                                                            <button className="btn btn-danger mx-5" data-bs-toggle="collapse" data-bs-target={`#_${d.username}trash`}>no</button>                                                
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                    </tr>                             
                                }
                                {
                                    <tr>
                                        <td colSpan = "3" >
                                            <div id={`_${d.username}reset`} className="accordion-collapse collapse m-0">
                                                <div className="accordion-body border border-secondary border-5">
                                                    {
                                                        <>
                                                            <p>do you really want to reset password to {d.username}?</p>
                                                            <button className="btn btn-success me-5" data-bs-toggle="collapse" data-bs-target={`#_${d.username}reset`} onClick={()=>{handleReset(d.username)}}>yes</button>    
                                                            <button className="btn btn-danger mx-5" data-bs-toggle="collapse" data-bs-target={`#_${d.username}reset`}>no</button>                                                
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </td>
                                    </tr>                             
                                }                           
                            </React.Fragment>
                        )
                    })
                }
                </tbody>               
            </table>
            <div className = 'd-flex flex-column bd-highlight justify-content-center mb-3'>
                <div className = 'ms-5 d-flex justify-content-center'>
                    <button className="btn btn-success m-1" onClick={()=>{setSkip(0)}}>page 1</button>
                    <button className="btn btn-success m-1" onClick={()=>{setSkip(skip < limit ?  0 : skip - limit)}}>{'<--'}</button>
                    <button className="btn btn-warning m-1" onClick={()=>{}}>{Math.ceil(skip/limit) + 1}</button>
                    <button className="btn btn-success m-1" onClick={()=>{setSkip(skip >= total - limit ?  skip : skip + limit)}}>{'-->'}</button>
                    <button className="btn btn-success m-1" onClick={()=>{setSkip(total < limit ? 0 : total - limit)}}>page {Math.ceil(total/limit)}</button>
                    <span>page n° {Math.ceil(skip/limit) + 1} on {Math.ceil(total/limit)} pages</span>                    
                </div> 
            </div>
        </div></>)
    }

    useEffect(()=>{
        seeUserList()
        console.log('refresh params');
    },[isAscending2, limit, skip])

    return (<>
        
    <div className='d-flex'>
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100 sticky-top" style={{"width": '280px'}}>
            <Link href='/'><a className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">MyProject</span>
            </a></Link>
            <hr></hr>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                <Link  href={`/protectedPages/usersDashboard/admin`}><a className="nav-link text-white" aria-current="page">
                    <i className="fab fa-delicious"></i>
                        &ensp;Scan List
                    </a></Link>
                </li>
                <li className="nav-item">
                    <Link href={`/protectedPages/allHosts/admin`}><a className="nav-link text-white" aria-current="page">
                        <i className="fa-solid fa-house-laptop"></i>
                            &ensp;Host List
                    </a></Link>
                </li>
                <li>
                    <a className="nav-link active">
                    <i className="fa-solid fa-users"></i>
                        &ensp;User List
                    </a>
                </li>
                <li>
                    <Link href="/adminPages/createUser"><a className="nav-link text-white">
                    <i className="fa-solid fa-user-plus"></i>
                        &ensp;Create new User
                    </a></Link>
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
                    <li><Link href='/changePw/admin'><a className="dropdown-item">change password</a></Link></li>
                    <li><hr className="dropdown-divider"></hr></li>
                    <li><button className="dropdown-item" onClick={handleLogOut}>Sign out</button></li>
                </ul>
            </div>
        </div>

        <div className='w-100'>
            <h1 className='text-center fw-bolder'>USER LIST</h1>
                    
            <div className='m-3 w-100'>
                {users}
            </div>            
        </div>

    </div>
        </>
    )
}

