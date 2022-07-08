const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost/dabatase")

const Users = require('../../../models/Users.js')

async function create(username, pw) {
    const x = await Users.where("username").equals(username)
    if(x.length > 0){
        //utente gia greato
        return false
    }

    await Users.create({"username" : username, "password" : pw, "isLoggedIn" : false})
    return true
}

export default async function handler(req,res)  {

    if(req.method === 'POST'){

        if(await create(req.body.username, req.body.password)){
            res.status(200).json(true)
        }
        else{
            res.status(200).json(false)
        }
    }
    else{
        res.status(200).end()
    }
}