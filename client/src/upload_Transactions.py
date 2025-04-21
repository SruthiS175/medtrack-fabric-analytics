import json
from hfc.fabric import Client
import asyncio
import os

# Define constants
CHANNEL_NAME = 'plnchannel'
CHAINCODE_NAME = 'assettransfer'
ORG_NAME = 'RetailerMSP'
USER_NAME = 'Admin'
SCENARIOS = ['base', 'optimized', 'ml_model_1', 'ml_model_2']

# Load the Fabric network
cli = Client(net_profile="../network/docker/connection-profile.yaml")

# Get the user from Retailer org
admin = cli.get_user(org_name='retailer.medtrack.com', name='Admin')

async def upload_metrics_for_scenario(scenario):
    print(f"\n🔄 Uploading transactions for scenario: {scenario}")
    
    # Load JSON file
    with open(f'../data/{scenario}_transactions.json') as f:
        transactions = json.load(f)

    for tx in transactions:
        try:
            await cli.chaincode_invoke(
                requestor=admin,
                channel_name=CHANNEL_NAME,
                peer_names=['peer0.retailer.medtrack.com'],
                args=[
                    tx['transactionID'],
                    tx['timestamp'],
                    str(tx['blockNumber']),
                    tx['sender'],
                    tx['receiver'],
                    str(tx['amount']),
                    tx['latency'],
                    str(tx['throughput']),
                    tx['blockCreationTime'],
                    tx['transactionSuccessRate'],
                    tx['cpuUsage'],
                    tx['memoryUsage'],
                    tx['networkLatency'],
                    tx['consensusTime'],
                    scenario,
                    tx['description']
                ],
                cc_name=CHAINCODE_NAME,
                fcn='CreateTransactionMetrics',
                wait_for_event=True
            )
        except Exception as e:
            print(f"❌ Failed to upload transaction {tx['transactionID']}: {str(e)}")

async def main():
    for scenario in SCENARIOS:
        await upload_metrics_for_scenario(scenario)

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
