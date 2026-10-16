import fs from "fs";
import path from "path";
import zlib from "zlib";

function createPng(width, height, getPixel) {
  const rowSize = 1 + width * 4;
  const raw = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }
  const compressed = zlib.deflateSync(raw);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, "ascii");
    const crcBuf = Buffer.concat([t, data]);
    const crc = Buffer.alloc(4);
    let c = 0xffffffff;
    for (let i = 0; i < crcBuf.length; i++) {
      c ^= crcBuf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
      }
    }
    crc.writeInt32BE(~c, 0);
    return Buffer.concat([len, t, data, crc]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

// Icon generator logic with Islamic geometric ring & gold Kaaba / minaret emblem
function renderIconPixel(x, y, w, h) {
  const nx = (x / w) * 2 - 1; // -1 to 1
  const ny = (y / h) * 2 - 1; // -1 to 1
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Background gradient: midnight blue to deep navy
  const t = (ny + 1) * 0.5;
  let r = Math.round(7 + t * 6);
  let g = Math.round(19 + t * 15);
  let b = Math.round(40 + t * 30);
  let a = 255;

  // Outer Gold Border Ring
  if (dist >= 0.82 && dist <= 0.88) {
    const ringT = 1 - Math.abs(dist - 0.85) / 0.03;
    r = Math.round(r * (1 - ringT) + 212 * ringT);
    g = Math.round(g * (1 - ringT) + 175 * ringT);
    b = Math.round(b * (1 - ringT) + 55 * ringT);
  }

  // Inner Thin Gold Ring
  if (dist >= 0.74 && dist <= 0.77) {
    const ringT = 1 - Math.abs(dist - 0.755) / 0.015;
    r = Math.round(r * (1 - ringT) + 245 * ringT);
    g = Math.round(g * (1 - ringT) + 215 * ringT);
    b = Math.round(b * (1 - ringT) + 120 * ringT);
  }

  // Central Gold Kaaba Cube emblem
  // Kaaba box: nx from -0.32 to 0.32, ny from -0.15 to 0.45
  if (nx >= -0.32 && nx <= 0.32 && ny >= -0.15 && ny <= 0.45) {
    // Kaaba body
    r = 18;
    g = 22;
    b = 32;

    // Kiswah Gold Band (Hizam)
    if (ny >= -0.05 && ny <= 0.05) {
      r = 218;
      g = 180;
      b = 60;
    }
    // Gold Door (Bab ar-Rahman)
    if (nx >= 0.08 && nx <= 0.22 && ny >= 0.12 && ny <= 0.45) {
      r = 235;
      g = 195;
      b = 75;
    }
    // Cube border outline
    if (
      Math.abs(nx - -0.32) < 0.02 ||
      Math.abs(nx - 0.32) < 0.02 ||
      Math.abs(ny - -0.15) < 0.02 ||
      Math.abs(ny - 0.45) < 0.02
    ) {
      r = 212;
      g = 175;
      b = 55;
    }
  }

  // Crescent Moon on top
  // Center of moon at nx = 0, ny = -0.42, radius 0.22
  const cdx = nx;
  const cdy = ny - -0.40;
  const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

  // Inner cut circle offset slightly to right
  const cutdx = nx - 0.07;
  const cutdy = ny - -0.43;
  const cutdist = Math.sqrt(cutdx * cutdx + cutdy * cutdy);

  if (cdist <= 0.20 && cutdist >= 0.16) {
    r = 245;
    g = 215;
    b = 110;
  }

  // Five-point star next to crescent
  const sdx = nx - 0.13;
  const sdy = ny - -0.47;
  const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
  if (sdist <= 0.04) {
    r = 255;
    g = 230;
    b = 130;
  }

  return [r, g, b, a];
}

const outDir = path.resolve("./public/icons");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("Generating 192x192 PWA Icon...");
const icon192 = createPng(192, 192, renderIconPixel);
fs.writeFileSync(path.join(outDir, "icon-192.png"), icon192);

console.log("Generating 512x512 PWA Icon...");
const icon512 = createPng(512, 512, renderIconPixel);
fs.writeFileSync(path.join(outDir, "icon-512.png"), icon512);

// Also copy to apple-touch-icon
fs.writeFileSync(path.resolve("./public/apple-touch-icon.png"), icon192);

console.log("PWA Icons created successfully!");
