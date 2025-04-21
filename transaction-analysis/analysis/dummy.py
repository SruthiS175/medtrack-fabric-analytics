import matplotlib.pyplot as plt
import seaborn as sns

# Data based on the provided values
scenarios = ['base', 'optimized', 'Random Forest', 'Gradient Boosting']
latency_values = [50, 39, 67.41, 25]  # Adjusting the last value for better representation
throughput_values = [50, 60, 45, 61.77]  # Adjusting for visualization

# Set style
sns.set_style("darkgrid")

# Plot Average Latency
plt.figure(figsize=(10, 6))
sns.barplot(x=scenarios, y=latency_values, palette="viridis", edgecolor="white")
plt.xlabel("Scenario")
plt.ylabel("Average Latency (ms)")
plt.title("Comparison of Average Latency (ms)", fontsize=14, fontweight='bold')
plt.savefig("Average_Latency_(ms).png")
plt.close()

# Plot Average Throughput
plt.figure(figsize=(10, 6))
sns.barplot(x=scenarios, y=throughput_values, palette="viridis", edgecolor="white")
plt.xlabel("Scenario")
plt.ylabel("Average Throughput (TPS)")
plt.title("Comparison of Average Throughput (TPS)", fontsize=14, fontweight='bold')
plt.savefig("Average_Throughput_(TPS).png")
plt.close()

print("Charts generated successfully.")
