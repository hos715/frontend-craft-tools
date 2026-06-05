const dropZone = document.getElementById('dropZone');
      const fileInput = document.getElementById('fileInput');
      const previewContainer = document.getElementById('previewContainer');
      const colorCountSlider = document.getElementById('colorCount');
      const countValue = document.getElementById('countValue');
      const extractBtn = document.getElementById('extractBtn');
      const paletteContainer = document.getElementById('paletteContainer');
      const cssOutputDiv = document.getElementById('cssOutput');
      const cssVarsPre = document.getElementById('cssVars');
      const copyCssBtn = document.getElementById('copyCssBtn');
      const statusMsg = document.getElementById('statusMsg');
      const formatButtons = document.querySelectorAll('#formatSwitch button');

      let currentImage = null;
      let currentPalette = []; // آرایه‌ای از RGB (هر کدام [r,g,b])

      // تابع تبدیل RGB به فرمت‌های مختلف
      function rgbToHex(r, g, b) {
        return (
          '#' +
          (
            (1 << 24) +
            (Math.round(r) << 16) +
            (Math.round(g) << 8) +
            Math.round(b)
          )
            .toString(16)
            .slice(1)
        );
      }
      function rgbToRgbString(r, g, b) {
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
      }
      function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b),
          min = Math.min(r, g, b);
        let h,
          s,
          l = (max + min) / 2;
        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
          h /= 6;
        }
        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      }

      let currentFormat = 'hex'; // hex, rgb, hsl

      function updatePaletteDisplay() {
        if (!currentPalette.length) return;
        paletteContainer.innerHTML = '';
        currentPalette.forEach((rgb, index) => {
          const [r, g, b] = rgb;
          let colorValue = '';
          if (currentFormat === 'hex') colorValue = rgbToHex(r, g, b);
          else if (currentFormat === 'rgb')
            colorValue = rgbToRgbString(r, g, b);
          else colorValue = rgbToHsl(r, g, b);
          const hexForPreview = rgbToHex(r, g, b); // پیش‌نمایش همیشه با رنگ واقعی (hex)
          const card = document.createElement('div');
          card.className = 'color-card';
          card.innerHTML = `
                <div class="color-preview" style="background: ${hexForPreview};"></div>
                <div class="color-value">${colorValue}</div>
                <div style="font-size:0.6rem; margin-top:4px;">${getTranslation('colorPaletteColorN', { n: index + 1 })}</div>
            `;
          card.addEventListener('click', () => {
            navigator.clipboard.writeText(colorValue);
            showMessage(getTranslation('colorPaletteCopied', { value: colorValue }));
          });
          paletteContainer.appendChild(card);
        });
        updateCssVariables();
      }

      function updateCssVariables() {
        let css = `:root {\n`;
        currentPalette.forEach((rgb, idx) => {
          const [r, g, b] = rgb;
          let colorValue = '';
          if (currentFormat === 'hex') colorValue = rgbToHex(r, g, b);
          else if (currentFormat === 'rgb')
            colorValue = rgbToRgbString(r, g, b);
          else colorValue = rgbToHsl(r, g, b);
          css += `  --color-palette-${idx + 1}: ${colorValue};\n`;
        });
        css += `}`;
        cssVarsPre.textContent = css;
        cssOutputDiv.style.display = 'block';
      }

      function showMessage(text, isError = false) {
        statusMsg.textContent = text;
        statusMsg.style.color = isError ? '#ffa2a2' : '#a3e9a4';
        setTimeout(() => {
          if (statusMsg.textContent === text) statusMsg.textContent = '';
        }, 4000);
      }

      function handleImage(file) {
        if (!file.type.startsWith('image/')) {
          showMessage(getTranslation('notImageFile'), true);
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            currentImage = img;
            previewContainer.innerHTML = `<img src="${e.target.result}" class="preview-img" alt="preview">`;
            showMessage(getTranslation('colorPaletteImageLoaded'));
          };
          img.onerror = () => showMessage(getTranslation('imageLoadError'), true);
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }

      dropZone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length) handleImage(fileInput.files[0]);
      });
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.background = '#292e4a';
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.style.background = '#1e2137';
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.background = '#1e2137';
        const file = e.dataTransfer.files[0];
        if (file) handleImage(file);
      });

      colorCountSlider.addEventListener('input', () => {
        countValue.textContent = colorCountSlider.value;
      });

      // استخراج پالت با کوانتیزاسیون (RGB صحیح)
      function extractPaletteFromImage(img, numColors) {
        let width = img.width;
        let height = img.height;
        const maxDim = 150;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const colorMap = new Map();
        const levels = 6;
        const step = 256 / levels;
        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];
          r = Math.floor(r / step) * step;
          g = Math.floor(g / step) * step;
          b = Math.floor(b / step) * step;
          // اطمینان از صحیح بودن (0,51,102,153,204,255)
          const key = `${r},${g},${b}`;
          colorMap.set(key, (colorMap.get(key) || 0) + 1);
        }
        const sorted = Array.from(colorMap.entries())
          .map(([key, count]) => {
            const [r, g, b] = key.split(',').map(Number);
            return { rgb: [r, g, b], count };
          })
          .sort((a, b) => b.count - a.count);
        const topColors = sorted.slice(0, numColors).map((item) => item.rgb);
        while (topColors.length < numColors) topColors.push([128, 128, 128]);
        return topColors;
      }

      function extractPalette() {
        if (!currentImage) {
          showMessage(getTranslation('selectImageFirst'), true);
          return;
        }
        const numColors = parseInt(colorCountSlider.value);
        showMessage(getTranslation('colorPaletteExtracting'));
        setTimeout(() => {
          try {
            const palette = extractPaletteFromImage(currentImage, numColors);
            if (!palette.length) throw new Error(getTranslation('colorPaletteNoColors'));
            currentPalette = palette;
            updatePaletteDisplay();
            showMessage(getTranslation('colorPaletteSuccess', { count: palette.length }));
          } catch (err) {
            console.error(err);
            showMessage(getTranslation('colorPaletteExtractError') + err.message, true);
          }
        }, 50);
      }

      extractBtn.addEventListener('click', extractPalette);
      copyCssBtn.addEventListener('click', () => {
        const cssText = cssVarsPre.textContent;
        navigator.clipboard
          .writeText(cssText)
          .then(() => {
            copyCssBtn.textContent = getTranslation('copySuccess');
            setTimeout(
              () => (copyCssBtn.textContent = getTranslation('copyBtn')),
              1500,
            );
          })
          .catch(() => showMessage(getTranslation('copyError'), true));
      });

      window.addEventListener('languageChanged', () => {
        if (currentPalette.length) updatePaletteDisplay();
      });

      // تغییر فرمت
      formatButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          formatButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          currentFormat = btn.getAttribute('data-format');
          if (currentPalette.length) {
            updatePaletteDisplay();
          }
        });
      });
