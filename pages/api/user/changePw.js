const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost/dabatase")

const Users = require('../../../models/Users.js')
const bcrypt = require('bcrypt');

async function updatePw(username, pw1, pw2) {

    const x = await Users.where('username').equals(username)

    if(x.length === 0){
        return false
    }

    if(await bcrypt.compare(pw1, x[0].password)){
        x[0].password = pw2
        x[0].save()

        return true
    }else{
        return false
    }
}

export default async function handler(req,res)  {

    if(req.method === 'POST'){
        if(req.body.admin === true){

            const x = await Users.where('username').equals(req.body.username)

            if(x.length === 0){
                res.status(200).json(false)
            }

            x[0].password = req.body.password
            x[0].save()

            console.log('reset password di ', req.body.username);

            res.status(200).json(true)

        }else{
            if(await updatePw(req.body.username, req.body.oldPw, req.body.newPw)){
                console.log('changePw--passwrd aggiornata')
                res.status(200).json(true)
            }
            else{
                console.log('changePw--non trovato admin')
                res.status(200).json(false)
            }            
        }
    }
    else{
        res.status(200).end()
    }
}