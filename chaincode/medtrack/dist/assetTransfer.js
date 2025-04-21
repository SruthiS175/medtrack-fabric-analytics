"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetTransfer = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
class AssetTransfer extends fabric_contract_api_1.Contract {
    async InitLedger(ctx) {
        const assets = [
            { ID: 'drug1', name: 'Paracetamol', owner: 'Manufacturer', status: 'MANUFACTURED' }
        ];
        for (const asset of assets) {
            await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
        }
    }
    async CreateAsset(ctx, id, name, owner, status) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`Asset ${id} already exists`);
        }
        const asset = {
            ID: id,
            name,
            owner,
            status
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`Asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }
    async TransferAsset(ctx, id, newOwner) {
        const assetJSON = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetJSON);
        asset.owner = newOwner;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
        return JSON.stringify(asset);
    }
    async GetAssetHistory(ctx, id) {
        const iterator = await ctx.stub.getHistoryForKey(id);
        const history = [];
        while (true) {
            const res = await iterator.next();
            if (res.value) {
                const tx = {
                    txId: res.value.txId,
                    timestamp: res.value.timestamp,
                    isDelete: res.value.isDelete,
                    value: Buffer.isBuffer(res.value.value) ? res.value.value.toString('utf8') : '',
                };
                history.push(tx);
            }
            if (res.done)
                break;
        }
        return JSON.stringify(history);
    }
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return !!(assetJSON && assetJSON.length > 0);
    }
}
exports.AssetTransfer = AssetTransfer;
