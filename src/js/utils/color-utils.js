// color-utils.js
// A lightweight, dependency-free color conversion utility module

/**
 * Converts a hex color (with or without #) to RGB object
 * @param {string} hex - Hex color string (e.g. "#ff5733" or "ff5733")
 * @returns {{r: number, g: number, b: number} | null} RGB object or null if invalid
 */
function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;

  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Handle shorthand hex (e.g. #f03 → #ff0033)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  if (hex.length !== 6) return null;

  const validHex = /^[0-9A-Fa-f]{6}$/.test(hex);
  if (!validHex) return null;

  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

/**
 * Converts RGB values to hex string (without #)
 * @param {number} r - Red (0–255)
 * @param {number} g - Green (0–255)
 * @param {number} b - Blue (0–255)
 * @returns {string | null} Hex string (e.g. "ff5733") or null if invalid
 */
function rgbToHex(r, g, b) {
  if (
    typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number' ||
    r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 ||
    !Number.isInteger(r) || !Number.isInteger(g) || !Number.isInteger(b)
  ) {
    return null;
  }

  return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0').toLowerCase();
}

/**
 * Converts RGB to HSL
 * @param {number} r - Red (0–255)
 * @param {number} g - Green (0–255)
 * @param {number} b - Blue (0–255)
 * @returns {{h: number, s: number, l: number}} HSL values (h: 0–360, s/l: 0–100)
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Converts hex directly to HSL
 * @param {string} hex - Valid hex color
 * @returns {{h: number, s: number, l: number} | null}
 */
function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

// Export all functions (ES Modules + CommonJS compatible)
export {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hexToHsl
};

// For older environments or script tag usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { hexToRgb, rgbToHex, rgbToHsl, hexToHsl };
}