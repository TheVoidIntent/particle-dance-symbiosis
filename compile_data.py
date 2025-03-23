
import os
import json
import argparse
from datetime import datetime

def compile_simulation_data(source_dir, output_dir):
    """
    Compiles simulation data from source directory to a structured JSON file
    in the output directory.
    
    Args:
        source_dir (str): Path to source directory containing simulation data files
        output_dir (str): Path to output directory where compiled data will be saved
    """
    if not os.path.exists(source_dir):
        print(f"Error: Source directory {source_dir} does not exist.")
        return
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Get all JSON files in the source directory
    json_files = [f for f in os.listdir(source_dir) if f.endswith('.json')]
    
    if not json_files:
        print(f"No JSON files found in {source_dir}")
        return
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Check if there's a simulation_config.json file
    config_file = os.path.join(source_dir, "simulation_config.json")
    config_data = {}
    
    if os.path.exists(config_file):
        with open(config_file, 'r') as f:
            try:
                config_data = json.load(f)
            except json.JSONDecodeError:
                print(f"Error parsing {config_file}")
    
    # Compile data from all JSON files
    simulation_data = {
        "config": config_data.get("config", {
            "max_particles": 150,
            "learning_rate": 0.2,
            "fluctuation_rate": 0.02,
            "name": "compiled_simulation"
        }),
        "data": [],
        "timestamp": timestamp
    }
    
    # Process each JSON file (assuming they contain timestep data)
    for file_name in sorted(json_files):
        if file_name == "simulation_config.json":
            continue
            
        file_path = os.path.join(source_dir, file_name)
        
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                if isinstance(data, dict):
                    simulation_data["data"].append(data)
                elif isinstance(data, list):
                    simulation_data["data"].extend(data)
        except (json.JSONDecodeError, Exception) as e:
            print(f"Error processing {file_name}: {str(e)}")
    
    # Save compiled data
    output_file = os.path.join(output_dir, f"simulation_compiled_{timestamp}.json")
    with open(output_file, 'w') as f:
        json.dump(simulation_data, f, indent=2)
    
    print(f"Compiled data saved to {output_file}")
    
    # Update summary file
    summary_file = os.path.join(output_dir, "summary.json")
    summary_data = {
        "timestamp": timestamp,
        "simulations": ["compiled_simulation"],
        "latest_run": timestamp
    }
    
    if os.path.exists(summary_file):
        try:
            with open(summary_file, 'r') as f:
                existing_summary = json.load(f)
                if "simulations" in existing_summary:
                    if "compiled_simulation" not in existing_summary["simulations"]:
                        existing_summary["simulations"].append("compiled_simulation")
                    summary_data["simulations"] = existing_summary["simulations"]
        except json.JSONDecodeError:
            pass
    
    with open(summary_file, 'w') as f:
        json.dump(summary_data, f, indent=2)
    
    print(f"Summary file updated at {summary_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Compile simulation data files into a single JSON file.')
    parser.add_argument('source_dir', help='Source directory containing simulation data files')
    parser.add_argument('--output_dir', default='./data', help='Output directory for compiled data (default: ./data)')
    
    args = parser.parse_args()
    compile_simulation_data(args.source_dir, args.output_dir)
