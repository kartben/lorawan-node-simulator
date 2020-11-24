import { EndNode } from './end-node';
import { Gateway } from './gateway';

let g1 = new Gateway(Buffer.from('0000000000000001', 'hex'), new URL('udp://https://ttnv3-stack-whmrzhtjgy2lm.eastus.cloudapp.azure.com:1700'))
let g2 = new Gateway(Buffer.from('0000000000000002', 'hex'), new URL('udp://https://ttnv3-stack-whmrzhtjgy2lm.eastus.cloudapp.azure.com:1700'))
let g3 = new Gateway(Buffer.from('0000000000000003', 'hex'), new URL('udp://https://ttnv3-stack-whmrzhtjgy2lm.eastus.cloudapp.azure.com:1700'))
let g4 = new Gateway(Buffer.from('0000000000000004', 'hex'), new URL('udp://https://ttnv3-stack-whmrzhtjgy2lm.eastus.cloudapp.azure.com:1700'))
let g5 = new Gateway(Buffer.from('0000000000000005', 'hex'), new URL('udp://https://ttnv3-stack-whmrzhtjgy2lm.eastus.cloudapp.azure.com:1700'))

for (let index = 8000; index < 8200; index++) {
    let b = Buffer.allocUnsafe(4);
    b.writeUInt32BE(index)
    let endNode = new EndNode(b, Buffer.from('4F58A13D1F44D307AFACD65A0A5DDF06', 'hex'), Buffer.from('4F58A13D1F44D307AFACD65A0A5DDF06', 'hex'))
    endNode.on('packet', (x) => {
        if(Math.random() > 0.7) g1.enqueueUplink(x)
        if(Math.random() > 0.7) g2.enqueueUplink(x)
        if(Math.random() > 0.7) g3.enqueueUplink(x)
        if(Math.random() > 0.7) g4.enqueueUplink(x)
        if(Math.random() > 0.7) g5.enqueueUplink(x)
    })
    endNode.start()
}