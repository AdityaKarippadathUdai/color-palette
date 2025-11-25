// export-modal.js
// Reusable Export Modal with Tabs (CSS / SCSS / JSON)

// src/js/components/export-modal.js
import { generateCssVars, generateScssMap, generateJson } from '../utils/export-utils.js';
/**
 * Opens the export modal and populates it with palette data
 * @param {Array<{name: string, hex: string}>} palette
 */
function openModal(palette) {
  // Remove existing modal if present
  closeModal();

  const modalHTML = `
    <div id="exportModalOverlay" class="export-modal-overlay">
      <div class="export-modal" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
        <div class="modal-header">
          <h2 id="modalTitle">Export Palette</h2>
          <button id="closeModalBtn" class="close-btn" aria-label="Close modal">×</button>
        </div>

        <div class="modal-tabs">
          <button class="tab-btn active" data-tab="css">CSS Variables</button>
          <button class="tab-btn" data-tab="scss">SCSS Map</button>
          <button class="tab-btn" data-tab="json">JSON</button>
        </div>

        <div class="modal-content">
          <textarea id="exportOutput" readonly spellcheck="false"></textarea>
          <button id="copyAllBtn" class="copy-all-btn">Copy All</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Inject CSS if not already added
  if (!document.getElementById('export-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'export-modal-styles';
    style.textContent = getModalStyles();
    document.head.appendChild(style);
  }

  // Cache elements
  const overlay = document.getElementById('exportModalOverlay');
  const textarea = document.getElementById('exportOutput');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const copyBtn = document.getElementById('copyAllBtn');
  const closeBtn = document.getElementById('closeModalBtn');

  // Generate content for each format
  const formats = {
    css: generateCssVars(palette),
    scss: generateScssMap(palette),
    json: generateJson(palette)
  };

  // Set initial content
  textarea.value = formats.css;

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const format = btn.dataset.tab;
      textarea.value = formats[format];
    });
  });

  // Copy All
  copyBtn.addEventListener('click', () => {
    textarea.select();
    navigator.clipboard.writeText(textarea.value).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy All', 2000);
    });
  });

  // Close modal
  const closeHandler = () => closeModal();
  closeBtn.addEventListener('click', closeHandler);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeHandler();
  });

  // ESC key
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') {
      closeHandler();
      document.removeEventListener('keydown', handler);
    }
  });

  // Focus management
  textarea.focus();
}

/**
 * Closes and removes the modal
 */
function closeModal() {
  const overlay = document.getElementById('exportModalOverlay');
  if (overlay) {
    overlay.remove();
  }
}

/**
 * Inline CSS for the modal (beautiful, modern, accessible)
 */
function getModalStyles() {
  return `
    .export-modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-out;
    }

    .export-modal {
      width: 90%;
      max-width: 720px;
      max-height: 90vh;
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      animation: slideUp 0.4s ease-out;
    }

    .modal-header {
      padding: 1.5rem 2rem;
      background: #1e293b;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      transition: background 0.2s;
    }

    .close-btn:hover {
      background: rgba(255,255,255,0.2);
    }

    .modal-tabs {
      display: flex;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .tab-btn {
      flex: 1;
      padding: 1rem;
      border: none;
      background: none;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: white;
      color: #3b82f6;
      border-bottom: 3px solid #3b82f6;
    }

    .tab-btn:hover:not(.active) {
      background: #e2e8f0;
    }

    .modal-content {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    #exportOutput {
      width: 100%;
      min-height: 320px;
      padding: 1rem;
      font-family: 'Menlo', 'Consolas', monospace;
      font-size: 0.95rem;
      line-height: 1.6;
      background: #0f172a;
      color: #e2e8f0;
      border: none;
      border-radius: 1rem;
      resize: vertical;
    }

    .copy-all-btn {
      align-self: flex-end;
      padding: 0.75rem 1.5rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 999px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .copy-all-btn:hover {
      background: #059669;
      transform: translateY(-2px);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
}

// Export functions
export { openModal, closeModal };

// CommonJS fallback
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { openModal, closeModal };
}