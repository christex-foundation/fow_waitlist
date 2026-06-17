import sharp from 'sharp'

// Crop the transparent-background portrait tight to its subject.
const SRC = 'public/hero-portrait_no_bg.png'
const OUT = 'public/hero-portrait.png'
const ALPHA_MIN = 16 // treat alpha above this as "subject"
const PAD = 8 // px of transparent padding to keep around the subject

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info

let minX = W,
  minY = H,
  maxX = 0,
  maxY = 0
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (data[(y * W + x) * C + 3] > ALPHA_MIN) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
}

minX = Math.max(0, minX - PAD)
minY = Math.max(0, minY - PAD)
maxX = Math.min(W - 1, maxX + PAD)
maxY = Math.min(H - 1, maxY + PAD)
const cw = maxX - minX + 1
const ch = maxY - minY + 1
console.log(`source ${W}x${H} → crop ${cw}x${ch} at (${minX},${minY})  ratio ${(cw / ch).toFixed(3)}`)

await sharp(SRC)
  .ensureAlpha()
  .extract({ left: minX, top: minY, width: cw, height: ch })
  .png({ compressionLevel: 9 })
  .toFile(OUT)

console.log(`wrote ${OUT}`)
