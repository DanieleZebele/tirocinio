const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost/dabatase")

const Scan = require('../../../models/Scan.js')
const Host = require('../../../models/Host.js')


export default async function handler(req,res)  {

    if(req.method === 'POST'){

        const index = req.body.index
        const research =''// req.body.search
        const param = req.body.param
        const isAscending = req.body.isAscending
        const skip = req.body.skip
        const limit = req.body.limit

        console.log('getting hosts by: ',param,isAscending, research)

        let id

        
        let s = await Scan.where('counter').equals(index).select('_id')

        if(s.length === 0){
            res.status(200).json([])
            return 
        }

        id = s[0]._id
        

        if(req.body.admin === true){

            let scan
            let total

            if(research === ''){
                scan = await Host.where('scanId').equals(id).sort({[param] : isAscending === true ? 1 : -1}).select(['macAddress', 'address', 'hostname', 'status', 'os', 'ports']).skip(skip).limit(limit)
                total = await Host.where('scanId').equals(id).count()
            }else{
                //non funziona per ora
                scan = await Host.where('scanId').equals(id)
                    .or([{'hostname': { "$regex": Number(research)}}, {'macAddress': { "$regex": research}}, {'os': { "$regex": research}}, {'address': { "$regex": research}}, {'status': { "$regex": research}}])
                    .select(['macAddress', 'address', 'hostname', 'status', 'os', 'ports']).sort({[param] : isAscending === true ? 1 : -1}).lean()
                        // manca ricerca su porte

            }
            /*
            let a = await Host.where('scanId').equals(id).sort({[param] : isAscending === true ? 1 : -1}).select(['_id', 'macAddress', 'address', 'hostname', 'status', 'os', 'ports']).skip(7).limit(1)
            let b = await Host.where('scanId').equals(id).sort({[param] : isAscending === true ? 1 : -1}).select(['_id','macAddress', 'address', 'hostname', 'status', 'os', 'ports']).skip(8).limit(1)
            console.log(a);
            console.log(b);*/
            
            scan[scan.length] = total
            //console.log(scan)
            res.status(200).json(scan)                
        }else{

            let scan
            let total

            if(research === ''){
                scan = await Host.where('scanId').equals(id).sort({[param] : isAscending === true ? 1 : -1}).select(['macAddress', 'address', 'hostname']).skip(skip).limit(limit)
                total = await Host.where('scanId').equals(id).count()
            }else{
                //non funziona per ora
                scan = await Host.where('scanId').equals(id)
                    .or([{'hostname': { "$regex": Number(research)}}, {'macAddress': { "$regex": research}}, {'os': { "$regex": research}}, {'address': { "$regex": research}}, {'status': { "$regex": research}}])
                    .select(['macAddress', 'address', 'hostname']).sort({[param] : isAscending === true ? 1 : -1}).lean()
                    // manca ricerca su porte
            }
            scan[scan.length] = total
            res.status(200).json(scan)
        }
    }
    else{
        res.status(400).end()
    }
}
