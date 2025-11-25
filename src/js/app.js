// src/js/app.js
// Main app – uses ES6 modules + correct relative paths

import { createColorCard } from './components/color-card.js';
import { openModal } from './components/export-modal.js';

let palette = [];

// DOM Elements
const colorPicker = document.getElementById('colorPicker');
const hexInput = document.getElementById('hexInput');
const colorNameInput = document.getElementById('colorName');
const currentHexSpan = document.getElementById('currentHex');
const addColorBtn = document.getElementById('addColorBtn');
const paletteGrid = document.getElementById('paletteGrid');
const emptyState = document.getElementById('emptyState');
const colorCount = document.getElementById('colorCount');
const exportBtn = document.getElementById('exportBtn');

// === Sync Color Inputs ===
function syncInputs() {
  const hex = colorPicker.value.toUpperCase();
  hexInput.value = hex;
  currentHexSpan.textContent = hex;
}

colorPicker.addEventListener('input', syncInputs);
hexInput.addEventListener('input', (e) => {
  const val = e.target.value.trim();
  if (/^#[0-9A-F]{6}$/i.test(val)) {
    colorPicker.value = val;
    syncInputs();
  }
});
syncInputs();

// === Add Color ===
function addColor() {
  let hex = hexInput.value.trim().toUpperCase();
  let name = colorNameInput.value.trim() || `color-${palette.length + 1}`;

  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    alert('Please enter a valid hex color (e.g. #6366F1)');
    return;
  }

  if (palette.some(c => c.hex.toUpperCase() === hex)) {
    alert('This color is already in your palette!');
    return;
  }

  palette.push({ name, hex });
  colorNameInput.value = '';
  colorNameInput.focus();

  renderPalette();
  updateFooter();
}

// === Render Palette using Reusable Component ===
function renderPalette() {
  paletteGrid.innerHTML = '';

  if (palette.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  palette.forEach((color, index) => {
    const card = createColorCard(color, index, {
      onCopy: (text, msg) => showToast(msg || 'Copied!'),
      onDelete: (idx) => {
        palette.splice(idx, 1);
        renderPalette();
        updateFooter();
      }
    });
    paletteGrid.appendChild(card);
  });
}

// === Footer Update ===
function updateFooter() {
  colorCount.textContent = palette.length;
  exportBtn.disabled = palette.length === 0;
}

// === Toast Feedback ===
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
    background:#1e293b;color:white;padding:0.75rem 1.5rem;
    border-radius:999px;font-size:0.9rem;z-index:10000;
    animation:fadeInOut 2.5s forwards;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// Inject toast animation (once)
document.head.insertAdjacentHTML('beforeend', `
  <style>
    @keyframes fadeInOut {
      0%,100%{opacity:0;transform:translateX(-50%)translateY(10px)}
      15%,85%{opacity:1;transform:translateX(-50%)translateY(0)}
    }
  </style>
`);

// === Export Button → Opens Beautiful Modal (from export-modal.js) ===
exportBtn.addEventListener('click', () => {
  if (palette.length > 0) {
    openModal(palette);
  }
});

// === Enter Key Support ===
[colorNameInput, hexInput].forEach(input => {
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addColor();
    }
  });
});

// === Add Button ===
addColorBtn.addEventListener('click', addColor);

// === Initialize App ===
renderPalette();
updateFooter();