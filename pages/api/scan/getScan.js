const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost/dabatase")

const Scan = require('../../../models/Scan.js')
const Host = require('../../../models/Host.js')


export default async function handler(req,res)  {

    const index = req.body.index
    const research = req.body.search
    const param = req.body.param
    const isAscending = req.body.isAscending
    const limit = req.body.limit
    const skip = req.body.skip

    console.log('getting scans by: ',param, isAscending, research)

    let scan
    let total

    if(research === ''){
        scan = await Scan.where()
            .select(['counter','scanner', 'status', 'command', 'totalHosts', 'createdAt', 'finishedAt'])
            .sort({[param] : isAscending === true ? 1 : -1})
            .skip(skip)
            .limit(limit)
        total = await Scan.where().count()
    }else{
        let numberSearch
        try{
            numberSearch = Number(research)
        }catch{
        }
        
        if(numberSearch){
            scan = await Scan.where()
                .or([{'scanner': { "$regex": research}}, {'status': { "$regex": research}}, {'totalHosts': numberSearch}, {'counter': numberSearch}, {'command': { "$regex": research}}]) //{'totalHosts': { "$regex": research}},,  {'createdAt': { "$regex": research}}, {'finishedAt': { "$regex": research}
                .select(['counter','scanner', 'status', 'command', 'totalHosts', 'createdAt', 'finishedAt']).sort({[param] : isAscending === true ? 1 : -1}).skip(skip).limit(limit)

            total = await Scan.where().or([{'scanner': { "$regex": research}}, {'status': { "$regex": research}}, {'totalHosts': numberSearch}, {'counter': numberSearch}, {'command': { "$regex": research}}]).count()
        }else{
            scan = await Scan.where()
                .or([{'scanner': { "$regex": research}}, {'status': { "$regex": research}}, {'command': { "$regex": research}}]) //{'totalHosts': { "$regex": research}},,  {'createdAt': { "$regex": research}}, {'finishedAt': { "$regex": research}
                .select(['counter','scanner', 'status', 'command', 'totalHosts', 'createdAt', 'finishedAt']).sort({[param] : isAscending === true ? 1 : -1}).skip(skip).limit(limit)
        
            total = await Scan.where().or([{'scanner': { "$regex": research}}, {'status': { "$regex": research}}, {'command': { "$regex": research}}]).count()
        }
    }
    scan[scan.length] = total
    res.status(200).json(scan) 
    


    //console.log(scan)

    
}
