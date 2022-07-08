const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost/dabatase")

const Users = require('../../../models/Users.js')
const cookie = require("cookie") ;

async function logout(user) {
    
    await Users.updateOne({username:user},{isLoggedIn:false})
}

export default async function handler(req,res)  {

    /*
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", req.body.token, {
            httpOnly : true,
            secure : process.env.NODE_ENV !== "development",
            expires : newDate(0),
            sameSite : "strict",
            path : `/usersDashboard/${req.body.username}`
        })
    )*/

    if(req.method === 'POST'){
            
        const serialised = cookie.serialize(req.body.username, '', {// distruzione cookies
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });

        await res.setHeader("Set-Cookie", serialised);


        //const { cookies } = req;
        //const jwt = cookies.TokenJWT;
        //destroy(jwt)
        await logout(req.body.username)
       // await res.setHeader("Set-Cookie", ""); // distruzione cookie
        res.status(200).end()
    }
    else{
        res.status(400).end()
    }
}