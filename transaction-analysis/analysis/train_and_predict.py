import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
import joblib
import os
import json
import subprocess

# Paths
BASE_PATH = '../data'
MODEL_PATH = '../models'
CHAINCODE_NAME = 'pharma-supply-chain'
CHANNEL_NAME = 'plnchannel'

# Step 1: Train and Save Models
def train_and_save_models():
    data = pd.read_json(f'{BASE_PATH}/base_transactions.json')

    data['latency'] = data['latency'].str.replace(' ms', '').astype(float)
    data['throughput'] = data['throughput'].astype(int)

    X = data[['amount', 'cpuUsage', 'memoryUsage']]
    y_latency = data['latency']
    y_throughput = data['throughput']

    rf_latency = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_latency.fit(X, y_latency)

    gb_throughput = GradientBoostingRegressor(n_estimators=100, random_state=42)
    gb_throughput.fit(X, y_throughput)

    os.makedirs(MODEL_PATH, exist_ok=True)
    joblib.dump(rf_latency, f'{MODEL_PATH}/random_forest_model.pkl')
    joblib.dump(gb_throughput, f'{MODEL_PATH}/gradient_boosting_model.pkl')
    print("✅ Models trained and saved.")

# Step 2: Predict and send to chaincode
def simulate_chaincode_invocation(pred_latency, pred_throughput, index):
    tx_payload = {
        "transactionID": f"ml_tx_{index}",
        "timestamp": pd.Timestamp.now().isoformat(),
        "blockNumber": 0,
        "sender": "Org1",
        "receiver": "Org2",
        "amount": 500,
        "latency": f"{pred_latency:.2f} ms",
        "throughput": int(pred_throughput),
        "blockCreationTime": f"{(pred_latency / 10):.2f} s",
        "transactionSuccessRate": "99.00",
        "cpuUsage": "50.00",
        "memoryUsage": "40.00",
        "networkLatency": "15.00 ms",
        "consensusTime": "1.20 s",
        "scenario": "ml_model_1",
        "description": "ML Model 1 predictions using Random Forest for latency and GB for throughput."
    }

    args = json.dumps(list(tx_payload.values()))
    
    print(f"🔁 Invoking chaincode with transactionID {tx_payload['transactionID']}")

    # Simulating a peer chaincode invoke using CLI call
    subprocess.run([
        "peer", "chaincode", "invoke",
        "-o", "localhost:7050",
        "--ordererTLSHostnameOverride", "orderer1.orderer.medtrack.com",
        "--tls", "--cafile", "/path/to/orderer/ca.crt",
        "-C", CHANNEL_NAME,
        "-n", CHAINCODE_NAME,
        "--peerAddresses", "localhost:8051",
        "--tlsRootCertFiles", "/path/to/peer/tls/ca.crt",
        "-c", f'{{"function":"CreateTransactionMetrics","Args":{args}}}'
    ])

# Step 3: Load model and generate 100 transactions
def predict_and_send():
    rf_latency = joblib.load(f'{MODEL_PATH}/random_forest_model.pkl')
    gb_throughput = joblib.load(f'{MODEL_PATH}/gradient_boosting_model.pkl')

    for i in range(100):
        test_tx = {
            "amount": int(300 + i),
            "cpuUsage": round(50 + (i % 10), 2),
            "memoryUsage": round(40 + (i % 5), 2)
        }

        df = pd.DataFrame([test_tx])
        pred_latency = rf_latency.predict(df)[0]
        pred_throughput = gb_throughput.predict(df)[0]

        simulate_chaincode_invocation(pred_latency, pred_throughput, i)

# Main
if __name__ == "__main__":
    train_and_save_models()
    predict_and_send()
