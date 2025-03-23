
# Universe Intent Simulation Explorer

A theoretical laboratory for exploring universe creation through intent field fluctuations.

## Running the Application

### Frontend (Web Interface)

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

### Data Compilation

The Python script `compile_data.py` helps compile simulation data files for visualization:

```bash
# Basic usage
python compile_data.py /path/to/source/data

# With custom output directory
python compile_data.py /path/to/source/data --output_dir ./custom_output_directory
```

Example:
```bash
# Compile data from your Documents folder
python compile_data.py ~/Documents/simulation_data --output_dir ./data
```

## Data Visualization

1. Run the data compilation script to prepare your simulation data
2. Start the web application
3. Navigate to the "Upload Data" tab
4. Upload your compiled JSON file
5. View the visualizations

## Data Format

The application expects simulation data in the following JSON format:

```json
{
  "config": {
    "max_particles": 150,
    "learning_rate": 0.2,
    "fluctuation_rate": 0.02,
    "name": "simulation_name"
  },
  "data": [
    {
      "timestamp": 1,
      "particle_counts": {
        "positive": 42,
        "negative": 36,
        "neutral": 22,
        "composite": 5
      },
      "total_particles": 105,
      "total_interactions": 324,
      "avg_knowledge": 0.42,
      "avg_complexity": 1.3,
      "max_complexity": 2.8,
      "complexity_index": 0.65
    }
    // Additional timestep entries...
  ],
  "timestamp": "20250323_205710"
}
```
