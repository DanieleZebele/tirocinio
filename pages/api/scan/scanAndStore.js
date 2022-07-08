

const Counter = require('../../../models/Counter.js')
const Scan = require('../../../models/Scan.js')
const Host = require('../../../models/Host.js')

//req.body.scanner --> es nmap
//req.body.command --> es. sudo nmap -p- -O -oX ./pippo7.xml 192.168.1.0/24
//req.body.loop --> loop wait time

export default async function handler(req, res) {

    console.log('ScanAndStore -- start to fetching...')

    const response = await Counter.where().select('num')
    let indx = response[0].num

    let scanner,command,outputFile,loop_time
    try{
       scanner = req.body.scanner
       command = req.body.command
       outputFile = req.body.outputFile
    }catch(e){
        console.log(e)
        console.log('ScanAndStore --request has to contain scanner, command')
        res.status(400).end()
    }

    try{
        loop_time = false//req.body.loop_time
    }catch{
        loop_time = false
    }

    await Scan.deleteMany({counter: indx}) // se erano presenti errori, vengono elminati

    await Scan.create({counter: indx , scanner: scanner, command: command,
        outputFile: outputFile, createdAt: Date.now(), status: 'starting..',
        finishedAt: null, totalHosts: -1})
    console.log('ScanAndStore -- Scan added in queue')

    indx++
    await Counter.updateOne({}, { num: indx })
    /*
    if(loop_time){
        
        let x = await Loop.where()
        let loop = x[0].loop

        while (loop) {
            await getAndStoreData()
            indx++
            await Counter.updateOne({}, { num: indx })

            setTimeout(loop_time)

            x = await Loop.where()
            loop = x[0].loop
        }
    }
    */

    res.status(200).end()
}

