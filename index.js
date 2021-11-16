// POC

var osc = require('osc')
var SerialPort = require('serialport')

var remote_OSC_port = 8888;

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 8888,
    metadata: true
})

udpPort.open()

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
  if (data.length !== 2) return;
  var key = parseInt(data[1])
  noteOn = parseInt(data[0]) || 0
  // todo... light up the correct LED (not all of them!)
  var b = Buffer.from('400'+String(noteOn), 'hex')
  port.write(b)
  udpPort.send({
        address: "/key/"+key,
        args: [
            {
                type: "i",
                value: key
            }
        ]
    }, "127.0.0.1", 9999)
})

