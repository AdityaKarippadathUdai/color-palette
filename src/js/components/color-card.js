// color-card.js
// Reusable Color Card Component

/**
 * Creates a complete, interactive color card element
 * @param {{ name: string, hex: string }} colorObject
 * @param {number} index - Index in palette (used for delete callback)
 * @param {Object} callbacks - Optional event handlers
 * @param {Function} callbacks.onCopy - Called when copy is triggered
 * @param {Function} callbacks.onDelete - Called with index when delete is clicked
 * @returns {HTMLElement} Fully functional color card <div>
 */
function createColorCard(colorObject, index, callbacks = {}) {
  const { name, hex } = colorObject;

  // Create main card container
  const card = document.createElement('div');
  card.className = 'color-card';
  card.dataset.index = index;

  // Sanitize name for CSS variable preview (optional display)
  const cssVarName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'color';

  card.innerHTML = `
    <div class="color-swatch" style="background: ${hex}">
      <button class="delete-btn" aria-label="Delete color" title="Remove">
        ×
      </button>
    </div>
    <div class="color-info">
      <div class="color-name" title="Click to copy CSS variable">
        ${escapeHtml(name)}
      </div>
      <div class="color-hex" title="Click to copy HEX">
        ${hex}
      </div>
      <button class="copy-btn" title="Copy HEX">
        Copy
      </button>
    </div>
  `;

  // Event: Copy HEX on swatch or hex text click
  const swatch = card.querySelector('.color-swatch');
  const hexText = card.querySelector('.color-hex');
  const copyBtn = card.querySelector('.copy-btn');

  const handleCopyHex = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex);
    if (callbacks.onCopy) callbacks.onCopy(hex, 'HEX copied!');
  };

  swatch.addEventListener('click', handleCopyHex);
  hexText.addEventListener('click', handleCopyHex);
  copyBtn.addEventListener('click', handleCopyHex);

  // Event: Copy CSS Variable name
  const nameEl = card.querySelector('.color-name');
  nameEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const cssVar = `--${cssVarName}`;
    navigator.clipboard.writeText(cssVar);
    if (callbacks.onCopy) callbacks.onCopy(cssVar, `Copied: ${cssVar}`);
  });

  // Event: Delete
  const deleteBtn = card.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (callbacks.onDelete) {
      callbacks.onDelete(index);
    }
  });

  // Hover effect enhancement
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-8px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });

  return card;
}

// Simple HTML escape utility
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Export (ES6 + CommonJS)
export { createColorCard };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createColorCard };
}