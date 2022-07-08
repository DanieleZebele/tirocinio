import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Home() {

  const router = useRouter()

  const start = async () =>{

    const response = await fetch('/api/isFirstTime')
    const data = await response.json()

    if(data){
      console.log('prima volta -- utente admin creato')
    }

    router.replace('./login')
  }

  useEffect(()=>{
    start()
  },[])

  return (
    <>
      <h1>LOADING...</h1>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div> 
    </>
  )
}
