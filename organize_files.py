
import os
import shutil
import json
from datetime import datetime
from fpdf import FPDF

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

                    # Copy file to the organized directory
                    shutil.copy(src_path, dest_path)
                    print(f'Copied {file_name} to {date_dir}')
                    
                    # Generate PDF for the JSON file
                    generate_pdf_from_json(src_path, os.path.join(date_dir, f"{os.path.splitext(file_name)[0]}.pdf"))
                    
                except ValueError as e:
                    print(f'Error parsing date for file {file_name}: {e}')
            else:
                print(f'File name does not match expected pattern: {file_name}')
        else:
            print(f'Skipping non-JSON file: {file_name}')

def generate_pdf_from_json(json_file_path, pdf_file_path):
    """Generate a PDF report from a JSON simulation file"""
    try:
        # Load JSON data
        with open(json_file_path, 'r') as f:
            data = json.load(f)
        
        # Create PDF
        pdf = FPDF()
        pdf.add_page()
        
        # Title
        pdf.set_font('Arial', 'B', 16)
        title = f"IntentSim Simulation Report - {os.path.basename(json_file_path)}"
        pdf.cell(0, 10, title, 0, 1, 'C')
        pdf.ln(5)
        
        # Configuration Section
        if 'config' in data:
            pdf.set_font('Arial', 'B', 14)
            pdf.cell(0, 10, 'Simulation Configuration', 0, 1)
            pdf.set_font('Arial', '', 10)
            
            config = data['config']
            for key, value in config.items():
                pdf.cell(0, 8, f"{key}: {value}", 0, 1)
            
            pdf.ln(5)
        
        # Data Summary Section
        if 'data' in data and isinstance(data['data'], list):
            simulation_data = data['data']
            pdf.set_font('Arial', 'B', 14)
            pdf.cell(0, 10, 'Simulation Data Summary', 0, 1)
            pdf.set_font('Arial', '', 10)
            
            pdf.cell(0, 8, f"Total data points: {len(simulation_data)}", 0, 1)
            
            # Calculate some basic statistics
            if simulation_data and 'total_particles' in simulation_data[0]:
                particle_counts = [point.get('total_particles', 0) for point in simulation_data]
                avg_particles = sum(particle_counts) / len(particle_counts) if particle_counts else 0
                max_particles = max(particle_counts) if particle_counts else 0
                
                pdf.cell(0, 8, f"Average particle count: {avg_particles:.2f}", 0, 1)
                pdf.cell(0, 8, f"Maximum particle count: {max_particles}", 0, 1)
            
            if simulation_data and 'system_entropy' in simulation_data[0]:
                entropy_values = [point.get('system_entropy', 0) for point in simulation_data]
                avg_entropy = sum(entropy_values) / len(entropy_values) if entropy_values else 0
                
                pdf.cell(0, 8, f"Average system entropy: {avg_entropy:.4f}", 0, 1)
            
            pdf.ln(5)
        
        # Save the PDF
        pdf.output(pdf_file_path)
        print(f"Generated PDF report: {pdf_file_path}")
        
    except Exception as e:
        print(f"Error generating PDF from {json_file_path}: {e}")

if __name__ == "__main__":
    directories = [
        'data/simulation_baseline',
        'data/simulation_adaptive_probabilistic',
        'data/simulation_energy_conservation',
        'data/simulation_full_features'
    ]
    
    # Create directories if they don't exist
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
        organize_files(directory)
    
    # Also organize the root data directory
    organize_files('data')

