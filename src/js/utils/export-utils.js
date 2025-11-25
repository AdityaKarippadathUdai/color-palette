// export-utils.js
// Utility functions to export color palette in CSS, SCSS, and JSON formats

/**
 * Sanitizes a color name to be safe for CSS variable names
 * Converts "Primary Blue!" → "primary-blue"
 * @param {string} name
 * @returns {string} Valid CSS custom property name
 */
function sanitizeCssVarName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')     // Replace any non-alphanumeric with dash
    .replace(/^-+|-+$/g, '')        // Remove leading/trailing dashes
    .replace(/-+/g, '-')            // Collapse multiple dashes
    || 'color';                     // Fallback if empty
}

/**
 * Generate CSS Custom Properties (:root block)
 * @param {Array<{name: string, hex: string}>} palette
 * @returns {string} Formatted CSS string
 */
function generateCssVars(palette) {
  if (!Array.isArray(palette) || palette.length === 0) {
    return ':root {\n  /* No colors in palette */\n}';
  }

  const lines = palette.map(item => {
    const varName = sanitizeCssVarName(item.name);
    return `  --${varName}: ${item.hex};`;
  });

  return `:root {\n${lines.join('\n')}\n}`;
}

/**
 * Generate SCSS Map
 * @param {Array<{name: string, hex: string}>} palette
 * @returns {string} Formatted SCSS map
 */
function generateScssMap(palette) {
  if (!Array.isArray(palette) || palette.length === 0) {
    return '$palette: ();';
  }

  const entries = palette.map(item => {
    const key = item.name.trim() || 'unnamed';
    return `  "${key}": ${item.hex}`;
  });

  return `$palette: (\n${entries.join(',\n')}\n);`;
}

/**
 * Generate JSON export (pretty-printed)
 * @param {Array<{name: string, hex: string}>} palette
 * @returns {string} JSON string
 */
function generateJson(palette) {
  if (!Array.isArray(palette)) {
    return '[]';
  }

  // Return clean, ordered JSON with consistent formatting
  return JSON.stringify(palette, null, 2);
}

// Export all functions
export {
  generateCssVars,
  generateScssMap,
  generateJson,
  sanitizeCssVarName
};

// CommonJS fallback
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateCssVars,
    generateScssMap,
    generateJson,
    sanitizeCssVarName
  };
}