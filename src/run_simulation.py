
#!/usr/bin/env python3
"""
Enhanced Universe Simulation Data Collection Script
This script runs advanced simulations of the universe model and saves comprehensive data.
"""

import os
import json
import random
import math
import time
import numpy as np
from datetime import datetime

# Ensure data directory exists
DATA_DIR = "data"
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def simulate_intent_field(size=10, fluctuation_rate=0.01, probabilistic=True):
    """Simulates an intent field with probabilistic fluctuations"""
    field = [[[random.random() * 2 - 1 for _ in range(size)] 
              for _ in range(size)] 
             for _ in range(size)]
    
    # Apply fluctuations
    for z in range(size):
        for y in range(size):
            for x in range(size):
                # Probabilistic fluctuation - not every cell changes
                if random.random() < 0.3:  # Only 30% of cells change
                    if probabilistic:
                        # Use gaussian-like distribution
                        u1, u2 = random.random(), random.random()
                        rand_std_normal = math.sqrt(-2.0 * math.log(u1)) * math.sin(2.0 * math.PI * u2)
                        fluctuation = rand_std_normal * fluctuation_rate * 0.3
                    else:
                        # Standard uniform random fluctuation
                        fluctuation = (random.random() * 2 - 1) * fluctuation_rate
                    
                    field[z][y][x] += fluctuation
                    field[z][y][x] = max(-1, min(1, field[z][y][x]))
    
    # Occasionally create wave-like patterns
    if random.random() < 0.05:  # 5% chance
        wave_origin = (
            random.randint(0, size-1),
            random.randint(0, size-1),
            random.randint(0, size-1)
        )
        wave_strength = random.random() * 0.5 * fluctuation_rate
        wavelength = random.random() * 5 + 5  # 5-10 cells
        
        for z in range(size):
            for y in range(size):
                for x in range(size):
                    distance = math.sqrt(
                        (x - wave_origin[0])**2 + 
                        (y - wave_origin[1])**2 + 
                        (z - wave_origin[2])**2
                    )
                    wave_effect = (math.sin(distance / wavelength * math.pi * 2) * 
                                wave_strength * math.exp(-distance / (wavelength * 2)))
                    field[z][y][x] += wave_effect
                    field[z][y][x] = max(-1, min(1, field[z][y][x]))
    
    return field

def create_particle_from_field(field_value, id, enable_adaptive=False):
    """Creates an enhanced particle based on field value"""
    charge = "positive" if field_value > 0.3 else "negative" if field_value < -0.3 else "neutral"
    
    # Determine particle type based on field value
    type_value = abs(field_value)
    if type_value > 0.7:
        particle_type = "high-energy"
    elif type_value > 0.4:
        particle_type = "quantum"
    else:
        particle_type = "standard"
    
    # Create adaptive particles if enabled
    if enable_adaptive and random.random() < 0.1:  # 10% chance
        particle_type = "adaptive"
    
    # Basic properties
    knowledge = random.random() * 0.3  # Initial knowledge
    energy = abs(field_value) * 2
    complexity = 1.0
    stability = random.random() * 0.8 + 0.2
    
    # Enhanced properties
    phase = random.random() * math.pi * 2  # Quantum phase
    entropy = random.random()  # Initial entropy
    adaptive_score = 1.0 if particle_type == "adaptive" else 0.0
    cluster_id = -1  # Not in a cluster
    age = 0
    energy_capacity = 1.0 + random.random() * 0.5
    decay_rate = 0.0001 + random.random() * 0.0001
    interaction_memory = {}  # Empty memory
    
    return {
        "id": id,
        "charge": charge,
        "type": particle_type,
        "knowledge": knowledge,
        "complexity": complexity,
        "energy": energy,
        "stability": stability,
        "interactions": 0,
        # Enhanced properties
        "phase": phase,
        "entropy": entropy,
        "adaptive_score": adaptive_score,
        "cluster_id": cluster_id,
        "age": age,
        "energy_capacity": energy_capacity,
        "decay_rate": decay_rate,
        "interaction_memory": interaction_memory
    }

def simulate_interaction(particle1, particle2, learning_rate=0.1):
    """Simulates enhanced interaction between two particles"""
    # Copy particles to avoid modifying originals
    p1 = particle1.copy()
    p2 = particle2.copy()
    
    # Determine if particles interact based on charge and other factors
    interaction_chance = 0.7
    if p1["charge"] == "positive" and p2["charge"] == "positive":
        interaction_chance = 0.8
    elif p1["charge"] == "negative" and p2["charge"] == "negative":
        interaction_chance = 0.3
    elif p1["charge"] == "neutral":
        interaction_chance = 0.5
    
    # Adaptive particles have higher interaction chance
    if p1["type"] == "adaptive" or p2["type"] == "adaptive":
        interaction_chance += 0.1
    
    # Phase-dependent chance for quantum particles
    if p1["type"] == "quantum" or p2["type"] == "quantum":
        phase_factor = abs(math.sin((p1.get("phase", 0) + p2.get("phase", 0)) / 2))
        interaction_chance = 0.3 + phase_factor * 0.5
    
    # Check if interaction occurs
    if random.random() > interaction_chance:
        return p1, p2, False
    
    # Update interaction memory
    p1_id, p2_id = p1["id"], p2["id"]
    memory_retention = 0.95  # How much old memories persist
    
    # P1's memory of P2
    old_memory_p1 = p1["interaction_memory"].get(str(p2_id), 0)
    p1["interaction_memory"][str(p2_id)] = old_memory_p1 * memory_retention + learning_rate * 0.2
    
    # P2's memory of P1
    old_memory_p2 = p2["interaction_memory"].get(str(p1_id), 0)
    p2["interaction_memory"][str(p1_id)] = old_memory_p2 * memory_retention + learning_rate * 0.2
    
    # Knowledge exchange
    intent_similarity = 1 - abs(p1.get("intent", 0) - p2.get("intent", 0))
    knowledge_transfer = min(p1["knowledge"], p2["knowledge"]) * learning_rate * (0.2 + intent_similarity * 0.3)
    
    p1["knowledge"] += knowledge_transfer
    p2["knowledge"] += knowledge_transfer
    
    # Increment interaction count
    p1["interactions"] += 1
    p2["interactions"] += 1
    
    # Age particles
    p1["age"] += 1
    p2["age"] += 1
    
    # Apply adaptive learning if applicable
    if p1["type"] == "adaptive":
        p1["adaptive_score"] += 0.05 * min(1, (p2["knowledge"] + p2["energy"]) / 2)
    
    if p2["type"] == "adaptive":
        p2["adaptive_score"] += 0.05 * min(1, (p1["knowledge"] + p1["energy"]) / 2)
    
    # Cluster formation chance
    if intent_similarity > 0.8 and random.random() < 0.05:
        # Try to join/form a cluster
        if p1["cluster_id"] == -1 and p2["cluster_id"] == -1:
            # Both unaffiliated - form new cluster with max ID + 1
            new_cluster_id = max(p1["id"], p2["id"]) + 1
            p1["cluster_id"] = new_cluster_id
            p2["cluster_id"] = new_cluster_id
        elif p1["cluster_id"] != -1 and p2["cluster_id"] == -1:
            # First has cluster, second joins
            p2["cluster_id"] = p1["cluster_id"]
        elif p1["cluster_id"] == -1 and p2["cluster_id"] != -1:
            # Second has cluster, first joins
            p1["cluster_id"] = p2["cluster_id"]
    
    # Possibly create composite particle
    if ((p1["knowledge"] > 1 and p2["knowledge"] > 1) and
        (p1["energy"] > 0.4 and p2["energy"] > 0.4)):
        
        # Enhanced formation logic with entropy effects
        # Lower entropy (more order) increases chance to form composites
        entropy_factor = (2 - p1.get("entropy", 0.5) - p2.get("entropy", 0.5)) / 2
        
        # Age factor - older particles more likely to form composites
        age_factor = min(1, (p1["age"] + p2["age"]) / 200)
        
        # Chance to form
        formation_threshold = 0.6 * entropy_factor * age_factor
        
        if (random.random() < formation_threshold and
            ((p1["charge"] == "positive" and p2["charge"] != "positive") or
             (p2["charge"] == "positive" and p1["charge"] != "positive"))):
            
            # Create composite particle (only one - the other will be reduced)
            if random.random() < 0.5:
                p1["type"] = "composite"
                p1["complexity"] = p1["complexity"] + p2["complexity"] * 0.7
                p1["energy"] = p1["energy"] + p2["energy"] * 0.5
                p1["knowledge"] = max(p1["knowledge"], p2["knowledge"]) * 1.2
                p1["entropy"] = (p1.get("entropy", 0.5) + p2.get("entropy", 0.5)) * 0.4
                p1["energy_capacity"] += p2["energy_capacity"] * 0.5
                
                # Merge memories
                for pid, strength in p2["interaction_memory"].items():
                    old_strength = p1["interaction_memory"].get(pid, 0)
                    p1["interaction_memory"][pid] = old_strength + strength * 0.5
                
                # Reduce second particle
                p2["energy"] *= 0.3
                p2["knowledge"] *= 0.3
            else:
                p2["type"] = "composite"
                p2["complexity"] = p2["complexity"] + p1["complexity"] * 0.7
                p2["energy"] = p2["energy"] + p1["energy"] * 0.5
                p2["knowledge"] = max(p2["knowledge"], p1["knowledge"]) * 1.2
                p2["entropy"] = (p2.get("entropy", 0.5) + p1.get("entropy", 0.5)) * 0.4
                p2["energy_capacity"] += p1["energy_capacity"] * 0.5
                
                # Merge memories
                for pid, strength in p1["interaction_memory"].items():
                    old_strength = p2["interaction_memory"].get(pid, 0)
                    p2["interaction_memory"][pid] = old_strength + strength * 0.5
                
                # Reduce first particle
                p1["energy"] *= 0.3
                p1["knowledge"] *= 0.3
    
    return p1, p2, True

def analyze_particle_clusters(particles):
    """Analyze clusters in the particle system"""
    # Get all cluster IDs (excluding -1 which means no cluster)
    cluster_ids = set()
    for p in particles:
        if p["cluster_id"] != -1:
            cluster_ids.add(p["cluster_id"])
    
    # Count particles in each cluster
    cluster_sizes = {}
    for cid in cluster_ids:
        size = sum(1 for p in particles if p["cluster_id"] == cid)
        cluster_sizes[cid] = size
    
    # Calculate metrics
    cluster_count = len(cluster_ids)
    total_size = sum(cluster_sizes.values())
    largest_size = max(cluster_sizes.values()) if cluster_sizes else 0
    avg_cluster_size = total_size / cluster_count if cluster_count > 0 else 0
    
    # Calculate cluster stability
    total_knowledge = 0
    total_complexity = 0
    total_age = 0
    total_clustered_particles = 0
    
    for cid in cluster_ids:
        cluster_particles = [p for p in particles if p["cluster_id"] == cid]
        total_clustered_particles += len(cluster_particles)
        
        for p in cluster_particles:
            total_knowledge += p["knowledge"]
            total_complexity += p["complexity"]
            total_age += p["age"]
    
    avg_knowledge = total_knowledge / total_clustered_particles if total_clustered_particles > 0 else 0
    avg_complexity = total_complexity / total_clustered_particles if total_clustered_particles > 0 else 0
    avg_age = total_age / total_clustered_particles if total_clustered_particles > 0 else 0
    
    # Calculate stability score (0-1)
    knowledge_factor = min(1, avg_knowledge / 10)
    complexity_factor = min(1, avg_complexity / 5)
    age_factor = min(1, avg_age / 500)
    
    cluster_stability = (knowledge_factor * 0.4 + complexity_factor * 0.4 + age_factor * 0.2)
    
    return {
        "cluster_count": cluster_count,
        "average_cluster_size": avg_cluster_size,
        "largest_cluster_size": largest_size,
        "cluster_stability": cluster_stability
    }

def calculate_system_entropy(particles, intent_field):
    """Calculate the entropy of the entire system"""
    # Type and charge distribution entropy
    type_counts = {
        "standard": 0, "high-energy": 0, "quantum": 0, 
        "composite": 0, "adaptive": 0
    }
    
    charge_counts = {"positive": 0, "negative": 0, "neutral": 0}
    
    for p in particles:
        p_type = p["type"]
        p_charge = p["charge"]
        
        if p_type in type_counts:
            type_counts[p_type] += 1
        if p_charge in charge_counts:
            charge_counts[p_charge] += 1
    
    # Calculate type entropy
    type_entropy = 0
    total_particles = len(particles)
    for count in type_counts.values():
        if count > 0:
            probability = count / total_particles
            type_entropy -= probability * math.log2(probability) if probability > 0 else 0
    
    # Normalize to 0-1 range
    max_type_entropy = math.log2(len(type_counts))
    normalized_type_entropy = type_entropy / max_type_entropy if max_type_entropy > 0 else 0
    
    # Calculate charge entropy
    charge_entropy = 0
    for count in charge_counts.values():
        if count > 0:
            probability = count / total_particles
            charge_entropy -= probability * math.log2(probability) if probability > 0 else 0
    
    # Normalize to 0-1 range
    max_charge_entropy = math.log2(len(charge_counts))
    normalized_charge_entropy = charge_entropy / max_charge_entropy if max_charge_entropy > 0 else 0
    
    # Field entropy calculation (simplified)
    field_entropy = 0
    field_cells = 0
    
    for plane in intent_field:
        for row in plane:
            for value in row:
                # Convert to probability-like value (0-1)
                norm_value = (value + 1) / 2
                # Shannon entropy for this value
                if 0 < norm_value < 1:
                    field_entropy -= (norm_value * math.log2(norm_value or 1e-10) + 
                                    (1 - norm_value) * math.log2(1 - norm_value or 1e-10))
                field_cells += 1
    
    normalized_field_entropy = field_entropy / field_cells if field_cells > 0 else 0
    
    # Combined entropy (weighted average)
    system_entropy = (normalized_field_entropy * 0.3 + 
                     normalized_type_entropy * 0.35 + 
                     normalized_charge_entropy * 0.35)
    
    return system_entropy

def detect_anomalies(particles, prev_state, curr_state, timestamp):
    """Detect significant events and anomalies in the simulation"""
    anomalies = []
    
    # Entropy changes
    entropy_change = abs(curr_state["entropy"] - prev_state["entropy"])
    if entropy_change > 0.15:
        anomalies.append({
            "timestamp": timestamp,
            "type": "entropy_spike",
            "description": ("Sudden increase in system entropy (more disorder)" 
                           if curr_state["entropy"] > prev_state["entropy"]
                           else "Sudden decrease in system entropy (more order)"),
            "affected_particles": len(particles),
            "severity": min(1, entropy_change * 2)
        })
    
    # Cluster formations/dissolutions
    cluster_change = curr_state["cluster_count"] - prev_state["cluster_count"]
    if abs(cluster_change) > 2:
        anomalies.append({
            "timestamp": timestamp,
            "type": "cluster_formation" if cluster_change > 0 else "cluster_dissolution",
            "description": (f"Rapid formation of {cluster_change} new clusters" 
                          if cluster_change > 0 
                          else f"Dissolution of {abs(cluster_change)} existing clusters"),
            "affected_particles": round(len(particles) * 0.2),
            "severity": min(1, abs(cluster_change) / 5)
        })
    
    # Adaptive emergence
    adaptive_change = curr_state["adaptive_count"] - prev_state["adaptive_count"]
    if adaptive_change > 3:
        anomalies.append({
            "timestamp": timestamp,
            "type": "adaptive_emergence",
            "description": f"Emergence of {adaptive_change} new adaptive particles",
            "affected_particles": adaptive_change,
            "severity": min(1, adaptive_change / 10)
        })
    
    # Phase transitions - composite formation/breakdown
    composite_change = curr_state["composite_count"] - prev_state["composite_count"]
    if composite_change > 5 or (prev_state["composite_count"] > 0 and composite_change < -5):
        anomalies.append({
            "timestamp": timestamp,
            "type": "phase_transition",
            "description": (f"Rapid composition formation: {composite_change} new composite particles"
                          if composite_change > 0
                          else f"Major composition breakdown: {abs(composite_change)} composite particles lost"),
            "affected_particles": abs(composite_change),
            "severity": min(1, abs(composite_change) / 10)
        })
    
    return anomalies

def run_simulation(max_particles=100, iterations=1000, learning_rate=0.1, 
                 fluctuation_rate=0.01, use_adaptive=False, energy_conservation=False,
                 probabilistic_intent=False):
    """Runs a full enhanced simulation"""
    # Initialize simulation
    intent_field = simulate_intent_field(fluctuation_rate=fluctuation_rate, probabilistic=probabilistic_intent)
    particles = []
    total_interactions = 0
    simulation_time = 0
    anomalies = []
    
    # Previous state for anomaly detection
    prev_state = {
        "entropy": 0,
        "cluster_count": 0,
        "adaptive_count": 0,
        "composite_count": 0,
    }
    
    # Create initial particles
    for i in range(max_particles // 2):
        field_value = intent_field[random.randint(0, 9)][random.randint(0, 9)][random.randint(0, 9)]
        particles.append(create_particle_from_field(field_value, i, use_adaptive))
    
    # Data collection
    time_series_data = []
    
    # Run simulation iterations
    for iteration in range(iterations):
        simulation_time += 1
        
        # Create new particles if needed
        if len(particles) < max_particles:
            field_value = intent_field[random.randint(0, 9)][random.randint(0, 9)][random.randint(0, 9)]
            particles.append(create_particle_from_field(field_value, len(particles), use_adaptive))
        
        # Update intent field
        if iteration % 50 == 0:
            intent_field = simulate_intent_field(
                fluctuation_rate=fluctuation_rate,
                probabilistic=probabilistic_intent
            )
            
            # Periodically create field from particles (feedback loop)
            if iteration % 100 == 0 and len(particles) > 0:
                # Simple implementation for demonstration
                # In the real system, this would be more complex
                for p in particles:
                    if p["type"] == "composite" or p["type"] == "adaptive":
                        # These particles influence the field
                        z, y, x = random.randint(0, 9), random.randint(0, 9), random.randint(0, 9)
                        influence = 0.2 * p["complexity"] * (1 if p["charge"] == "positive" else -1)
                        intent_field[z][y][x] += influence
                        intent_field[z][y][x] = max(-1, min(1, intent_field[z][y][x]))
        
        # Process particle interactions
        particles_to_remove = []
        for i in range(len(particles)):
            # Energy conservation
            if energy_conservation:
                particles[i]["energy"] *= (1 - particles[i]["decay_rate"])
                if particles[i]["energy"] < 0.1:
                    particles_to_remove.append(i)
                    continue
            
            # Age particles
            particles[i]["age"] += 1
            
            # Interactions with other particles
            for j in range(i + 1, len(particles)):
                p1, p2, interaction_occurred = simulate_interaction(
                    particles[i], particles[j], learning_rate
                )
                
                particles[i], particles[j] = p1, p2
                
                if interaction_occurred:
                    total_interactions += 1
        
        # Remove particles with low energy
        particles = [p for i, p in enumerate(particles) if i not in particles_to_remove]
        
        # Collect data every few iterations
        if iteration % 50 == 0:
            # Calculate basic statistics
            particle_counts = {
                "positive": sum(1 for p in particles if p["charge"] == "positive"),
                "negative": sum(1 for p in particles if p["charge"] == "negative"),
                "neutral": sum(1 for p in particles if p["charge"] == "neutral"),
                "high_energy": sum(1 for p in particles if p["type"] == "high-energy"),
                "quantum": sum(1 for p in particles if p["type"] == "quantum"),
                "standard": sum(1 for p in particles if p["type"] == "standard"),
                "composite": sum(1 for p in particles if p["type"] == "composite"),
                "adaptive": sum(1 for p in particles if p["type"] == "adaptive")
            }
            
            # Advanced analytics
            cluster_analysis = analyze_particle_clusters(particles)
            system_entropy = calculate_system_entropy(particles, intent_field)
            
            # Calculate advanced metrics
            avg_knowledge = sum(p["knowledge"] for p in particles) / max(1, len(particles))
            avg_complexity = sum(p["complexity"] for p in particles) / max(1, len(particles))
            max_complexity = max([p["complexity"] for p in particles]) if particles else 1
            
            # Current state for anomaly detection
            curr_state = {
                "entropy": system_entropy,
                "cluster_count": cluster_analysis["cluster_count"],
                "adaptive_count": particle_counts["adaptive"],
                "composite_count": particle_counts["composite"],
            }
            
            # Detect anomalies after initial stabilization
            if iteration > 100:
                new_anomalies = detect_anomalies(particles, prev_state, curr_state, simulation_time)
                anomalies.extend(new_anomalies)
            
            # Update previous state
            prev_state = curr_state.copy()
            
            # Enhanced complexity index calculation
            variety_factor = (
                (particle_counts["positive"] + 1) * 
                (particle_counts["negative"] + 1) * 
                (particle_counts["neutral"] + 1) * 
                (particle_counts["high_energy"] + 1) * 
                (particle_counts["quantum"] + 1) * 
                (particle_counts["composite"] + 1) *
                (particle_counts["adaptive"] + 1)
            ) / max(1, len(particles) ** 2)
            
            complexity_index = (
                avg_knowledge * variety_factor + 
                (total_interactions / 1000) + 
                (particle_counts["composite"] * max_complexity) +
                (particle_counts["adaptive"] * 2) +
                (cluster_analysis["cluster_count"] * cluster_analysis["cluster_stability"])
            )
            
            # Add data point with enhanced metrics
            data_point = {
                "timestamp": simulation_time,
                "particle_counts": particle_counts,
                "total_particles": len(particles),
                "total_interactions": total_interactions,
                "avg_knowledge": avg_knowledge,
                "avg_complexity": avg_complexity,
                "max_complexity": max_complexity,
                "complexity_index": complexity_index,
                "cluster_analysis": cluster_analysis,
                "system_entropy": system_entropy
            }
            
            time_series_data.append(data_point)
    
    return time_series_data, anomalies

def main():
    """Main function to run multiple simulations with different configurations"""
    print("Starting enhanced universe simulation data collection...")
    
    # Run multiple simulations with different configurations
    simulation_configs = [
        {
            "max_particles": 100, 
            "learning_rate": 0.1, 
            "fluctuation_rate": 0.01, 
            "use_adaptive": False,
            "energy_conservation": False,
            "probabilistic_intent": False,
            "name": "baseline"
        },
        {
            "max_particles": 150, 
            "learning_rate": 0.2, 
            "fluctuation_rate": 0.02, 
            "use_adaptive": True,
            "energy_conservation": False,
            "probabilistic_intent": True,
            "name": "adaptive_probabilistic"
        },
        {
            "max_particles": 80, 
            "learning_rate": 0.1, 
            "fluctuation_rate": 0.01, 
            "use_adaptive": False,
            "energy_conservation": True,
            "probabilistic_intent": False,
            "name": "energy_conservation"
        },
        {
            "max_particles": 120, 
            "learning_rate": 0.15, 
            "fluctuation_rate": 0.02, 
            "use_adaptive": True,
            "energy_conservation": True,
            "probabilistic_intent": True,
            "name": "full_features"
        }
    ]
    
    # Create unique timestamp for this run
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    for config in simulation_configs:
        print(f"Running simulation: {config['name']}...")
        simulation_data, anomalies = run_simulation(
            max_particles=config["max_particles"],
            iterations=1000,
            learning_rate=config["learning_rate"],
            fluctuation_rate=config["fluctuation_rate"],
            use_adaptive=config["use_adaptive"],
            energy_conservation=config["energy_conservation"],
            probabilistic_intent=config["probabilistic_intent"]
        )
        
        # Save data to file
        filename = f"{DATA_DIR}/simulation_{config['name']}_{timestamp}.json"
        with open(filename, "w") as f:
            json.dump({
                "config": config,
                "data": simulation_data,
                "anomalies": anomalies,
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
    
    print("Enhanced data collection complete!")

if __name__ == "__main__":
    main()
