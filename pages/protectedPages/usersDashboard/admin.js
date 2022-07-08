import React from 'react'
import Link from "next/link"
import { useRouter } from "next/router"
import {useState, useEffect} from 'react'

import '@fortawesome/fontawesome-free/js/all.js';


export default function Dashboard({command, outputFile}) {

    const router = useRouter()
    const [scans, setScans] = useState(null)
    const [hosts, setHosts] = useState({})
    const [research, setResearch] = useState("")


    const [limit, setLimit] = useState(5)
    const [skip, setSkip] = useState(0)

    const [param2, setParam2] = useState('counter')
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

    async function handleTrash(index){
        
        await fetch('/api/scan/deleteScan', {
            method : 'DELETE',
            body: JSON.stringify({index: index}),
            headers:{
              'Content-Type' : 'application/json'
            }
        })
        seeScanList()
    }

    async function handleFetch(){// con linux aggiungere sudo al command
        //console.log(process.env.COMMAND)
        
        await fetch('/api/scan/scanAndStore', {
            method : 'POST',
            body: JSON.stringify({scanner: 'nmap', command: command, outputFile: outputFile}), // nmap -p- -T4 -O -oX  192.168.1.133//192.168.1.0/24 nmap -F -n -Pn 192.168.1.0/24
            headers:{
              'Content-Type' : 'application/json'
            }
        })
        seeScanList()
    }

    async function setHostsTable(index, param, isAscending, skipped, limit){

        let c = `_${index}`

        let response = await fetch('/api/scan/getHosts', {
            method : 'POST',
            body: JSON.stringify({admin: true, index: index, param: param, isAscending: isAscending, search: research, skip: skipped, limit: limit}),
            headers:{
              'Content-Type' : 'application/json'
            }
        })
        let data = await response.json()
        let total = data.pop()

        let x = (<>
            <h3 className='text-center fw-bolder'>DETAILS ABOUT SCAN N° {index}</h3>
            <div>
                <span className="m-3">items in a page:</span>
                <button className="btn btn-secondary m-1" onClick={()=>{setHostsTable(index, param, isAscending, 0, 1)}}>1</button>
                <button className="btn btn-secondary m-1" onClick={()=>{setHostsTable(index, param, isAscending, 0, 2)}}>2</button>
                <button className="btn btn-secondary m-1" onClick={()=>{setHostsTable(index, param, isAscending, 0, 5)}}>5</button>
                <button className="btn btn-secondary m-1" onClick={()=>{setHostsTable(index, param, isAscending, 0, 10)}}>10</button>
                <button className="btn btn-secondary m-1" onClick={()=>{setHostsTable(index, param, isAscending, 0, total)}}>all</button>
            </div>

            <table className = "table table-bordered table-striped table-dark ">
                <thead className = "sticky-top fs-5 fw-bolder">
                <tr>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setHostsTable(index, 'address', false, 0, limit)
                            setResearch('')
                            }}>v</button>
                            <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                                setHostsTable(index, 'address', true, 0, limit)
                                setResearch('')
                                }}>^</button>
                            address
                    </td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setHostsTable(index, 'macAddress', false, 0, limit)
                            setResearch('')
                            }}>v</button>
                            <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                                setHostsTable(index, 'macAddress', true, 0, limit)
                                setResearch('')
                                }}>^</button>
                            macAddress
                    </td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setHostsTable(index, 'os', false, 0, limit)
                            setResearch('')
                            }}>v</button>
                            <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                                setHostsTable(index, 'os', true, 0, limit)
                                setResearch('')
                                }}>^</button>
                            os
                    </td>
                    <td scope="col">status</td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setHostsTable(index, 'hostname', false, 0, limit)
                            setResearch('')
                            }}>v</button>
                            <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                                setHostsTable(index, 'hostname', true, 0, limit)
                                setResearch('')
                                }}>^</button>
                            hostname
                    </td>
                    <td scope="col">
                        <table className = "table table-bordered table-striped table-dark " >
                            <thead>
                                <tr><td colSpan = '2'><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                                    setHostsTable(index, 'ports', false, 0, limit)
                                    setResearch('')
                                }}>v</button>
                                <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                                    setHostsTable(index, 'ports', true, 0, limit)
                                    setResearch('')
                                    }}>^</button>
                                    ports
                                </td></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>name</td>
                                    <td>protocol</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </thead>
                <tbody>
                {
                    data.map((d) => {
                        return(
                            <tr key = {d.address}>
                                <td scope="row">{d.address}</td>
                                <td>{d.macAddress}</td>
                                <td>{d.os}</td>
                                <td>{d.status}</td>
                                <td>{d.hostname}</td>
                                <td><table className = "table table-bordered table-striped table-dark ">
                                    <tbody>
                                        { 
                                            d.ports === -1 ? <tr><td>{'not found'}</td></tr> :
                                                d.ports.map((e, i) => {
                                                    return(
                                                        <tr key = {i}>
                                                            <td>{e.portNumber}</td>
                                                            <td>{e.protocol}</td>
                                                        </tr>                                                        
                                                    )
                                                })
                                        }
                                    </tbody>
                                </table></td> 
                            </tr>                                
                        )
                    }) 
                }
               </tbody>                    
            </table>
            <div className = 'd-flex flex-column bd-highlight justify-content-center mb-3'>
                <div className = 'ms-5 d-flex justify-content-center'>
                    <button className="btn btn-success m-1" onClick={()=>{setHostsTable(index, param, isAscending, 0 ,limit)}}>page 1</button>
                    <button className="btn btn-success m-1" onClick={()=>{setHostsTable(index, param, isAscending, skipped < limit ?  0 : skipped - limit ,limit)}}>{'<--'}</button>
                    <button className="btn btn-warning m-1" onClick={()=>{}}>{Math.ceil(skipped/limit) + 1}</button>
                    <button className="btn btn-success m-1" onClick={()=>{setHostsTable(index, param, isAscending, skipped >= total - limit ?  skipped : skipped + limit,limit)}}>{'-->'}</button>
                    <button className="btn btn-success m-1" onClick={()=>{setHostsTable(index, param, isAscending, total < limit ? 0 : total - limit, limit)}}>page {Math.ceil(total/limit)}</button>  
                    <span>page n° {Math.ceil(skipped/limit) + 1} on {Math.ceil(total/limit)} pages</span> 
                </div> 
            </div>
        </>)

        let y = {}
        y[c] = x
        setHosts(hosts => ({
            ...hosts,
            ...y
        }))

    }
  /*  <form class="d-flex">
    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
    <button class="btn btn-outline-success" type="submit">Search</button>
  </form>*/
    /*
            <input placeholder = "ricerca.." type = 'text' value = {research}  onChange = {(e) => {
                setResearch(e.target.value)
                }}>
            </input> */

    async function seeScanList(){

        //console.log(param2, isAscending2, research);

        let resp = await fetch('/api/scan/getScan', {
                method : 'POST',
                body: JSON.stringify({search: research, param: param2, isAscending: isAscending2, limit: limit, skip: skip}),
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
            
            <form className="d-flex w-25 my-4">
                <input className="form-control m-3" type="search" placeholder="Search scan.." aria-label="Search" onChange = {(e) => {
                        setResearch(e.target.value)
                    }}></input>
            </form>

            <div className="accordion" id="accordionPanelsStayOpenExampl">

            <table className = "table table-bordered table-striped table-dark m-3 ">
                <thead  className = " fs-5 fw-bolder">
                <tr>
                    <td></td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                        setParam2('counter')
                        setSkip(0)
                        setIsAscending2(false)
                        }}>v</button>
                        <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setParam2('counter')
                            setSkip(0)
                            setIsAscending2(true)
                            }}>^</button>
                        #
                    </td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                        setParam2('totalHosts')
                        setSkip(0)
                        setIsAscending2(false)
                        }}>v</button>
                        <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setParam2('totalHosts')
                            setSkip(0)
                            setIsAscending2(true)
                            }}>^</button>
                        #HOSTS
                    </td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                        setParam2('scanner')
                        setSkip(0)
                        setIsAscending2(false)
                        }}>v</button>
                        <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setParam2('scanner')
                            setSkip(0)
                            setIsAscending2(true)
                            }}>^</button>
                        scanner
                    </td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                        setParam2('command')
                        setSkip(0)
                        setIsAscending2(false)
                        }}>v</button>
                        <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setParam2('command')
                            setSkip(0)
                            setIsAscending2(true)
                            }}>^</button>
                        command
                    </td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                        setParam2('createdAt')
                        setSkip(0)
                        setIsAscending2(false)
                        }}>v</button>
                        <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setParam2('createdAt')
                            setSkip(0)
                            setIsAscending2(true)
                            }}>^</button>
                        created at
                    </td>
                    <td scope="col"><button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                        setParam2('finishedAt')
                        setSkip(0)
                        setIsAscending2(false)
                        }}>v</button>
                        <button style = {{margin: '0px', fontSize: '10px'}} onClick={()=>{
                            setParam2('finishedAt')
                            setSkip(0)
                            setIsAscending2(true)
                            }}>^</button>
                        finished at
                    </td>
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
                    <td></td>
                </tr>
                </thead>
                <tbody>
                {
                    dat.map((d, index) => {
                        let h = `header${d.counter}`
                        let s = `#_${d.counter}`
                        let c = `_${d.counter}`

                        let d1 = new Date(d.createdAt)
                        let d2 = d.finishedAt ? new Date(d.finishedAt) : null
                        return(
                        <React.Fragment key={index}>
                            <tr >
                                <td>
                                        <button className='btn btn-danger' data-bs-toggle="collapse" data-bs-target={`${s}trash`} aria-expanded="true">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button> 

                                </td>
                                <td scope="row">{d.counter}</td>
                                <td>{d.status === 'scanning..' ?
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    :
                                        d.status === 'starting..' || d.status === 'aborted'? 
                                            'unknow'
                                        :
                                        d.totalHosts 
                                    }
                                </td>
                                <td>{d.scanner}</td>
                                <td>{d.command}</td>
                                <td>{d1.toLocaleString('en-GB', { timeZone: 'UTC' })}</td>
                                <td>{d2 ? d2.toLocaleString('en-GB', { timeZone: 'UTC' }) 
                                    :
                                        d.status === 'starting..' || d.status === 'aborted'? 
                                            'unknow'
                                        :
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>                                        
                                    }
                                </td>
                                <td>{d.status}</td>
                                <td>
                                    {
                                        d.status === 'finished' ?
                                            <div className="">
                                                <h2 className="accordion-header" id={h}>
                                                    <button className="accordion-button"  type="button" data-bs-toggle="collapse" data-bs-target={s} aria-expanded="true" aria-controls={d.counter} onClick = {
                                                        () => {
                                                            setHostsTable(d.counter, '_id', false, 0, 2)
                                                        }}>
                                                        details{' '}{d.counter}
                                                    </button>
                                                </h2>
                                            </div>
                                        :
                                            <></>
                                    }
                                </td>
                            </tr>
                            {
                                <tr>
                                    <td colSpan = "9" >
                                        <div id={`_${d.counter}trash`} className="accordion-collapse collapse m-0">
                                            <div className="accordion-body border border-secondary border-5">
                                                {
                                                    <>
                                                        <p>are you sure?</p>
                                                        <button className="btn btn-success me-5" data-bs-toggle="collapse" data-bs-target={`${s}trash`} onClick={()=>{handleTrash(d.counter)}}>yes</button>    
                                                        <button className="btn btn-danger mx-5" data-bs-toggle="collapse" data-bs-target={`${s}trash`}>no</button>                                                
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                </tr>                             
                            }
                            {
                                d.status === 'finished' ?
                                    <tr>
                                        <td colSpan = "9" >
                                            <div id={`_${d.counter}`} className="accordion-collapse collapse m-0" aria-labelledby={h}>
                                                <div className="accordion-body border border-secondary border-5">
                                                    {hosts[c]}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                : 
                                    <tr><td colSpan = "9" ></td></tr>                              
                            }
                        </React.Fragment>)
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
        console.log('refresh hosts')
    },[hosts, research])

    useEffect(()=>{
        seeScanList(research)
        console.log('refresh params');
    },[param2, isAscending2, limit, skip])

    /*
    useEffect(()=>{
        setHostsTable(indx,'counter', false)
        console.log('refresh research');
    },[research])*/

/*
            <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
                <div className="container-fluid" >
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Menu
                                </a>
                                <ul className="dropdown-menu " aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#">Logout </a></li>
                                    <li><hr className="dropdown-divider"></hr></li>
                                    <li><a className="dropdown-item" href="#">Change Password</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
    */
    return (<>
        
    <div className='d-flex'>
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100 sticky-top" style={{"width": '280px'}}>
            <Link href='/'><a className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">MyProject</span>
            </a></Link>
            <hr></hr>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page">
                    <i className="fab fa-delicious"></i>
                        &ensp;Scan List
                    </a>
                </li>
                <li className="nav-item">
                    <Link href={`/protectedPages/allHosts/admin`}><a className="nav-link text-white" aria-current="page">
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
            <h1 className='text-center fw-bolder'>SCAN LIST</h1>

            <div className = 'd-flex flex-column mb-3'>
                <div className = 'ms-5 d-flex justify-content-center'>
                    <button type="button" className="btn btn-primary btn-lg m-5 " data-bs-toggle="collapse" data-bs-target={`#message`} aria-expanded="true" onClick = {handleFetch}>START NEW SCAN</button>   
                </div>
            </div>

            <div id={`message`} className="accordion-collapse collapse">
                <div className="accordion-body d-flex justify-content-center">
                    {
                        <div className="border border-info border-2 bg-white p-2 rounded-pill">
                            <span>new scan request added in queue</span>    
                            <button className="btn btn-primary mx-2" data-bs-toggle="collapse" data-bs-target={`#message`}>ok</button>                                                
                        </div>
                    }
                </div>
            </div>
                    
            <div className='m-3 w-100'>
                {scans}
            </div>            
        </div>

    </div>



{/**/}
  
            {/*
            <div className="d-flex flex-row-reverse bd-highlight m-5 sticky-top">
                <div className="accordion-flush border rounded border-info" id="accordionExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <p className="text-info">admin</p>
                            <img src="/profile.png" width={50} className = 'p-0' alt="profile"></img>
                        </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <button type="button" className="btn btn-primary m-3"><Link href='/changePw'><a className="link-light">cambia password</a></Link></button>
                                <button type="button" className="btn btn-primary m-3"><Link href='../adminPages/createUser'><a className="link-light">create new user</a></Link></button>
                                <button type="button" className="btn btn-primary m-3" onClick = {handleLogOut}>Logout</button>                        
                            </div>
                        </div>
                    </div>
                </div>
            </div>*/}
            {//<script src="https://kit.fontawesome.com/584d937bd2.js" crossorigin="anonymous"></script><i className="fa-solid fa-border-all"></i>
}
            
        </>
    )
}

/*
<div>
<p>{name}</p>
<button className="btn btn-danger" onClick={()=>{setName('ciao')}}>cambiami</button>
</div>

<MyComponent name={name} handleNameChange={setName} ></MyComponent>
*/


export async function getServerSideProps(){  //serve per iniettare props sul compon

    return{    //obbligatorio
        props:{ //obbligatorio
            command: process.env.COMMAND,
            outputFile: process.env.OUTPUTFILE
        },
    }
}

