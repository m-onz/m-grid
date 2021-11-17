// POC

var osc = require('osc')
var SerialPort = require('serialport')

var remote_OSC_port = 8888;

var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 9600,
    metadata: true
})

udpPort.open()

// todo: check for 40h string in serial device name
// /dev/ttyUSB0
var port = new SerialPort('/dev/ttyACM0', {
  baudRate: 9600
})

// drop root privs after running
setTimeout(function () {
  process.setuid('monz')
}, 1000)

var noteOn = false;

port.on('data', function (data) {
  var d = data.toString()
  if (d === 'B') console.log('bang')
    else if (!isNaN(parseInt(d))) console.log(parseInt(d))
})

