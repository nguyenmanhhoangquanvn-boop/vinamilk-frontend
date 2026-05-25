import urllib.request
import struct
import zlib

def get_png_bottom_padding_pct(url):
    """Download PNG and measure transparent bottom rows as % of height"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=10).read()
        
        # Parse PNG manually
        if data[:8] != b'\x89PNG\r\n\x1a\n':
            return None, "Not a PNG"
        
        pos = 8
        chunks = {}
        while pos < len(data):
            length = struct.unpack('>I', data[pos:pos+4])[0]
            chunk_type = data[pos+4:pos+8].decode('ascii')
            chunk_data = data[pos+8:pos+8+length]
            chunks[chunk_type] = chunk_data
            pos += 12 + length
        
        # IHDR
        w, h, bit_depth, color_type = struct.unpack('>IIBB', chunks['IHDR'][:10])
        
        # We need RGBA (color_type 6) or RGB+Alpha
        if color_type not in (4, 6):
            return None, f"Color type {color_type} has no alpha"
        
        # Decompress IDAT
        idat = b''
        for k, v in chunks.items():
            if k == 'IDAT':
                idat += v
        raw = zlib.decompress(idat)
        
        channels = 4 if color_type == 6 else 2
        stride = w * channels + 1  # +1 for filter byte
        
        # Scan from bottom up
        bottom_padding = 0
        for row in range(h-1, -1, -1):
            row_start = row * stride + 1  # skip filter byte
            has_visible = False
            for x in range(w):
                alpha = raw[row_start + x * channels + (channels - 1)]
                if alpha > 30:
                    has_visible = True
                    break
            if has_visible:
                bottom_padding = h - 1 - row
                break
        
        pct = bottom_padding / h * 100
        return pct, f"{bottom_padding}px / {h}px = {pct:.1f}%"
    except Exception as e:
        return None, str(e)

products = [
    ("16 static (loc sua chua)", "https://d8um25gjecm9v.cloudfront.net/cms/SCA_GF_ID_01_3f2afca818_286c5123ee.png"),
    ("10 static (bottle)",       "https://d8um25gjecm9v.cloudfront.net/cms/SCUTT_GF_thanhtrung_ID_01_a64a385623_923869557f.png"),
    ("18 static (sua hat)",      "https://d8um25gjecm9v.cloudfront.net/cms/STV_9_loai_hat_ID_1_Lvuong_01_61c68ca928_f405e33f93.png"),
    ("17 static (green farm)",   "https://d8um25gjecm9v.cloudfront.net/cms/GF_CD_180ml_01_e23b453767.png"),
]

for name, url in products:
    pct, info = get_png_bottom_padding_pct(url)
    print(name + ": " + info)
