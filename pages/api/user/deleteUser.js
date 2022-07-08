const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost/dabatase")

const Users = require('../../../models/Users.js')

export default async function handler(req,res)  {

    const username = req.body.username

    let u = await Users.where('username').equals(username)

    if(u.length > 0){

        await Users.deleteOne({ 'username': username });

    }else{
        console.log('deleteUser -- problema');
        res.status(501).end()
    }

    res.status(200).end()
}