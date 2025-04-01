
import os
import pygame
import random
import math
import pandas as pd
import uproot
import google.generativeai as genai
from datetime import datetime
import json
import time

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
else:
    print("Error: GOOGLE_API_KEY is not set. Please configure the environment variable.")

# Screen dimensions
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("IntentSim - Continuous Universe Simulation")

# Intent field properties
depth = 100
intent_field = [[[random.uniform(-1, 1) for _ in range(width)]
                 for _ in range(height)]
                for _ in range(depth)]
intent_fluctuation_rate = 0.01
particle_creation_thresholds = []  # Initialize as an empty list

# Particle properties
particle_radius = 5
particles = []  # Initialize as an empty list
max_particles = 300
learning_rate = 0.1

# Tracking statistics
positive_particles = 0
negative_particles = 0
neutral_particles = 0
total_interactions = 0
average_momentum = [0, 0, 0]
simulation_complexity = 0

# Camera properties
camera_z = -200

# Data directory
data_dir = "data"
os.makedirs(data_dir, exist_ok=True)

# Create a directory for the current date
now = datetime.now()
date_str = now.strftime("%Y%m%d")
current_data_dir = os.path.join(data_dir, date_str)
os.makedirs(current_data_dir, exist_ok=True)

# Simulation time tracking
start_time = time.time()
last_save_time = start_time
save_interval = 3600  # Save data every hour

# --- ATLAS Data Integration ---
# Replace these paths with the actual paths to your downloaded ATLAS datasets
experimental_data_path = "ATLAS_experimental.root"
simulation_data_path = "ATLAS_simulation.root"

try:
    # Load ATLAS experimental data
    experimental_file = uproot.open(experimental_data_path)
    experimental_tree = experimental_file["Events"]  # Replace "Events" with the actual tree name
    experimental_data = experimental_tree.arrays(library="pd")
    experimental_file.close()

    # Load ATLAS simulation data
    simulation_file = uproot.open(simulation_data_path)
    simulation_tree = simulation_file["Events"]  # Replace "Events" with the actual tree name
    simulation_data = simulation_tree.arrays(library="pd")
    simulation_file.close()

    print("ATLAS data loaded successfully.")
except FileNotFoundError:
    print("Error: ATLAS data file not found. Using simplified simulation data instead.")
    # Create simplified example data
    experimental_data = pd.DataFrame({
        'particle_type': ['electron', 'proton', 'neutron', 'photon'] * 25,
        'px': [random.uniform(-10, 10) for _ in range(100)],
        'py': [random.uniform(-10, 10) for _ in range(100)],
        'pz': [random.uniform(-10, 10) for _ in range(100)]
    })
    simulation_data = pd.DataFrame({
        'particle_type': ['electron', 'proton', 'neutron', 'photon'] * 25,
        'px': [random.uniform(-10, 10) for _ in range(100)],
        'py': [random.uniform(-10, 10) for _ in range(100)],
        'pz': [random.uniform(-10, 10) for _ in range(100)]
    })
except Exception as e:
    print(f"Error loading ATLAS data: {e}")
    # Create simplified example data
    experimental_data = pd.DataFrame({
        'particle_type': ['electron', 'proton', 'neutron', 'photon'] * 25,
        'px': [random.uniform(-10, 10) for _ in range(100)],
        'py': [random.uniform(-10, 10) for _ in range(100)],
        'pz': [random.uniform(-10, 10) for _ in range(100)]
    })
    simulation_data = pd.DataFrame({
        'particle_type': ['electron', 'proton', 'neutron', 'photon'] * 25,
        'px': [random.uniform(-10, 10) for _ in range(100)],
        'py': [random.uniform(-10, 10) for _ in range(100)],
        'pz': [random.uniform(-10, 10) for _ in range(100)]
    })

# Particle class
class Particle:
    def __init__(self, x, y, z, particle_type, momentum, color=(255, 255, 255)):
        self.x = x
        self.y = y
        self.z = z
        self.particle_type = particle_type
        self.momentum = momentum
        self.vx = momentum[0]  # Simplified: vx is the x-component of momentum
        self.vy = momentum[1]  # Simplified: vy is the y-component of momentum
        self.vz = momentum[2]  # Simplified: vz is the z-component of momentum
        self.color = color
        self.interactions = 0
        self.knowledge_gained = 0
        self.intent_value = 0

    def draw(self):
        projected_x = self.x / (self.z - camera_z) * width + width / 2
        projected_y = self.y / (self.z - camera_z) * height + height / 2
        projected_radius = particle_radius / (self.z - camera_z) * width
        if self.z > camera_z:
            pygame.draw.circle(screen, self.color, (int(projected_x), int(projected_y)), int(projected_radius))

    def move(self):
        self.x += self.vx
        self.y += self.vy
        self.z += self.vz
        if self.x < 0 or self.x > width:
            self.vx *= -1
        if self.y < 0 or self.y > height:
            self.vy *= -1
        if self.z < 0 or self.z > depth:
            self.vz *= -1
        
        # Get intent field value at particle position
        x_index = min(max(0, int(self.x)), width - 1)
        y_index = min(max(0, int(self.y)), height - 1)
        z_index = min(max(0, int(self.z)), depth - 1)
        self.intent_value = intent_field[z_index][y_index][x_index]
        
        # Change momentum based on intent and particle type
        intent_multiplier = 1.0
        if "positive" in self.particle_type:
            intent_multiplier = 1.5  # Positive particles are more influenced by intent
        elif "negative" in self.particle_type:
            intent_multiplier = 0.5  # Negative particles are less influenced
            
        self.momentum[0] += self.intent_value * learning_rate * intent_multiplier
        self.momentum[1] += self.intent_value * learning_rate * intent_multiplier
        self.momentum[2] += self.intent_value * learning_rate * intent_multiplier
        
        self.vx = self.momentum[0]
        self.vy = self.momentum[1]
        self.vz = self.momentum[2]
        
        # Seek knowledge from other particles
        self.seek_knowledge(particles)

    def seek_knowledge(self, particle_group):
        global total_interactions
        
        for other in particle_group:
            if other != self:
                dx = other.x - self.x
                dy = other.y - self.y
                dz = other.z - self.z
                distance = math.sqrt(dx**2 + dy**2 + dz**2)
                interaction_radius = 50
                
                # Adjust interaction radius based on particle type
                if "positive" in self.particle_type:
                    interaction_radius = 80  # Positive particles seek interactions
                elif "negative" in self.particle_type:
                    interaction_radius = 30  # Negative particles avoid interactions
                
                if distance < interaction_radius:
                    self.learn_from(other)
                    total_interactions += 1
                    self.interactions += 1

    def learn_from(self, other):
        # Exchange momentum and knowledge based on particle types
        learning_modifier = 0.1
        
        if "positive" in self.particle_type:
            learning_modifier = 0.2  # Positive particles learn more readily
        elif "negative" in self.particle_type:
            learning_modifier = 0.05  # Negative particles are resistant to learning
            
        # Transfer momentum based on particle types
        self.momentum[0] = self.momentum[0] + (other.momentum[0] - self.momentum[0]) * learning_rate * learning_modifier
        self.momentum[1] = self.momentum[1] + (other.momentum[1] - self.momentum[1]) * learning_rate * learning_modifier
        self.momentum[2] = self.momentum[2] + (other.momentum[2] - self.momentum[2]) * learning_rate * learning_modifier
        
        self.vx = self.momentum[0]
        self.vy = self.momentum[1]
        self.vz = self.momentum[2]
        
        # Track knowledge gain
        self.knowledge_gained += learning_modifier
        
        # Color blending can represent knowledge exchange
        self.color = self.blend_colors(self.color, other.color, 0.05)

    def blend_colors(self, color1, color2, alpha=0.5):
        r = int(color1[0] * (1 - alpha) + color2[0] * alpha)
        g = int(color1[1] * (1 - alpha) + color2[1] * alpha)
        b = int(color1[2] * (1 - alpha) + color2[2] * alpha)
        return (r, g, b)

def update_statistics():
    global positive_particles, negative_particles, neutral_particles, average_momentum, simulation_complexity
    
    # Reset counters
    positive_particles = 0
    negative_particles = 0
    neutral_particles = 0
    total_momentum = [0, 0, 0]
    
    # Calculate statistics
    for particle in particles:
        if "positive" in particle.particle_type:
            positive_particles += 1
        elif "negative" in particle.particle_type:
            negative_particles += 1
        else:
            neutral_particles += 1
            
        total_momentum[0] += abs(particle.momentum[0])
        total_momentum[1] += abs(particle.momentum[1])
        total_momentum[2] += abs(particle.momentum[2])
    
    # Calculate average momentum
    if particles:
        average_momentum = [m / len(particles) for m in total_momentum]
    else:
        average_momentum = [0, 0, 0]
    
    # Calculate a basic complexity measure based on particle interactions and knowledge
    interaction_diversity = len(set([p.interactions for p in particles])) if particles else 0
    knowledge_diversity = len(set([round(p.knowledge_gained, 2) for p in particles])) if particles else 0
    simulation_complexity = (interaction_diversity + knowledge_diversity) / 2
    
    return {
        "timestamp": datetime.now().isoformat(),
        "positive_particles": positive_particles,
        "negative_particles": negative_particles,
        "neutral_particles": neutral_particles,
        "total_particles": len(particles),
        "total_interactions": total_interactions,
        "average_momentum_x": average_momentum[0],
        "average_momentum_y": average_momentum[1],
        "average_momentum_z": average_momentum[2],
        "simulation_complexity": simulation_complexity,
        "intent_field_energy": sum(sum(sum(abs(v) for v in row) for row in plane) for plane in intent_field) / (width * height * depth)
    }

def save_simulation_data(stats):
    # Generate a filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    data_file = os.path.join(current_data_dir, f"simulation_data_{timestamp}.json")
    
    # Prepare particle data
    particle_data = [
        {
            "x": p.x, 
            "y": p.y, 
            "z": p.z, 
            "type": p.particle_type, 
            "momentum_x": p.momentum[0], 
            "momentum_y": p.momentum[1], 
            "momentum_z": p.momentum[2],
            "interactions": p.interactions,
            "knowledge_gained": p.knowledge_gained,
            "intent_value": p.intent_value
        } for p in particles
    ]
    
    # Combine with statistics
    full_data = {
        "statistics": stats,
        "particles": particle_data
    }
    
    # Save as JSON
    with open(data_file, 'w') as f:
        json.dump(full_data, f, indent=2)
    
    print(f"Simulation data saved to {data_file}")
    
    # Also update a summary file for the day
    summary_file = os.path.join(data_dir, "summary.json")
    
    # Load existing summary if it exists
    summary_data = []
    if os.path.exists(summary_file):
        try:
            with open(summary_file, 'r') as f:
                summary_data = json.load(f)
        except:
            summary_data = []
    
    # Add latest stats to summary
    summary_data.append(stats)
    
    # Save updated summary
    with open(summary_file, 'w') as f:
        json.dump(summary_data, f, indent=2)

def create_particle():
    # Determine particle type and color
    intent_value = random.uniform(-1, 1)
    
    if intent_value > 0.3:  # Positive intent
        particle_type = "positive_" + random.choice(["electron", "proton", "boson"])
        color = (0, 255, 0)  # Green for positive
    elif intent_value < -0.3:  # Negative intent
        particle_type = "negative_" + random.choice(["electron", "proton", "boson"])
        color = (255, 0, 0)  # Red for negative
    else:  # Neutral intent
        particle_type = "neutral_" + random.choice(["neutron", "photon", "neutrino"])
        color = (0, 0, 255)  # Blue for neutral
    
    # Generate momentum from data or random values
    if random.random() < 0.7 and (experimental_data is not None or simulation_data is not None):
        if random.random() < 0.5 and experimental_data is not None:
            index = random.randint(0, len(experimental_data) - 1)
            momentum = experimental_data[["px", "py", "pz"]].iloc[index].tolist()
        elif simulation_data is not None:
            index = random.randint(0, len(simulation_data) - 1)
            momentum = simulation_data[["px", "py", "pz"]].iloc[index].tolist()
        else:
            momentum = [random.uniform(-2, 2), random.uniform(-2, 2), random.uniform(-2, 2)]
    else:
        momentum = [random.uniform(-2, 2), random.uniform(-2, 2), random.uniform(-2, 2)]
    
    # Create particle
    x, y, z = random.uniform(0, width), random.uniform(0, height), random.uniform(0, depth-1)
    return Particle(x, y, z, particle_type, momentum, color)

# Main loop
running = True
try:
    print("Starting IntentSim - a continuous universe simulation")
    print("Data will be saved periodically to the 'data' directory")
    
    stats_history = []
    frame_count = 0
    
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
        
        # Update the display
        screen.fill((0, 0, 0))
        
        # Update intent field with fluctuations
        for z in range(depth):
            for y in range(height):
                for x in range(width):
                    intent_field[z][y][x] += random.uniform(-intent_fluctuation_rate, intent_fluctuation_rate)
                    intent_field[z][y][x] = max(min(intent_field[z][y][x], 1), -1)
        
        # Create new particles based on intent field fluctuations
        if len(particles) < max_particles and random.random() < 0.05:
            particles.append(create_particle())
        
        # Move and draw particles
        for particle in particles:
            particle.move()
            particle.draw()
        
        # Update display
        pygame.display.flip()
        
        # Update statistics every 100 frames
        frame_count += 1
        if frame_count % 100 == 0:
            stats = update_statistics()
            stats_history.append(stats)
            
            # Print current stats
            print(f"Time: {stats['timestamp']}")
            print(f"Particles: {stats['total_particles']} (+ {stats['positive_particles']}, - {stats['negative_particles']}, n {stats['neutral_particles']})")
            print(f"Interactions: {stats['total_interactions']}")
            print(f"Complexity: {stats['simulation_complexity']:.2f}")
            print("---")
        
        # Save data periodically
        current_time = time.time()
        if current_time - last_save_time > save_interval:
            last_save_time = current_time
            
            # Save current simulation state
            if stats_history:
                save_simulation_data(stats_history[-1])
            
            # Check if we've crossed to a new day
            now = datetime.now()
            new_date_str = now.strftime("%Y%m%d")
            
            # If it's a new day, create a new directory
            if new_date_str != date_str:
                date_str = new_date_str
                current_data_dir = os.path.join(data_dir, date_str)
                os.makedirs(current_data_dir, exist_ok=True)
                
                # Save a daily summary
                daily_summary_file = os.path.join(current_data_dir, "daily_summary.json")
                with open(daily_summary_file, 'w') as f:
                    json.dump(stats_history, f, indent=2)
                
                # Reset the stats history for the new day
                stats_history = []
                
                print(f"Started new day: {date_str}")
        
        # Add a small delay to control the simulation speed
        pygame.time.delay(10)
        
except KeyboardInterrupt:
    print("Simulation interrupted by user.")
except Exception as e:
    print(f"Error in simulation: {e}")
finally:
    # Save final simulation state
    if particles:
        stats = update_statistics()
        save_simulation_data(stats)
    
    pygame.quit()
    print("Simulation ended. Data has been saved.")
    
    # Auto-restart if the simulation ends unexpectedly
    if running:  # If we didn't explicitly quit
        print("Unexpected simulation end. Restarting in 5 seconds...")
        time.sleep(5)
        os.execv(sys.executable, ['python'] + sys.argv)
