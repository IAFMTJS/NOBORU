/**
 * Character sticker post-processing for the art pipeline.
 * Removes baked black backgrounds and trims transparent padding.
 */
import { copyFile } from "node:fs/promises";
import sharp from "sharp";

export const CHARACTER_STICKER_CONFIG = {
  /** Pixels at or below this RGB level connected to the border are keyed out. */
  luminanceKeyMax: 40,
  /** Alpha trim sensitivity when cropping transparent margins. */
  trimThreshold: 1,
  /** Transparent padding restored after trim so soft edges are not clipped. */
  paddingPx: 12,
  webpQuality: 90,
};

export function isCharacterStickerPath(relativePath) {
  return relativePath.replace(/\\/g, "/").includes("characters/");
}

/**
 * Flood-fills near-black opaque pixels connected to the image border.
 * Safe on assets that already have transparent corners (no-op).
 */
export function removeBakedBackgroundRgba(
  data,
  width,
  height,
  channels = 4,
  luminanceKeyMax = CHARACTER_STICKER_CONFIG.luminanceKeyMax,
) {
  if (channels < 4) {
    return 0;
  }

  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total * 2);
  let queueLength = 0;

  const isKeyable = (offset) => {
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const a = data[offset + 3];
    return a > 0 && r <= luminanceKeyMax && g <= luminanceKeyMax && b <= luminanceKeyMax;
  };

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }
    const index = y * width + x;
    if (visited[index]) {
      return;
    }
    visited[index] = 1;
    queue[queueLength++] = x;
    queue[queueLength++] = y;
  };

  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }

  let removed = 0;

  for (let head = 0; head < queueLength; head += 2) {
    const x = queue[head];
    const y = queue[head + 1];
    const index = y * width + x;
    const offset = index * channels;

    if (!isKeyable(offset)) {
      continue;
    }

    data[offset + 3] = 0;
    removed += 1;

    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  return removed;
}

/**
 * @param {import("sharp").Sharp | Buffer | string} input
 * @param {Partial<typeof CHARACTER_STICKER_CONFIG>} [options]
 * @returns {Promise<import("sharp").Sharp>}
 */
export async function processCharacterSticker(input, options = {}) {
  const config = { ...CHARACTER_STICKER_CONFIG, ...options };
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const processed = Buffer.from(data);
  removeBakedBackgroundRgba(
    processed,
    info.width,
    info.height,
    info.channels,
    config.luminanceKeyMax,
  );

  let pipeline = sharp(processed, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  });

  const trimmedBuffer = await pipeline
    .png()
    .toBuffer()
    .then((buffer) =>
      sharp(buffer).trim({ threshold: config.trimThreshold }).png().toBuffer(),
    );

  pipeline = sharp(trimmedBuffer);

  if (config.paddingPx > 0) {
    pipeline = pipeline.extend({
      top: config.paddingPx,
      bottom: config.paddingPx,
      left: config.paddingPx,
      right: config.paddingPx,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }

  return pipeline;
}

/**
 * @param {import("sharp").Sharp} image
 * @param {{ pngOut: string; webpOut: string; publicWebp: string }} outputs
 */
export async function writeCharacterStickerOutputs(image, outputs) {
  const { pngOut, webpOut, publicWebp } = outputs;
  const { webpQuality } = CHARACTER_STICKER_CONFIG;

  await image
    .clone()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(pngOut);

  await image
    .clone()
    .webp({
      quality: webpQuality,
      effort: 4,
      alphaQuality: 100,
      lossless: false,
    })
    .toFile(webpOut);

  await copyFile(webpOut, publicWebp);
}
