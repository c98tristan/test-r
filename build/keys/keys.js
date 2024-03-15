"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keys = void 0;
const shamirs_secret_sharing_ts_1 = require("shamirs-secret-sharing-ts");
class Keys {
    constructor(seedPhase) {
        this.seedPhase = seedPhase;
    }
    generateKeys(shares, threshold) {
        try {
            const shareKeys = (0, shamirs_secret_sharing_ts_1.split)(this.seedPhase, { shares, threshold });
            return shareKeys;
        }
        catch (error) {
            throw error;
        }
    }
    recoverKeys(shareKeys) {
        try {
            const seedPhase = (0, shamirs_secret_sharing_ts_1.combine)(shareKeys);
            return seedPhase.toString('utf-8');
        }
        catch (error) {
            throw error;
        }
    }
}
exports.Keys = Keys;
