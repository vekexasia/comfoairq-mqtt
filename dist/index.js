"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SerialPort = require("serialport");
const Delimiter = require("@serialport/parser-delimiter");
const mqtt = require("mqtt");
const mapping2_1 = require("./mapping2");
const CanMessage_1 = require("./CanMessage");
const dotEnv = require("dotenv");
dotEnv.config();
const mqttClient = mqtt.connect(process.env.MQTT_HOST, {
    password: process.env.MQTT_PASS,
    username: process.env.MQTT_USER
});
const port = new SerialPort(process.env.SERIAL_INTERFACE, { autoOpen: false, baudRate: 115200 });
// Open errors will be emitted as an error event
port.on('error', function (err) {
    console.log('Error: ', err.message);
});
const parser = port.pipe(new Delimiter({ delimiter: '\r' }));
const canMessage = new CanMessage_1.CanMessage();
parser.on('data', (line) => {
    const strLine = `${line}`.trim().split('\x07').join('');
    const type = strLine[0].toLowerCase();
    if (type === 'z') {
        console.log('received reply');
        return;
    }
    if (type !== 't' && type !== 'r') {
        console.log('unknown message', strLine);
        return;
    }
    const pdID = (parseInt(strLine.substring(1, 9), 16) & 0x00fff000) >> 14;
    // console.log(strLine.substring(1,9));
    if (mapping2_1.mapping2[pdID]) {
        const length = parseInt(strLine.substring(9, 10));
        const data = [];
        let index = 10;
        for (let i = 0; i < length; i++) {
            data.push(parseInt(strLine.substring(index, index + 2), 16));
            index += 2;
        }
        const val = mapping2_1.mapping2[pdID].transform(...data);
        const name = mapping2_1.mapping2[pdID].name;
        mqttClient.publish(`${process.env.MQTT_PREFIX}/${name}`, `${val}`);
    }
});
port.open(function (err) {
    if (err) {
        return console.log('Error opening port: ', err.message);
    }
    console.log('Serial Port open!');
    // port.write(canMessage.initMessage(), (err) => console.log('initError?', err));
    // Because there's no callback to write, write errors will be emitted on the port:
    // port.write('S2\r', (err) => console.log('w', err));
    // port.write('O\r', (err) => console.log('ww', err));
});
mqttClient.on('message', (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    let topicName = topic.split('/').reverse()[0];
    if (topicName === 'ventilation_level') {
        topicName = `ventilation_level_${parseInt(message.toString('utf8'))}`;
    }
    else if (topicName === 'set_mode') {
        const which = message.toString('utf8');
        if (which === 'auto') {
            topicName = 'auto';
        }
        else {
            topicName = 'manual';
        }
    }
    const data = {
        "srcAddr": 0x11,
        "dstAddr": 1,
        "unknownCounter": 0,
        "errorOccurred": false,
        "isRequest": true
    };
    if (!mapping2_1.commands[topicName]) {
        console.log('no matching topic name');
        return;
    }
    for (let i = 0; i < 2; i++) {
        const messagesToSend = canMessage.compute(data, mapping2_1.commands[topicName]);
        messagesToSend.forEach((m) => console.log(m));
        for (const message of messagesToSend) {
            yield new Promise((r) => port.write(`${message}\r`, 'ascii', (e) => {
                if (e)
                    console.log(e);
                r();
            }));
        }
        yield new Promise((r) => setTimeout(r, 1000));
    }
}));
for (const key in mapping2_1.commands) {
    mqttClient.subscribe(`${process.env.MQTT_PREFIX}/commands/${key}`);
}
mqttClient.subscribe(`${process.env.MQTT_PREFIX}/commands/ventilation_level`);
mqttClient.subscribe(`${process.env.MQTT_PREFIX}/commands/set_mode`);
