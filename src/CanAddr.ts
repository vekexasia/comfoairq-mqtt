export type CanAddrInfo = { srcAddr: number, dstAddr: number, unknownCounter: number, multimsg:boolean, errorOccurred: boolean, isRequest: boolean, seqnr: number};
export class CanAddr {
    constructor(private conf: CanAddrInfo) {

    }

    canID(): number {
        let addr = 0;
        addr |= this.conf.srcAddr << 0;
        addr |= this.conf.dstAddr << 6;
        addr |= this.conf.unknownCounter << 12;
        addr |= (this.conf.multimsg ? 1: 0) << 14;
        addr |= (this.conf.errorOccurred ? 1: 0) << 15;
        addr |= (this.conf.isRequest ? 1 : 0) << 16;
        addr |= this.conf.seqnr << 17;
        addr |= 0x1f << 24;
        return addr;
    }

    static decompose(n: number) {
        if ((n >> 24 ) != 0x1f) {
            return null;
        }
        return new CanAddr({
            srcAddr: (n) & 0x3f,
            dstAddr: (n>>6) & 0x3f,
            unknownCounter: (n>>12) & 0x03,
            multimsg: ((n>>14) & 0x01) === 1,
            errorOccurred: ((n>>15) & 0x01) === 1,
            isRequest: ((n>>16) & 0x01) === 1,
            seqnr: (n>>17) & 0x03
        })
    }

    canIDBuffer() {
        const toRet = Buffer.alloc(4);
        toRet.writeInt32BE(this.canID());
        return toRet;
    }
}
