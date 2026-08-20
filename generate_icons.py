import os
import math
from PIL import Image, ImageDraw, ImageFilter

os.makedirs('icons', exist_ok=True)
os.makedirs('android/app/src/main/res/mipmap-hdpi', exist_ok=True)
os.makedirs('android/app/src/main/res/mipmap-mdpi', exist_ok=True)
os.makedirs('android/app/src/main/res/mipmap-xhdpi', exist_ok=True)
os.makedirs('android/app/src/main/res/mipmap-xxhdpi', exist_ok=True)
os.makedirs('android/app/src/main/res/mipmap-xxxhdpi', exist_ok=True)

def generate_master_icon(size=512):
    # Master image with high quality
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size / 2.0
    
    # 1. Background Rounded Shield / Circle with Deep Space Gradient
    # Outer Glow Ring
    for r in range(int(size * 0.49), int(size * 0.38), -3):
        pct = (r - size * 0.38) / (size * 0.11)
        alpha = int(140 * (1.0 - pct))
        draw.ellipse([center - r, center - r, center + r, center + r], 
                     fill=(0, 229, 255, alpha))
        
    for r in range(int(size * 0.46), int(size * 0.32), -4):
        pct = (r - size * 0.32) / (size * 0.14)
        alpha = int(90 * (1.0 - pct))
        draw.ellipse([center - r, center - r, center + r, center + r], 
                     fill=(255, 0, 84, alpha))

    # Base Backplate Circle
    base_r = size * 0.44
    draw.ellipse([center - base_r, center - base_r, center + base_r, center + base_r],
                 fill=(8, 14, 28, 255), outline=(0, 229, 255, 255), width=max(4, int(size * 0.022)))

    # Inner Golden Border
    gold_r = size * 0.41
    draw.ellipse([center - gold_r, center - gold_r, center + gold_r, center + gold_r],
                 outline=(255, 183, 3, 240), width=max(2, int(size * 0.012)))

    # 2. Epic Hero Shield Shape in Center
    shield_pts = [
        (center, size * 0.13),
        (size * 0.82, size * 0.22),
        (size * 0.76, size * 0.65),
        (center, size * 0.90),
        (size * 0.24, size * 0.65),
        (size * 0.18, size * 0.22)
    ]
    # Shield shading
    draw.polygon(shield_pts, fill=(12, 22, 44, 255), outline=(0, 229, 255, 255), width=max(3, int(size * 0.016)))

    inner_pts = [
        (center, size * 0.18),
        (size * 0.76, size * 0.26),
        (size * 0.70, size * 0.62),
        (center, size * 0.85),
        (size * 0.30, size * 0.62),
        (size * 0.24, size * 0.26)
    ]
    draw.polygon(inner_pts, fill=(18, 32, 64, 255), outline=(255, 183, 3, 220), width=max(2, int(size * 0.01)))

    # 3. Cosmic Knight Helmet Crest & Wings
    # Golden Wings / Horns
    left_wing = [
        (size * 0.26, size * 0.38),
        (size * 0.14, size * 0.22),
        (size * 0.32, size * 0.28),
        (size * 0.36, size * 0.44)
    ]
    right_wing = [
        (size * 0.74, size * 0.38),
        (size * 0.86, size * 0.22),
        (size * 0.68, size * 0.28),
        (size * 0.64, size * 0.44)
    ]
    draw.polygon(left_wing, fill=(255, 183, 3, 255), outline=(255, 255, 255, 255), width=max(1, int(size*0.008)))
    draw.polygon(right_wing, fill=(255, 183, 3, 255), outline=(255, 255, 255, 255), width=max(1, int(size*0.008)))

    # Knight Helmet Armor Faceplate
    helmet_pts = [
        (center, size * 0.24),
        (size * 0.66, size * 0.36),
        (size * 0.62, size * 0.60),
        (center, size * 0.74),
        (size * 0.38, size * 0.60),
        (size * 0.34, size * 0.36)
    ]
    draw.polygon(helmet_pts, fill=(28, 48, 88, 255), outline=(0, 229, 255, 255), width=max(3, int(size * 0.015)))

    # Cyber Visor (Glowing Neon Cyan + Ruby Core)
    visor_pts = [
        (size * 0.36, size * 0.42),
        (size * 0.64, size * 0.42),
        (size * 0.60, size * 0.50),
        (center, size * 0.53),
        (size * 0.40, size * 0.50)
    ]
    draw.polygon(visor_pts, fill=(0, 245, 212, 255), outline=(255, 255, 255, 255), width=max(2, int(size * 0.01)))

    # Visor Glow Line
    draw.line([(size * 0.39, size * 0.45), (size * 0.61, size * 0.45)], fill=(255, 255, 255, 255), width=max(2, int(size * 0.012)))

    # 4. Flaming Plasma Sword Centerpiece
    blade_top = (center, size * 0.12)
    blade_r = size * 0.038
    draw.polygon([blade_top, (center + blade_r, size * 0.68), (center - blade_r, size * 0.68)], fill=(0, 229, 255, 255))
    # Inner White Core Beam
    draw.line([center, size * 0.15, center, size * 0.66], fill=(255, 255, 255, 255), width=max(2, int(size * 0.018)))

    # Sword Crossguard (Royal Gold)
    draw.rounded_rectangle([center - size * 0.14, size * 0.66, center + size * 0.14, size * 0.71], radius=size * 0.02, fill=(255, 183, 3, 255), outline=(255, 255, 255, 255), width=max(1, int(size*0.006)))

    # Sword Ruby Gem Center
    gem_r = size * 0.032
    draw.ellipse([center - gem_r, size * 0.685 - gem_r, center + gem_r, size * 0.685 + gem_r], fill=(255, 0, 84, 255), outline=(255, 255, 255, 255), width=max(1, int(size*0.006)))

    # Handle & Gold Pommel
    draw.rectangle([center - size * 0.024, size * 0.71, center + size * 0.024, size * 0.81], fill=(14, 24, 48, 255))
    draw.ellipse([center - size * 0.045, size * 0.80, center + size * 0.045, size * 0.87], fill=(255, 183, 3, 255), outline=(255, 255, 255, 255), width=max(1, int(size*0.006)))

    # 5. Brilliant Sparkling Stars
    def draw_star(sx, sy, r, col=(255, 255, 255, 255)):
        draw.line([sx - r, sy, sx + r, sy], fill=col, width=max(1, int(r * 0.35)))
        draw.line([sx, sy - r, sx, sy + r], fill=col, width=max(1, int(r * 0.35)))
        draw.ellipse([sx - r * 0.3, sy - r * 0.3, sx + r * 0.3, sy + r * 0.3], fill=(255, 255, 255, 255))

    draw_star(size * 0.22, size * 0.22, size * 0.045, (0, 245, 212, 255))
    draw_star(size * 0.78, size * 0.22, size * 0.045, (0, 245, 212, 255))
    draw_star(size * 0.16, size * 0.54, size * 0.035, (255, 183, 3, 255))
    draw_star(size * 0.84, size * 0.54, size * 0.035, (255, 183, 3, 255))
    draw_star(center, size * 0.08, size * 0.05, (255, 255, 255, 255))

    return img

print("Generating ultra-deluxe icon master...")
master = generate_master_icon(512)

# Save web icons
master.save('icons/icon-512.png', 'PNG')
master.resize((192, 192), Image.Resampling.LANCZOS).save('icons/icon-192.png', 'PNG')
master.resize((192, 192), Image.Resampling.LANCZOS).save('icons/icon-maskable.png', 'PNG')
master.resize((64, 64), Image.Resampling.LANCZOS).save('icons/favicon.png', 'PNG')
master.resize((64, 64), Image.Resampling.LANCZOS).save('favicon.ico', format='ICO')

# Android Launcher Mipmaps
res_map = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

for folder, px in res_map.items():
    resized = master.resize((px, px), Image.Resampling.LANCZOS)
    resized.save(f'android/app/src/main/res/{folder}/ic_launcher.png', 'PNG')
    resized.save(f'android/app/src/main/res/{folder}/ic_launcher_round.png', 'PNG')
    resized.save(f'android/app/src/main/res/{folder}/ic_launcher_foreground.png', 'PNG')

print("All deluxe web and Android icons generated successfully!")
