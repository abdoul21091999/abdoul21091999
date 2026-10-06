#!/usr/bin/env python3
"""
HI-TECH — Préparer des photos produit au format du site (style Apple / Samsung)

Chaque photo est détourée (fond supprimé), centrée sur un carré 1000×1000
au fond gris clair #f5f5f7 avec une ombre douce, puis enregistrée en JPG.

Installation (une seule fois) :
    pip install "rembg[cpu]" pillow numpy scipy

Utilisation :
    python3 outils/preparer-photos.py  dossier_photos_brutes  img/p

Nommez chaque photo comme le produit (ex. galaxy-s25-ultra.jpg) puis indiquez
"img/p/galaxy-s25-ultra.jpg" dans le champ img du produit (js/products.js).
Conseil : utilisez de préférence les photos officielles fournies par votre
fournisseur / le fabricant, sur fond blanc.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter, ImageOps
from rembg import new_session, remove
from scipy import ndimage

SIZE, BOX = 1000, 800          # taille finale, place occupée par le produit
BG = (245, 245, 247)           # même gris que --tile dans css/style.css


def prepare(path, out, session):
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    cut = remove(im, session=session, post_process_mask=True)
    alpha = np.asarray(cut.getchannel("A"))
    lab, n = ndimage.label(alpha > 30)
    if not n:
        print("  ! produit non détecté :", path)
        return
    sizes = ndimage.sum(alpha > 30, lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= 0.04 * sizes.max()])
    cut.putalpha(Image.fromarray((alpha * keep).astype(np.uint8)))
    obj = cut.crop(cut.getchannel("A").point(lambda v: 255 if v > 30 else 0).getbbox())
    k = min(BOX / obj.width, BOX / obj.height)
    obj = obj.resize((int(obj.width * k), int(obj.height * k)), Image.LANCZOS)

    canvas = Image.new("RGBA", (SIZE, SIZE), BG + (255,))
    x, y = (SIZE - obj.width) // 2, (SIZE - obj.height) // 2
    shadow = Image.new("RGBA", obj.size, (0, 0, 0, 0))
    shadow.putalpha(obj.getchannel("A").point(lambda v: v * 60 // 255))
    layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    layer.paste(shadow, (x, y + 18), shadow)
    canvas = Image.alpha_composite(canvas, layer.filter(ImageFilter.GaussianBlur(22)))
    canvas.paste(obj, (x, y), obj)
    canvas.convert("RGB").save(out, quality=86, optimize=True)
    print("  ✓", out)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    session = new_session("birefnet-general-lite")
    for name in sorted(os.listdir(src)):
        if name.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            prepare(os.path.join(src, name), os.path.join(dst, os.path.splitext(name)[0] + ".jpg"), session)


if __name__ == "__main__":
    main()
