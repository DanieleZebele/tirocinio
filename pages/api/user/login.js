const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/dabatase")

const bcrypt = require('bcrypt');

const Users = require('../../../models/Users.js')
import { sign } from "jsonwebtoken";
const cookie = require("cookie");

const secret = process.env.SECRET;


async function findPw(username, pw) {

    const x = await Users.where('username').equals(username)

    if (x.length === 0) {
        return false
    }

    return await bcrypt.compare(pw, x[0].password)

}

export default async function handler(req, res) {

    if (req.method === 'POST') {

       

        if (await findPw(req.body.username, req.body.password)) {
            await Users.updateOne({ username: req.body.username }, { isLoggedIn: true })

            const token = sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1h
                    username: req.body.username,
                },
                secret + req.body.username
            );

            const serialised = cookie.serialize(req.body.username, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: "strict",
                maxAge: 60 * 60 ,
                path: "/",
            });

            await res.setHeader("Set-Cookie", serialised);

            res.status(200).json(true)
            console.log('login--trovato utente')
        } else {
            console.log('login--non trovato utente')
            res.status(200).json(false)
        }
    } else {
        res.status(200).end()
    }
}