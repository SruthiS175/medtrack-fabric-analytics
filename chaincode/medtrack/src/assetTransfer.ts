import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { TransactionMetrics } from './transactionMetrics';

@Info({ title: 'AssetTransfer', description: 'Smart contract for transferring assets and recording transaction metrics' })
export class AssetTransfer extends Contract {

  // ---------------------
  // ASSET MANAGEMENT API
  // ---------------------

  @Transaction()
  async InitLedger(ctx: Context): Promise<void> {
    const assets = [
      { ID: 'drug1', name: 'Paracetamol', owner: 'Manufacturer', status: 'MANUFACTURED' }
    ];

    for (const asset of assets) {
      await ctx.stub.putState(asset.ID, Buffer.from(JSON.stringify(asset)));
    }
  }

  @Transaction()
  async CreateAsset(ctx: Context, id: string, name: string, owner: string, status: string): Promise<string> {
    const exists = await this.AssetExists(ctx, id);
    if (exists) {
      throw new Error(`Asset ${id} already exists`);
    }

    const asset = { ID: id, name, owner, status };
    await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    return JSON.stringify(asset);
  }

  @Transaction(false)
  @Returns('string')
  async ReadAsset(ctx: Context, id: string): Promise<string> {
    const assetJSON = await ctx.stub.getState(id);
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`Asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  @Transaction()
  async TransferAsset(ctx: Context, id: string, newOwner: string): Promise<string> {
    const assetJSON = await this.ReadAsset(ctx, id);
    const asset = JSON.parse(assetJSON);
    asset.owner = newOwner;

    await ctx.stub.putState(id, Buffer.from(JSON.stringify(asset)));
    return JSON.stringify(asset);
  }

  @Transaction(false)
  @Returns('string')
  async GetAssetHistory(ctx: Context, id: string): Promise<string> {
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
      if (res.done) {
        await iterator.close();
        break;
      }
    }

    return JSON.stringify(history);
  }

  @Transaction(false)
  async AssetExists(ctx: Context, id: string): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(id);
    return !!(assetJSON && assetJSON.length > 0);
  }

  // -----------------------------
  // TRANSACTION METRICS TRACKING
  // -----------------------------

  @Transaction()
  async CreateTransactionMetrics(
    ctx: Context,
    transactionID: string,
    timestamp: string,
    blockNumber: number,
    sender: string,
    receiver: string,
    amount: number,
    latency: string,
    throughput: number,
    blockCreationTime: string,
    transactionSuccessRate: string,
    cpuUsage: string,
    memoryUsage: string,
    networkLatency: string,
    consensusTime: string,
    scenario: string,
    description: string
  ): Promise<void> {
    const txMetric: TransactionMetrics = {
      transactionID,
      timestamp,
      blockNumber,
      sender,
      receiver,
      amount,
      latency,
      throughput,
      blockCreationTime,
      transactionSuccessRate,
      cpuUsage,
      memoryUsage,
      networkLatency,
      consensusTime,
      scenario,
      description
    };

    await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(txMetric)));
  }

  @Transaction(false)
  @Returns('string')
  async GetTransactionMetricsByTxId(ctx: Context, txId: string): Promise<string> {
    const data = await ctx.stub.getState(txId);
    if (!data || data.length === 0) {
      throw new Error(`Transaction metrics for ${txId} do not exist.`);
    }
    return data.toString();
  }

  @Transaction(false)
  @Returns('string')
  async GetAllTransactionMetrics(ctx: Context): Promise<string> {
    const iterator = await ctx.stub.getStateByRange('', '');
    const allResults = [];

    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        const record = JSON.parse(res.value.value.toString('utf8'));
        allResults.push(record);
      }
      if (res.done) {
        await iterator.close();
        break;
      }
    }

    return JSON.stringify(allResults);
  }
}