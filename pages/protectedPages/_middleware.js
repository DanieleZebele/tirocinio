import { NextResponse} from "next/server";
import  { verify } from "jsonwebtoken";

const secret = process.env.SECRET
const server = 'http://localhost:3000' ;

export default async function middleware(req){

    let i = req.url.length - 1 
    let username = ''

    while(req.url[i] !== '/'){
        username = req.url[i] + username
        i--
    }

    console.log(username, 'middlewere')

    const { cookies } = req;
    const jwt = cookies[username];

    if( jwt === undefined){
        console.log('no cookies founded')
        return  NextResponse.redirect(`${server}/login`)
    }

    try{
        verify(jwt, secret + username)
        return NextResponse.next()
    }catch(e){
        console.log('no cookies verified')
        return NextResponse.redirect(`${server}/login`)
    }
}