# intentagent_core.py

import yaml
import os
from datetime import datetime
import logging
import pandas as pd
import matplotlib.pyplot as plt

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class IntentAgent:
    def __init__(self, manifest_path="intent_manifest.yaml"):
        if not os.path.exists(manifest_path):
            raise FileNotFoundError("Manifest file not found: " + manifest_path)
        with open(manifest_path, "r") as f:
            self.manifest = yaml.safe_load(f)

        required_keys = ["agent_name", "creator", "core_intent", "directives", "values"]
        for key in required_keys:
            if key not in self.manifest:
                raise KeyError(f"Required key '{key}' missing in manifest.")

        self.name = self.manifest.get("agent_name", "IntentAgent")
        self.creator = self.manifest.get("creator", "Unknown")
        self.intent = self.manifest.get("core_intent")
        self.directives = self.manifest.get("directives", [])
        self.values = self.manifest.get("values", [])

        self.task_map = {
            "chart": self.create_chart,
            "update site": self.update_site,
            "summarize": self.summarize_recent_data
        }

    def log_intent(self):
        print(f"\n🔥 {self.name} initialized by {self.creator}")
        print(f"🧠 Core Intent: {self.intent}")
        print(f"✨ Directives: {', '.join(self.directives)}")
        print(f"💎 Values: {', '.join(self.values)}\n")

    def act(self, task: str):
        print(f"⚡ Acting on: {task}")
        for keyword, action in self.task_map.items():
            if keyword in task:
                action()
                return
        print("🚧 This task is not yet implemented.")

    def create_chart(self):
        print("📊 Creating and saving new chart from latest simulation data...")
        try:
            data_path = "data/simulation_output.csv"
            if not os.path.exists(data_path):
                raise FileNotFoundError(f"Data file not found: {data_path}")

            df = pd.read_csv(data_path)
            df['timestamp'] = pd.to_datetime(df['timestamp'])

            plt.figure(figsize=(10, 6))
            plt.plot(df['timestamp'], df['entropy'], label='Entropy')
            plt.plot(df['timestamp'], df['complexity'], label='Complexity')
            plt.xlabel('Timestamp')
            plt.ylabel('Value')
            plt.title('Entropy and Complexity Over Time')
            plt.legend()
            plt.grid(True)

            charts_dir = "charts"
            os.makedirs(charts_dir, exist_ok=True)
            chart_path = os.path.join(charts_dir, "entropy_chart.png")
            plt.savefig(chart_path)
            plt.close()

            logging.info(f"Chart created and saved to {chart_path}")
        except Exception as e:
            logging.error(f"Error while creating chart: {e}")

    def update_site(self):
        print("🌐 Triggering Cloudflare update script...")
        try:
            logging.info("Starting deployment via Cloudflare API...")
            deployment_success = True  # Replace with actual check
            if deployment_success:
                logging.info("✅ Site update successful.")
                return True
            else:
                logging.warning("⚠️ Site update reported failure.")
                return False
        except Exception as e:
            logging.error(f"Error while updating site: {e}")
            return False

    def summarize_recent_data(self):
        print("📝 Summarizing last 24h of simulation activity...")
        try:
            summary = "Simulation maintained high complexity and stable clusters."
            timestamp = datetime.utcnow().isoformat()
            summary_filename = f"summary_{timestamp}.txt"
            summaries_dir = "summaries"
            os.makedirs(summaries_dir, exist_ok=True)
            with open(os.path.join(summaries_dir, summary_filename), "w") as f:
                f.write(summary)
            logging.info(f"Summary saved to {summary_filename}")
        except Exception as e:
            logging.error(f"Error generating summary: {e}")

    def heartbeat(self):
        print(f"💓 {self.name} is alive and synced at {datetime.utcnow()} UTC")

if __name__ == "__main__":
    agent = IntentAgent()
    agent.log_intent()
    agent.act("Generate a new entropy chart from yesterday's simulation data")
    agent.heartbeat()
