import React from 'react'
import Link from "next/link"
import { useRouter } from "next/router"
import {useState, useEffect} from 'react'

import '@fortawesome/fontawesome-free/js/all.js';


export default function Dashboard({ind}) {

    const router = useRouter()
    const [scans, setScans] = useState(null)
    const [research, setResearch] = useState("")


    const [limit, setLimit] = useState(5)
    const [skip, setSkip] = useState(0)

    const [param2, setParam2] = useState('')
    const [isAscending2, setIsAscending2] = useState(false)

    const username = router.query.username

    
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

    async function seeScanList(){

        //console.log(param2, isAscending2, research);

        let resp = await fetch('/api/scan/getAllHosts', {
                method : 'POST',
                body: JSON.stringify({admin: username === 'admin' ? true : false, search: research, param: param2, isAscending: isAscending2, limit: limit, skip: skip}),
                headers:{
                  'Content-Type' : 'application/json'
                }
            })
        let dat = await resp.json()

        let total = dat.pop()

        setScans(<>
            <div>
                <span className="m-3">items in a page:</span>
                <button className="btn btn-secondary m-1" onClick={()=>{setLimit(5); setSkip(0)}}>5</button>
                <button className="btn btn-secondary m-1" onClick={()=>{setLimit(10); setSkip(0)}}>10</button>
                <button className="btn btn-secondary m-1" onClick={()=>{setLimit(20); setSkip(0)}}>20</button>
                <button className="btn btn-secondary m-1" onClick={()=>{setLimit(total); setSkip(0)}}>all</button>
            </div>
            {/*
                         <form className="d-flex w-25 my-4">
                <input className="form-control m-3" type="search" placeholder="Search scan.." aria-label="Search" onChange = {(e) => {
                        setResearch(e.target.value)
                    }}></input>
            </form>   
                */}


            <div className="accordion" id="accordionPanelsStayOpenExampl">

            <table className = "table table-bordered table-striped table-dark m-3 ">
                <thead>
                <tr>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                        setParam2('macAddress')
                        setSkip(0)
                        setIsAscending2(false)
                        }}>v</button>
                        <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setParam2('macAddress')
                            setSkip(0)
                            setIsAscending2(true)
                            }}>^</button>
                        macAddress
                    </td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                        setParam2('address')
                        setSkip(0)
                        setIsAscending2(false)
                        }}>v</button>
                        <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setParam2('address')
                            setSkip(0)
                            setIsAscending2(true)
                            }}>^</button>
                        address
                    </td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                        setParam2('hostname')
                        setSkip(0)
                        setIsAscending2(false)
                        }}>v</button>
                        <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setParam2('hostname')
                            setSkip(0)
                            setIsAscending2(true)
                            }}>^</button>
                        hostname
                    </td>

                    {
                        username === 'admin' ?
                    
                            <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                                setParam2('status')
                                setSkip(0)
                                setIsAscending2(false)
                                }}>v</button>
                                <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                                    setParam2('status')
                                    setSkip(0)
                                    setIsAscending2(true)
                                    }}>^</button>
                                status
                            </td>
                        :
                            <></>
                    }
                    {    
                        username === 'admin' ?
                            <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                                setParam2('os')
                                setSkip(0)
                                setIsAscending2(false)
                                }}>v</button>
                                <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                                    setParam2('os')
                                    setSkip(0)
                                    setIsAscending2(true)
                                    }}>^</button>
                                os
                            </td>
                        :
                           <></>
                    }
                </tr>
                </thead>
                <tbody>
                {
                    dat.map((d) => {

                        return(
                            <tr key = {d.address + d.macAddress}>
                                <td scope="row">{d.macAddress}</td>
                                <td>{d.address}</td>
                                <td>{d.hostname}</td>
                                {    
                                    username === 'admin' ?
                                        <td>{d.status}</td>
                                    :
                                        <></>
                                }
                                {    
                                    username === 'admin' ?
                                        <td>{d.os}</td>
                                    :
                                        <></>
                                }
                            </tr>
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
        seeScanList(research)
        console.log('refresh params');
    },[param2, isAscending2, limit, skip])

    return (<>
        
    <div className='d-flex'>
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100 sticky-top" style={{"width": '280px'}}>
            <Link href='/'><a className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">MyProject</span>
            </a></Link>
            <hr></hr>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                <Link  href={`/protectedPages/usersDashboard/${username}`}><a className="nav-link text-white" aria-current="page">
                    <i className="fab fa-delicious"></i>
                        &ensp;Scan List
                    </a></Link>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page">
                    <i className="fa-solid fa-house-laptop"></i>
                        &ensp;Host List
                    </a>
                </li>
                {
                    username === 'admin' ? 
                        <li>
                            <Link href="/adminPages/allUsers"><a className="nav-link text-white">
                                <i className="fa-solid fa-users"></i>
                                &ensp;User List
                            </a></Link>
                        </li>
                    : 
                        <></>
                }

                {
                    username === 'admin' ? 
                        <li>
                            <Link href="/adminPages/createUser"><a className="nav-link text-white">
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
                    <li><Link href='/changePw/admin'><a className="dropdown-item">change password</a></Link></li>
                    <li><hr className="dropdown-divider"></hr></li>
                    <li><button className="dropdown-item" onClick={handleLogOut}>Sign out</button></li>
                </ul>
            </div>
        </div>

        <div className='w-100'>
            <h1 className='text-center fw-bolder'>HOST LIST</h1>
                    
            <div className='m-3 w-100'>
                {scans}
            </div>            
        </div>

    </div>
        </>
    )
}

