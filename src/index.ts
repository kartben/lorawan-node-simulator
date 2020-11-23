import PacketForwarder from 'packet-forwarder';
import lora_packet from 'lora-packet';

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}


var fCnt : Record<number, number> = {};

var generatePacket = (devAddr: number) => {
    fCnt[devAddr] = fCnt[devAddr] || 0 
    var devAddrBuffer = Buffer.allocUnsafe(4);
    devAddrBuffer.writeUInt32BE(devAddr);
    var packet = lora_packet.fromFields(
        {
            MType: "Confirmed Data Up", // (default)
            DevAddr: devAddrBuffer,
            FCtrl: {
                ADR: false, 
                ACK: false,
                ADRACKReq: false,
                FPending: false, 
            },
            FPort: 1,
            FCnt: fCnt[devAddr]++,
            payload: "test",
        },
        Buffer.from("4F58A13D1F44D307AFACD65A0A5DDF06", "hex"), // AppSKey
        Buffer.from("4F58A13D1F44D307AFACD65A0A5DDF06", "hex") // NwkSKey
    );
    return packet;
}    

async function sendFakeUplink(devAddr: number) {
    let phyPayload = generatePacket(devAddr).getPHYPayload();
    if (phyPayload) {
        let data = phyPayload.toString('base64')

        const gateway = '4546456456456456'
        const target = 'ttnv3-stack-whmrzhtjgy2lm.eastus.cloudapp.azure.com'
        const port = 1700
        const packetForwarder = new PacketForwarder({ gateway, target, port })
        const message = {
            rxpk: [{
                time: new Date().toISOString(),
                tmms: null,
                tmst: (new Date().getTime() / 1000 | 0),
                freq: 868.3,
                chan: null,
                rfch: 0,
                stat: 0,
                modu: 'LORA',
                datr: 'SF11BW125',
                codr: '4/5',
                rssi: -102,
                lsnr: 7.8,
                size: 16,
                data: data
            }]
        }
        console.log("Sending packet #%d for Device #%d", fCnt[devAddr], devAddr);
        await packetForwarder.sendUplink(message);
        await packetForwarder.close();
    
        setTimeout(() => { sendFakeUplink(devAddr) } , getRandomArbitrary(8000, 14000)) ;
    }

}

for(let i = 1225 ; i < 5000 ; i++) {
    setTimeout( () => { sendFakeUplink(i) }, getRandomArbitrary(0,30000)) ;
}

