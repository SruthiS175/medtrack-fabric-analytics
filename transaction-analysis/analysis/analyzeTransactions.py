import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# === Load JSON transaction data for ML Model 1 ===
file_path = "../data/ml_model_1_transactions.json"
with open(file_path, 'r') as f:
    data = json.load(f)

df = pd.DataFrame(data)

# === Convert necessary columns to numeric (strip units) ===
unit_columns = {
    'latency': 'ms',
    'blockCreationTime': 's',
    'throughput': 'TPS'
}

for column, unit in unit_columns.items():
    df[column] = df[column].str.replace(f' {unit}', '', regex=True).astype(float)

# === Compute average performance metrics ===
avg_latency = df['latency'].mean()
avg_throughput = df['throughput'].mean()
avg_block_creation = df['blockCreationTime'].mean()

# === Print summary in standard format ===
print("=== Predicted Averages - ML Model 1 (Random Forest) ===")
print(f"Latency               : {avg_latency:.2f} ms")
print(f"Throughput            : {avg_throughput:.2f} TPS")
print(f"Block Creation Time   : {avg_block_creation:.2f} s")

# === Visualization Setup ===
sns.set_theme(style="darkgrid")
plt.style.use("dark_background")

# Plot bar chart for metrics
metrics = ['Latency (ms)', 'Throughput (TPS)', 'Block Creation Time (s)']
averages = [avg_latency, avg_throughput, avg_block_creation]

plt.figure(figsize=(10, 6))
sns.barplot(x=metrics, y=averages, palette='viridis', edgecolor="black")
plt.title("Performance Metrics - ML Model 1 (Random Forest)", fontsize=16, fontweight='bold', color='white')
plt.xlabel("Metric", fontsize=13, color='white')
plt.ylabel("Value", fontsize=13, color='white')
plt.xticks(color='white')
plt.yticks(color='white')
plt.tight_layout()
plt.grid(visible=True, linestyle='--', linewidth=0.5, alpha=0.7)

# === Save the chart ===
output_path = "../visualizations/ml_model_1_performance.png"
plt.savefig(output_path, dpi=300, bbox_inches='tight')
plt.show()

print(f"Visualization saved to: {output_path}")
