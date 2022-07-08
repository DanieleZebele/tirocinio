const Agenda = require("agenda");
const xml2js = require('xml2js');
const { execSync } = require('child_process');

//const mongoConnectionString = "mongodb://127.0.0.1/agenda";
const mongoConnectionString ='mongodb://localhost/dabatase'
const agenda = new Agenda({ db: { address: mongoConnectionString } });

const Scan = require('../models/Scan.js')
const Host = require('../models/Host.js')

agenda.define("fetch", async () => {

    console.log('scheduler -- checking..');

    const fs = require('fs')

    await Scan.updateOne({status: 'scanning..'}, { status: 'aborted'})
    await Scan.updateOne({status: 'parsing..'}, { status: 'aborted'})
    await Scan.updateOne({status: 'finishing..'}, { status: 'aborted'})

    let resp = await Scan.where('status').equals('starting..')

    if(resp.length === 0){
        console.log('scheduler -- no scan started founded');
        return 
    }

    let indx = resp[0].counter
    let command = resp[0].command
    let outputFile = resp[0].outputFile
    let id = resp[0]._id

    await Scan.updateOne({counter: indx}, { status: 'scanning..'})

    console.log('scheduler -- scanning..', indx);
    
    try {
        execSync(command, (err, stdout, stderr) => {
     
            if (err) {
                //some err occurred
                console.error(err)
            } else {
                // the *entire* stdout and stderr (buffered)
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            }
        });

        console.log('scheduler--creato file')
        
    } catch (e) {
        console.log(e)
        console.log('scheduler--errore nel recupero dati')
        return
    }

    await Scan.updateOne({counter: indx}, { status: 'parsing..' })

    const url = outputFile
    const parser = new xml2js.Parser({ attrkey: "ATTR" })

    let xml_string 
    try{
        xml_string = fs.readFileSync(url); // restituisce stringa contenente xml
    }catch(e){
        console.log(e);
    }
    
    let data

    console.log('parsing..')

    parser.parseString(xml_string, function(error, result) {
        if(error === null) {
            data = result
        }
        else {
            console.log(error);
            return
        }
    });

    let hosts = data.nmaprun.host

    for(let i = 0; i < hosts.length; i++){
        let address, status, hostname, macAddress, os
        
        try{
            os = hosts[i].os[0].osmatch[0].ATTR.name
        }catch{
            os = 'not found'
        }

        try{
            address = hosts[i].address[0].ATTR.addr
        }catch{
            address = 'not found'
        }

        try{
            macAddress = hosts[i].address[1].ATTR.addr
        }catch{
            macAddress = 'not found'
        }

        try{
            status = hosts[i].status[0].ATTR.state
        }catch{
            status = 'not found'
        }

        try{
            hostname = hosts[i].hostnames[0].hostname[0].ATTR.name
        }catch{
            hostname = 'not found'
        }

        let ports
        try{
            ports = hosts[i].ports[0].port
            ports[0]
        }catch{
            ports = 'not found'
        }

        if(ports === 'not found'){

            await Host.create({address: address, hostname: hostname, status: status, macAddress: macAddress, scanId: id, os: os, ports: -1})

        }else{
            
            let p = []

            for(let j = 0; j < ports.length; j++){
                p[j] = {portNumber : ports[j].ATTR.portid, protocol: ports[j].ATTR.protocol} 
            }

            await Host.create({address: address, hostname: hostname, status: status, macAddress: macAddress, scanId: id, os: os, ports: p})

        }
    }
    
    await Scan.updateOne({counter: indx}, { status: 'finished', finishedAt: Date.now(), totalHosts: hosts.length})

    
    try {
        execSync(`rm ${url}`, (err, stdout, stderr) => { // elimina file da linux
     
            if (err) {
                //some err occurred
                //console.error(err)
            } else {
                // the *entire* stdout and stderr (buffered)
                //console.log(`stdout: ${stdout}`);
                //console.log(`stderr: ${stderr}`);
            }
        });

        console.log('ScanAndStore--eliminato file')
        
    } catch (e) {
        try {
            execSync(`del ${url}`, (err, stdout, stderr) => { // elimina file da  windows 
         
                if (err) {
                    //some err occurred
                    //console.error(err)
                } else {
                    // the *entire* stdout and stderr (buffered)
                    //console.log(`stdout: ${stdout}`);
                    //console.log(`stderr: ${stderr}`);
                }
            });
    
            console.log('ScanAndStore--eliminato file')
            
        } catch (e) {
            console.log(e)
            console.log('scheduler--errore nell eliminazione file')
            return
        }
    }
    await Scan.updateOne({counter: indx}, { status: 'finished'})

    console.log('scheduler -- Scan finished, total host: ', hosts.length);
});


(async function () {

    await agenda.start();
    console.log('scheduler --- started');
  
    await agenda.every("*/1 * * * *", "fetch");
})();


