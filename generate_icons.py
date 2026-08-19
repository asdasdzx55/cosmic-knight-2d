import os
import math
from PIL import Image, ImageDraw

os.makedirs('icons', exist_ok=True)

def generate_icon(size, filename, is_maskable=False):
    # High-res image with dark cyber gradient
    img = Image.new('RGBA', (size, size), (7, 11, 20, 255))
    draw = ImageDraw.Draw(img)
    
    # Outer ambient glow / gradient circles
    center = size / 2
    for r in range(int(size * 0.46), int(size * 0.25), -4):
        alpha = int(120 * (1.0 - (r - size * 0.25) / (size * 0.21)))
        draw.ellipse([center - r, center - r, center + r, center + r], 
                     fill=(0, 229, 255, alpha))
        
    # Dark shield backplate
    shield_pts = [
        (center, size * 0.16),
        (size * 0.78, size * 0.24),
        (size * 0.74, size * 0.62),
        (center, size * 0.88),
        (size * 0.26, size * 0.62),
        (size * 0.22, size * 0.24)
    ]
    draw.polygon(shield_pts, fill=(14, 22, 40, 255), outline=(0, 229, 255, 255), width=max(2, int(size * 0.02)))

    # Inner cyber shield border
    inner_shield = [
        (center, size * 0.22),
        (size * 0.72, size * 0.28),
        (size * 0.68, size * 0.58),
        (center, size * 0.82),
        (size * 0.32, size * 0.58),
        (size * 0.28, size * 0.28)
    ]
    draw.polygon(inner_shield, fill=(20, 32, 60, 255), outline=(255, 183, 3, 220), width=max(1, int(size * 0.012)))

    # Glowing Sword Emblem in Center
    # Blade
    blade_top = (center, size * 0.26)
    blade_left = (center - size * 0.045, size * 0.60)
    blade_right = (center + size * 0.045, size * 0.60)
    draw.polygon([blade_top, blade_right, blade_left], fill=(0, 229, 255, 255))
    
    # Inner blade light
    draw.line([center, size * 0.28, center, size * 0.58], fill=(255, 255, 255, 255), width=max(1, int(size * 0.015)))

    # Crossguard (Gold)
    draw.rectangle([center - size * 0.12, size * 0.60, center + size * 0.12, size * 0.64], fill=(255, 183, 3, 255))

    # Hilt & Pommel
    draw.rectangle([center - size * 0.025, size * 0.64, center + size * 0.025, size * 0.72], fill=(255, 46, 99, 255))
    draw.ellipse([center - size * 0.045, size * 0.72, center + size * 0.045, size * 0.78], fill=(255, 183, 3, 255))

    # Four Cosmic Sparkles / Stars
    def draw_star(sx, sy, star_r):
        draw.line([sx - star_r, sy, sx + star_r, sy], fill=(255, 255, 255, 255), width=max(1, int(size * 0.008)))
        draw.line([sx, sy - star_r, sx, sy + star_r], fill=(255, 255, 255, 255), width=max(1, int(size * 0.008)))

    draw_star(size * 0.32, size * 0.36, size * 0.05)
    draw_star(size * 0.68, size * 0.36, size * 0.05)
    draw_star(size * 0.50, size * 0.18, size * 0.04)

    img.save(filename, 'PNG')
    print(f"Generated: {filename} ({size}x{size})")

generate_icon(192, 'icons/icon-192.png')
generate_icon(512, 'icons/icon-512.png')
generate_icon(512, 'icons/icon-maskable.png', is_maskable=True)
generate_icon(64, 'icons/favicon.png')

# Save ICO
img_64 = Image.open('icons/favicon.png')
img_64.save('favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("Generated: favicon.ico")
