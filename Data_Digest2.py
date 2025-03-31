import pygame
import random
import math
import pandas as pd
import uproot
import google.generativeai as genai
import os

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyCDt0NTTiVIC_NhRZXkDsuOFaH6BSntZ8U"  # Replace with your API key
genai.configure(api_key=GOOGLE_API_KEY)

# Screen dimensions
width, height = 800, 600
screen = pygame.display.set_mode((width, height))

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

# Camera properties
camera_z = -200

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
    print("Error: ATLAS data file not found. Ensure the paths are correct.")
    experimental_data = None
    simulation_data = None
except Exception as e:
    print(f"Error loading ATLAS data: {e}")
    experimental_data = None
    simulation_data = None

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
        x_index, y_index, z_index = int(self.x), int(self.y), int(self.z)
        intent_value = intent_field[z_index][y_index][x_index]
        # Simplified: Change momentum based on intent
        self.momentum[0] += intent_value * learning_rate
        self.momentum[1] += intent_value * learning_rate
        self.momentum[2] += intent_value * learning_rate
        self.vx = self.momentum[0]
        self.vy = self.momentum[1]
        self.vz = self.momentum[2]
        self.seek_knowledge(particles)

    def seek_knowledge(self, particle_group):
        for other in particle_group:
            if other != self:
                dx = other.x - self.x
                dy = other.y - self.y
                dz = other.z - self.z
                distance = math.sqrt(dx**2 + dy**2 + dz**2)
                if distance < 100:
                    self.learn_from(other)

    def learn_from(self, other):
        # Simplified: Exchange momentum
        self.momentum[0] = self.momentum[0] + (other.momentum[0] - self.momentum[0]) * learning_rate
        self.momentum[1] = self.momentum[1] + (other.momentum[1] - self.momentum[1]) * learning_rate
        self.momentum[2] = self.momentum[2] + (other.momentum[2] - self.momentum[2]) * learning_rate
        self.vx = self.momentum[0]
        self.vy = self.momentum[1]
        self.vz = self.momentum[2]

    def blend_colors(self, color1, color2, alpha=0.5):
        r = int(color1[0] * (1 - alpha) + color2[0] * alpha)
        g = int(color1[1] * (1 - alpha) + color2[1] * alpha)
        b = int(color1[2] * (1 - alpha) + color2[2] * alpha)
        return (r, g, b)

running = True
try:
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    running = False
        screen.fill((0, 0, 0))
        for z in range(depth):
            for y in range(height):
                for x in range(width):
                    intent_field[z][y][x] += random.uniform(-intent_fluctuation_rate, intent_fluctuation_rate)
                    intent_field[z][y][x] = max(min(intent_field[z][y][x], 1), -1)
        if len(particles) < 200 and experimental_data is not None and simulation_data is not None:
            if random.random() < 0.01:
                # Particle creation probabilities from ATLAS data (simplified example)
                if random.random() < 0.5:  # Example: 50% chance of experimental data
                    index = random.randint(0, len(experimental_data) - 1)
                    particle_type = experimental_data["particle_type"][index]  # Replace with actual column name
                    momentum = experimental_data[["px", "py", "pz"]].iloc[index].tolist() # Replace with actual momentum columns
                    color = (0, 255, 0)  # Example color for experimental particles
                else:
                    index = random.randint(0, len(simulation_data) - 1)
                    particle_type = simulation_data["particle_type"][index]  # Replace with actual column name
                    momentum = simulation_data[["px", "py", "pz"]].iloc[index].tolist() # Replace with actual momentum columns
                    color = (255, 0, 0)  # Example color for simulation particles
                x, y, z = random.uniform(0, width), random.uniform(0, height), 0
                particles.append(Particle(x, y, z, particle_type, momentum, color))

        for particle in particles:
            particle.move()
            particle.draw()

        # Gemini API integration (example - replace with your logic)
        if random.random() < 0.001 and len(particles) > 0:
            particle_data = [
                {"x": p.x, "y": p.y, "z": p.z, "particle_type": p.particle_type, "momentum": p.momentum} for p in particles
            ]
            model = genai.GenerativeModel("gemini-pro")
            response = model.generate_content(
                f"Analyze particle data: {particle_data}"
            )
            print(response.text)
            # Process response to adjust simulation parameters (replace with your logic)
            # Example: Adjust intent_fluctuation_rate based on API response
            # intent_fluctuation_rate += float(response.text) # This is a placeholder
        pygame.display.flip()
except KeyboardInterrupt:
    print("Simulation interrupted by user.")
finally:
    pygame.quit()
