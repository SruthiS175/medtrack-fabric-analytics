import { Gateway, Wallets } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

async function main() {
  try {
    const ccpPath = path.resolve(__dirname, '..', 'connection-profiles', 'connection-retailer.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get('admin');
    if (!identity) {
      console.log('❌ Admin identity not found in wallet.');
      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: 'admin',
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('plnchannel');
    const contract = network.getContract('assettransfer');

    const scenarios = [
      {
        scenario: 'base',
        description: 'Base scenario with no optimizations or ML models applied.'
      },
      {
        scenario: 'optimized',
        description: 'Optimized scenario with tuned Fabric parameters (e.g., endorsement, batching).'
      },
      {
        scenario: 'ml_model_1',
        description: 'ML Model 1: Random Forest predictions for latency and block creation.'
      },
      {
        scenario: 'ml_model_2',
        description: 'ML Model 2: Gradient Boosting predictions for enhanced throughput.'
      }
    ];

    for (let i = 0; i < scenarios.length; i++) {
      const txId = `txMetric${Date.now()}_${i}`;
      const now = new Date().toISOString();
      const blockNumber = Math.floor(Math.random() * 500);
      const sender = `Org${Math.floor(Math.random() * 6) + 1}`;
      const receiver = `Org${Math.floor(Math.random() * 6) + 1}`;
      const amount = Math.floor(Math.random() * 1000);

      const latency = `${(Math.random() * 100).toFixed(2)} ms`;
      const throughput = Math.floor(Math.random() * 150);
      const blockCreationTime = `${(Math.random() * 8 + 1).toFixed(2)} s`;
      const transactionSuccessRate = (Math.random() * 100).toFixed(2);
      const cpuUsage = (Math.random() * 100).toFixed(2);
      const memoryUsage = (Math.random() * 100).toFixed(2);
      const networkLatency = `${(Math.random() * 50).toFixed(2)} ms`;
      const consensusTime = `${(Math.random() * 5).toFixed(2)} s`;

      await contract.submitTransaction(
        'CreateTransactionMetrics',
        txId,
        now,
        blockNumber.toString(),
        sender,
        receiver,
        amount.toString(),
        latency,
        throughput.toString(),
        blockCreationTime,
        transactionSuccessRate,
        cpuUsage,
        memoryUsage,
        networkLatency,
        consensusTime,
        scenarios[i].scenario,
        scenarios[i].description
      );

      console.log(`✅ Submitted transaction ${txId} for scenario: ${scenarios[i].scenario}`);
    }

    await gateway.disconnect();

  } catch (error) {
    console.error(`❌ Failed to submit transaction: ${error}`);
  }
}

main();
