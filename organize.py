import os
import shutil
from datetime import datetime

def organize_files(data_dir):
    for file_name in os.listdir(data_dir):
        if file_name.endswith(".json"):
            parts = file_name.split('_')
            if len(parts) >= 4:
                sim_type = '_'.join(parts[1:-2])
                date_str = parts[-2]
                time_str = parts[-1].split('.')[0]

                try:
                    date = datetime.strptime(date_str, '%Y%m%d')
                    date_dir = os.path.join(data_dir, sim_type, date_str)

                    if not os.path.exists(date_dir):
                        os.makedirs(date_dir)

                    src_path = os.path.join(data_dir, file_name)
                    dest_path = os.path.join(date_dir, file_name)

                    shutil.move(src_path, dest_path)
                    print(f'Moved {file_name} to {date_dir}')
                except ValueError as e:
                    print(f'Error parsing date for file {file_name}: {e}')
            else:
                print(f'File name does not match expected pattern: {file_name}')
        else:
            print(f'Skipping non-JSON file: {file_name}')

if __name__ == "__main__":
    directories = [
        'data/simulation_baseline',
        'data/simulation_adaptive_probabilistic',
        'data/simulation_energy_conservation',
        'data/simulation_full_features'
    ]
    for directory in directories:
        organize_files(directory)
