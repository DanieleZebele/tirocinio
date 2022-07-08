const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost/dabatase")

const Scan = require('../../../models/Scan.js')
const Host = require('../../../models/Host.js')


export default async function handler(req,res)  {

    const index = req.body.index

    let scan = await Scan.where('counter').equals(index)

    if(scan.length > 0){
        let id = scan[0]._id

        await Host.deleteMany({ 'scanId': id });
        await Scan.deleteOne({ 'counter': index });   

    }else{
        console.log('deleteScan -- problema');
        res.status(501).end()
    }

    res.status(200).end()
}