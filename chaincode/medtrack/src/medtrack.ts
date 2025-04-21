import { Context, Contract } from 'fabric-contract-api';
import { TransactionMetrics } from './transactionMetrics';

export class MedTrackContract extends Contract {

  async CreateTransactionMetrics(ctx: Context, txId: string, data: string): Promise<void> {
    const metrics: TransactionMetrics = JSON.parse(data);
    await ctx.stub.putState(txId, Buffer.from(JSON.stringify(metrics)));
  }

  async GetAllTransactionMetrics(ctx: Context): Promise<string> {
    const iterator = await ctx.stub.getStateByRange('', '');
    const allResults = [];
    for await (const res of iterator) {
      allResults.push(JSON.parse(res.value.toString()));
    }
    return JSON.stringify(allResults);
  }

  async GetTransactionMetricsByTxId(ctx: Context, txId: string): Promise<string> {
    const data = await ctx.stub.getState(txId);
    if (!data || data.length === 0) {
      throw new Error(`No transaction metrics with id ${txId}`);
    }
    return data.toString();
  }
}
