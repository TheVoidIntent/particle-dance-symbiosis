
#!/usr/bin/env python3
"""
Universe Simulation Data Collection Script
This script runs simulations of the universe model and saves data for analysis.
"""

import os
import json
import random
import math
import time
from datetime import datetime

# Ensure data directory exists
DATA_DIR = "data"
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def simulate_intent_field(size=10, fluctuation_rate=0.01):
    """Simulates an intent field with random fluctuations"""
    field = [[[random.random() * 2 - 1 for _ in range(size)] 
              for _ in range(size)] 
             for _ in range(size)]
    
    # Apply fluctuations
    for z in range(size):
        for y in range(size):
            for x in range(size):
                fluctuation = (random.random() * 2 - 1) * fluctuation_rate
                field[z][y][x] += fluctuation
                field[z][y][x] = max(-1, min(1, field[z][y][x]))
    
    return field

def create_particle_from_field(field_value, id):
    """Creates a particle based on field value"""
    charge = "positive" if field_value > 0.3 else "negative" if field_value < -0.3 else "neutral"
    
    # Determine particle type based on field value
    type_value = abs(field_value)
    if type_value > 0.7:
        particle_type = "high-energy"
    elif type_value > 0.4:
        particle_type = "quantum"
    else:
        particle_type = "standard"
        
    knowledge = random.random() * 0.3  # Initial knowledge
    
    return {
        "id": id,
        "charge": charge,
        "type": particle_type,
        "knowledge": knowledge,
        "complexity": 1.0,
        "energy": abs(field_value) * 2,
        "interactions": 0
    }

def simulate_interaction(particle1, particle2, learning_rate=0.1):
    """Simulates interaction between two particles"""
    # Determine if particles interact based on charge
    interaction_chance = 0.7
    if particle1["charge"] == "positive" and particle2["charge"] == "positive":
        interaction_chance = 0.8
    elif particle1["charge"] == "negative" and particle2["charge"] == "negative":
        interaction_chance = 0.3
    elif particle1["charge"] == "neutral":
        interaction_chance = 0.5
    
    # Check if interaction occurs
    if random.random() > interaction_chance:
        return particle1, particle2, False
    
    # Knowledge exchange
    knowledge_transfer = min(particle1["knowledge"], particle2["knowledge"]) * learning_rate
    particle1["knowledge"] += knowledge_transfer
    particle2["knowledge"] += knowledge_transfer
    
    # Increment interaction count
    particle1["interactions"] += 1
    particle2["interactions"] += 1
    
    # Possibly create composite particle
    if (particle1["knowledge"] > 0.6 and particle2["knowledge"] > 0.6 and
        particle1["energy"] + particle2["energy"] > 2.5 and
        random.random() < 0.6):
        
        # Create composite particle (only one - the other will be removed)
        particle1["type"] = "composite"
        particle1["complexity"] = particle1["complexity"] + particle2["complexity"] * 0.7
        particle1["energy"] = particle1["energy"] + particle2["energy"] * 0.5
        particle1["knowledge"] = max(particle1["knowledge"], particle2["knowledge"]) * 1.2
        
        # Mark second particle for removal
        particle2["remove"] = True
    
    return particle1, particle2, True

def run_simulation(max_particles=100, iterations=1000, learning_rate=0.1, fluctuation_rate=0.01):
    """Runs a full simulation"""
    # Initialize simulation
    intent_field = simulate_intent_field(fluctuation_rate=fluctuation_rate)
    particles = []
    total_interactions = 0
    simulation_time = 0
    
    # Create initial particles
    for i in range(max_particles // 2):
        field_value = intent_field[random.randint(0, 9)][random.randint(0, 9)][random.randint(0, 9)]
        particles.append(create_particle_from_field(field_value, i))
    
    # Data collection
    time_series_data = []
    
    # Run simulation iterations
    for iteration in range(iterations):
        simulation_time += 1
        
        # Create new particles if needed
        if len(particles) < max_particles:
            field_value = intent_field[random.randint(0, 9)][random.randint(0, 9)][random.randint(0, 9)]
            particles.append(create_particle_from_field(field_value, len(particles)))
        
        # Update intent field occasionally
        if iteration % 50 == 0:
            intent_field = simulate_intent_field(fluctuation_rate=fluctuation_rate)
        
        # Process particle interactions
        particles_to_remove = []
        for i in range(len(particles)):
            for j in range(i + 1, len(particles)):
                particles[i], particles[j], interaction_occurred = simulate_interaction(
                    particles[i], particles[j], learning_rate
                )
                
                if interaction_occurred:
                    total_interactions += 1
                
                # Mark particles for removal if needed
                if "remove" in particles[j]:
                    particles_to_remove.append(j)
        
        # Remove marked particles
        particles = [p for i, p in enumerate(particles) if i not in particles_to_remove and "remove" not in p]
        
        # Collect data every few iterations
        if iteration % 50 == 0:
            # Calculate statistics
            particle_counts = {
                "positive": sum(1 for p in particles if p["charge"] == "positive"),
                "negative": sum(1 for p in particles if p["charge"] == "negative"),
                "neutral": sum(1 for p in particles if p["charge"] == "neutral"),
                "high_energy": sum(1 for p in particles if p["type"] == "high-energy"),
                "quantum": sum(1 for p in particles if p["type"] == "quantum"),
                "standard": sum(1 for p in particles if p["type"] == "standard"),
                "composite": sum(1 for p in particles if p["type"] == "composite")
            }
            
            avg_knowledge = sum(p["knowledge"] for p in particles) / max(1, len(particles))
            avg_complexity = sum(p["complexity"] for p in particles) / max(1, len(particles))
            max_complexity = max([p["complexity"] for p in particles]) if particles else 1
            
            # Complexity index calculation
            variety_factor = (
                particle_counts["positive"] * 
                particle_counts["negative"] * 
                particle_counts["neutral"] * 
                (particle_counts["high_energy"] + 1) * 
                (particle_counts["quantum"] + 1) * 
                (particle_counts["composite"] + 1)
            ) / max(1, len(particles) ** 2)
            
            complexity_index = (avg_knowledge * variety_factor) + (total_interactions / 1000) + (particle_counts["composite"] * max_complexity)
            
            # Add data point
            data_point = {
                "timestamp": simulation_time,
                "particle_counts": particle_counts,
                "total_particles": len(particles),
                "total_interactions": total_interactions,
                "avg_knowledge": avg_knowledge,
                "avg_complexity": avg_complexity,
                "max_complexity": max_complexity,
                "complexity_index": complexity_index
            }
            
            time_series_data.append(data_point)
    
    return time_series_data

def main():
    """Main function to run simulation and save data"""
    print("Starting universe simulation data collection...")
    
    # Run multiple simulations with different parameters
    simulation_configs = [
        {"max_particles": 100, "learning_rate": 0.1, "fluctuation_rate": 0.01, "name": "baseline"},
        {"max_particles": 150, "learning_rate": 0.2, "fluctuation_rate": 0.02, "name": "high_learning"},
        {"max_particles": 80, "learning_rate": 0.05, "fluctuation_rate": 0.03, "name": "high_fluctuation"}
    ]
    
    # Create unique timestamp for this run
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    for config in simulation_configs:
        print(f"Running simulation: {config['name']}...")
        simulation_data = run_simulation(
            max_particles=config["max_particles"],
            iterations=1000,
            learning_rate=config["learning_rate"],
            fluctuation_rate=config["fluctuation_rate"]
        )
        
        # Save data to file
        filename = f"{DATA_DIR}/simulation_{config['name']}_{timestamp}.json"
        with open(filename, "w") as f:
            json.dump({
                "config": config,
                "data": simulation_data,
                "timestamp": timestamp
            }, f, indent=2)
        
        print(f"Saved simulation data to {filename}")
    
    # Create a summary file
    summary_data = {
        "timestamp": timestamp,
        "simulations": [c["name"] for c in simulation_configs],
        "latest_run": timestamp
    }
    
    with open(f"{DATA_DIR}/summary.json", "w") as f:
        json.dump(summary_data, f, indent=2)
    
    print("Data collection complete!")

if __name__ == "__main__":
    main()
