const mongoose = require('mongoose') 
mongoose.connect("mongodb://localhost/dabatase")

const Scan = require('../../../models/Scan.js')
const Host = require('../../../models/Host.js')


export default async function handler(req,res)  {

    if(req.method === 'POST'){

        const research =''// req.body.search
        const param = req.body.param
        const isAscending = req.body.isAscending
        const limit = req.body.limit
        const skip = req.body.skip

        console.log('getting hosts by: ',param,isAscending)

        if(req.body.admin === true){

            let scan = []

            if(research === ''){
                /*
                scan = Host.aggregate([
                        { _id: { address: "$address", macAddress: "$macAddress" }},
                        {fieldN: {
                            $sum: "$labs"
                          }}
                ]);*/
                //console.log(scan._pipeline[0].$group);

                //distinto solo per macAddress, non va con la coppia macAddress, address
                //scan = await Host.where().sort({[param] : isAscending === true ? 1 : -1}).select(['macAddress', 'address', 'hostname', 'status', 'os']).distinct('macAddress').populate('macAddress')

/*
                let a = await Host.where().distinct('address')
                let b = await Host.where().distinct('macAddress')

                scan = []

                let c

                //console.log(a,b);

                for(let i = 0; i < a.length ;i++){
                    for(let j = 0; j < b.length ;j++){
                        c = await Host.where('address').equals(a[i]).where('macAddress').equals(b[j]).select(['macAddress', 'address', 'hostname', 'status', 'os'])
                        if(c.length > 0){
                            scan [scan.length] = c[0]
                            //console.log(a[i],b[j]);
                        }
                    }
                }
*/
                let a = await Host.where().select('macAddress').distinct('macAddress')
                
                for(let i = 0; i < a.length ;i++){
                    let b = await Host.where('macAddress').equals(a[i]).distinct('address')
                    for(let j = 0; j < b.length ;j++){
                        let c = await Host.where('macAddress').equals(a[i]).where('address').equals(b[j])
                        if(c.length > 0){
                            scan [scan.length] = c[0]
                        }
                    }
                }

                scan.sort(function(x, y) {
                    if(isAscending){
                        if(x[param] > y[param]){
                            return 1
                        }else{
                            return -1
                        }
                    }else{
                        if(x[param] > y[param]){
                            return -1
                        }else{
                            return 1
                        }                        
                    }
                })

            }else{
                //non funziona per ora
            }

            let total = scan.length

            scan = scan.slice(skip, skip + limit)

            scan[scan.length] = total
            res.status(200).json(scan)   

        }else{

            let scan

            if(research === ''){

                let a = await Host.where().distinct('address')
                let b = await Host.where().distinct('macAddress')

                scan = []

                let c

                //console.log(a,b);

                for(let i = 0; i < a.length ;i++){
                    for(let j = 0; j < b.length ;j++){
                        c = await Host.where('address').equals(a[i]).where('macAddress').equals(b[j]).select(['macAddress', 'address', 'hostname'])
                        if(c.length > 0){
                            scan [scan.length] = c[0]
                            //console.log(a[i],b[j]);
                        }
                    }
                }

                scan.sort(function(x, y) {
                    if(isAscending){
                        if(x[param] > y[param]){
                            return 1
                        }else{
                            return -1
                        }
                    }else{
                        if(x[param] > y[param]){
                            return -1
                        }else{
                            return 1
                        }                        
                    }
                })

            }else{
                //non funziona per ora
            }

            let total = scan.length

            scan = scan.slice(skip, skip + limit)

            scan[scan.length] = total
            res.status(200).json(scan)  
        }
    }
    else{
        res.status(400).end()
    }
}
