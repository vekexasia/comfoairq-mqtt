"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanMessage = void 0;
const CanAddr_1 = require("./CanAddr");
class CanMessage {
    constructor() {
        this.sequence = -1;
    }
    compose(canID, data) {
        return `T${canID.toString('hex')}${data.length}${data.toString('hex')}`.toUpperCase();
    }
    initMessage() {
        return Buffer.from([
            0xaa,
            0x55,
            0x12,
            // Pack byte indicating CAN bus speed
            0x09,
            // Pack frame type byte
            // use extended
            0x02,
            // Filter not supported
            0x00,
            0x00,
            0x00,
            0x00,
            // Mask not supported
            0x00,
            0x00,
            0x00,
            0x00,
            // Hardcode mode to Normal? Set to 0x01 to get loopback mode
            0x00,
            // Send magic byte (may have to be 0x01?)
            0x01,
            //Send more magic bytes
            0x00,
            0x00,
            0x00,
            0x00,
        ]);
    }
    compute(where, what) {
        what = Buffer.from(what);
        this.sequence++;
        this.sequence &= 0x3;
        if (what.length > 8) {
            const addr = new CanAddr_1.CanAddr(Object.assign(Object.assign({}, where), { seqnr: this.sequence, multimsg: true }));
            const canID = addr.canIDBuffer();
            let dataGrams = Math.floor(what.length / 7);
            if (dataGrams * 7 === what.length) {
                dataGrams--;
            }
            const toRet = [];
            for (let i = 0; i < dataGrams; i++) {
                toRet.push(this.compose(canID, Buffer.concat([
                    Buffer.from([i]),
                    what.slice(i * 7, (i + 1) * 7),
                ])));
            }
            // send last packet.
            toRet.push(this.compose(canID, Buffer.concat([
                Buffer.from([dataGrams | 0x80]),
                what.slice(dataGrams * 7)
            ])));
            return toRet;
        }
        else {
            const addr = new CanAddr_1.CanAddr(Object.assign(Object.assign({}, where), { seqnr: this.sequence, multimsg: false }));
            return [this.compose(addr.canIDBuffer(), what)];
        }
    }
}
exports.CanMessage = CanMessage;
