"""
jnana.ai — 3D Vector Particle Point-Cloud Generator
Extracts 10,000 authentic 3D vector coordinates (x, y, z, r, g, b)
from each of the 4 sacred scenes with 100% exact original colors
and centered bounding boxes for true full-screen 3D particle morphing.
"""

import os
import json
import numpy as np
from PIL import Image, ImageFilter

ASSETS_DIR = r"D:\productive\jnana.ai\assets\landing"
OUTPUT_FILE = r"D:\productive\jnana.ai\frontend\public\particles\scenes_3d_vectors.json"

N_PARTICLES = 10000

SCENES = [
    {"name": "flute_feather", "file": "scene1_flute_feather.png", "z_spread": 0.6},
    {"name": "cosmic", "file": "scene2_cosmic_stance.jpg", "z_spread": 0.9},
    {"name": "hand", "file": "scene3_extended_hand.jpg", "z_spread": 1.1},
    {"name": "bodhana", "file": "scene4_bodhana_arjuna.png", "z_spread": 0.8}
]

def sample_scene(img_path, z_spread, n_points, name):
    im = Image.open(img_path).convert("RGB")
    w_orig, h_orig = im.size
    
    # Scale down for fast high-quality processing
    max_dim = 640
    if w_orig > h_orig:
        w = max_dim
        h = int(max_dim * (h_orig / w_orig))
    else:
        h = max_dim
        w = int(max_dim * (w_orig / h_orig))
        
    im_resized = im.resize((w, h), Image.Resampling.LANCZOS)
    arr = np.array(im_resized, dtype=np.float32)
    rgb = arr / 255.0
    
    gray = im_resized.convert("L")
    gray_arr = np.array(gray, dtype=np.float32) / 255.0
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edges_arr = np.array(edges, dtype=np.float32) / 255.0
    
    # Darkness (foreground on white background)
    darkness = 1.0 - gray_arr
    # Colorfulness
    colorfulness = (np.max(rgb, axis=2) - np.min(rgb, axis=2))
    
    # Is pixel non-white? (anything with max RGB < 0.94 or significant color saturation)
    is_fg = (np.min(rgb, axis=2) < 0.93) | (colorfulness > 0.08)
    
    # Weight: combination of darkness, colorfulness, and edge definition
    weight = np.where(is_fg, (darkness * 0.45 + colorfulness * 0.40 + edges_arr * 0.40), 0.0)
    weight = np.power(weight, 1.45)
    
    # Non-white bounding box to center the figure properly
    fg_ys, fg_xs = np.where(is_fg)
    if len(fg_ys) == 0:
        ymin, ymax, xmin, xmax = 0, h, 0, w
    else:
        ymin, ymax = fg_ys.min(), fg_ys.max()
        xmin, xmax = fg_xs.min(), fg_xs.max()
        
    cy = (ymin + ymax) / 2.0
    cx = (xmin + xmax) / 2.0
    box_h = max(ymax - ymin, 20)
    box_w = max(xmax - xmin, 20)
    
    prob = weight.flatten()
    total_prob = prob.sum()
    if total_prob == 0:
        prob = np.ones_like(prob) / len(prob)
    else:
        prob = prob / total_prob
        
    indices = np.random.choice(len(prob), size=n_points, p=prob, replace=True)
    ys, xs = np.unravel_index(indices, weight.shape)
    
    # Normalized 3D coordinates centered directly on the sacred figure!
    view_scale = 5.4
    if box_h >= box_w:
        norm_y = -((ys - cy) / box_h) * view_scale
        norm_x = ((xs - cx) / box_h) * view_scale
    else:
        norm_x = ((xs - cx) / box_w) * view_scale * (box_w / box_h)
        norm_y = -((ys - cy) / box_h) * view_scale
        
    # Volumetric depth (Z)
    if name == "flute_feather":
        # Flute & feather: curved volumetric depth
        norm_z = (darkness[ys, xs] - 0.3) * z_spread + np.random.normal(0, 0.04, size=n_points)
    elif name == "hand":
        # Extended hand reaches forward in 3D (+Z) towards the viewer
        hand_reach = np.clip((norm_y + 1.0) * 0.4, -0.4, 0.7)
        norm_z = hand_reach + (darkness[ys, xs] - 0.4) * z_spread + np.random.normal(0, 0.04, size=n_points)
    else:
        norm_z = (darkness[ys, xs] - 0.4) * z_spread + np.random.normal(0, 0.05, size=n_points)
        
    # Exact original pixel RGB colors!
    rs = rgb[ys, xs, 0]
    gs = rgb[ys, xs, 1]
    bs = rgb[ys, xs, 2]
    
    data = []
    for i in range(n_points):
        data.extend([
            round(float(norm_x[i]), 4),
            round(float(norm_y[i]), 4),
            round(float(norm_z[i]), 4),
            round(float(rs[i]), 3),
            round(float(gs[i]), 3),
            round(float(bs[i]), 3)
        ])
    return data

def main():
    print(f"Extracting {N_PARTICLES} 3D vector points for each scene...")
    dataset = {
        "particle_count": N_PARTICLES,
        "stride": 6,
        "scenes": {}
    }
    
    for s in SCENES:
        img_path = os.path.join(ASSETS_DIR, s["file"])
        print(f"  Sampling: {s['name']} ({s['file']})...")
        pts = sample_scene(img_path, s["z_spread"], N_PARTICLES, s["name"])
        dataset["scenes"][s["name"]] = pts
        
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(dataset, f)
        
    size_mb = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
    print(f"Success! Generated {OUTPUT_FILE} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    main()
