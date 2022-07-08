const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost/dabatase")

const Users = require('../../../models/Users.js')


export default async function handler(req,res)  {

    const isAscending = req.body.isAscending
    const skip = req.body.skip
    const limit = req.body.limit

    let tot = await Users.where()
    let u = await Users.where()
        .sort({'username' : isAscending === true ? 1 : -1})
        .select(['username'])
        .skip(skip)
        .limit(limit)

    u[u.length] = tot.length

    res.status(200).json(u)
}