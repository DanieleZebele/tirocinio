const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost/dabatase")

const Users = require('../../models/Users.js')
const Counter = require('../../models/Counter.js')
export default async function handler(req,res)  {
    
    if(req.method === 'GET'){
        const isFirst = await Users.where('username').equals('admin')
        if(isFirst.length > 0){
            console.log('isFirst time--admin esistente')
            res.status(200).json(false)
        }else{
            await Counter.create({num : 0})
            await Users.create({username : "admin", password : "admin", isLoggedIn : false})
            console.log('isFirst time--admin non esistente')
            res.status(200).json(true)
        }
    }else{
        res.status(400).end()
    }
}