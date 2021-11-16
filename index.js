
// POC

var osc = require('osc')

var remote_OSC_port = 8888;





var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 9999,
    metadata: true
})

udpPort.on("message", function (oscMsg, timeTag, info) {
    console.log("An OSC message just arrived!", oscMsg);
    console.log("Remote info is: ", info);
})

udpPort.open();





console.log(process.getuid())
// /dev/ttyUSB0

var SerialPort = require('serialport')

// todo: check for 40h string in serial device name
//
var port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 57600
})

// drop root privs after running
setTimeout(function () {
  process.setuid('monz')
}, 1000)

var noteOn = false;
port.on('data', function (data) {

  console.log('Data:', data)
  if (data.length !== 2) return;
  noteOn = parseInt(data[0]) || 0
  // todo... light up the correct LED (not all of them!)
  var b = Buffer.from('400'+String(noteOn), 'hex')
  port.write(b)

  udpPort.send({
        address: "/key/1",
        args: [
            {
                type: "s",
                value: "key"
            },
            {
                type: "i",
                value: 100
            }
        ]
    }, "127.0.0.1", 9999)

})

