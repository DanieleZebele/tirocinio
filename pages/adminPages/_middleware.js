import { NextResponse} from "next/server";
import  { verify } from "jsonwebtoken";

const secret = process.env.SECRET
const server = process.env.NODE_ENV === "development" ? 'http://localhost:3000': 'https://your_deployment.server.com';

export default async function middlewere(req){
    console.log('admin middleware')
    
    const { cookies } = req;
    const jwt = cookies.admin;

    try{
        verify(jwt, secret + "admin")
        return NextResponse.next()
    }catch(e){
        console.log('no cookies verified, redirect from middleware')
        return NextResponse.redirect(`${server}/login`)
    }
}