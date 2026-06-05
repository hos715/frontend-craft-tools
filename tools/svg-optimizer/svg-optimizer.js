// DOM elements
      const dropZone = document.getElementById('dropZone');
      const fileInput = document.getElementById('fileInput');
      const inputSvg = document.getElementById('inputSvg');
      const outputPre = document.getElementById('outputSvg');
      const statsDiv = document.getElementById('stats');
      const optimizeBtn = document.getElementById('optimizeBtn');
      const copyOutputBtn = document.getElementById('copyOutputBtn');
      const downloadBtn = document.getElementById('downloadBtn');

      // گزینه‌ها
      const optRemoveComments = document.getElementById('optRemoveComments');
      const optRemoveMetadata = document.getElementById('optRemoveMetadata');
      const optMinifyWhitespace = document.getElementById(
        'optMinifyWhitespace',
      );
      const optRoundNumbers = document.getElementById('optRoundNumbers');
      const optRemoveEmptyTags = document.getElementById('optRemoveEmptyTags');
      const optRemoveDoctype = document.getElementById('optRemoveDoctype');

      let currentOptimized = '';
      let originalFileName = ''; // نام فایل اصلی (بدون پسوند)

      // آپلود فایل
      function handleFile(file) {
        if (!file || !file.name.endsWith('.svg')) {
          alert(getTranslation('svgSelectValid'));
          return;
        }
        originalFileName = file.name.replace(/\.svg$/i, ''); // حذف پسوند .svg
        const reader = new FileReader();
        reader.onload = (e) => {
          inputSvg.value = e.target.result;
          optimizeSVG();
        };
        reader.readAsText(file);
      }

      dropZone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length) handleFile(fileInput.files[0]);
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
        if (file) handleFile(file);
      });

      // اگر کاربر در textarea کد رو paste کرد، originalFileName رو خالی می‌کنیم تا دانلود با اسم پیش‌فرض انجام بشه
      inputSvg.addEventListener('input', () => {
        // اگر کاربر دستی چیزی نوشت یا paste کرد، دیگه اسم فایل رو نداریم
        if (inputSvg.value.trim() !== '') {
          originalFileName = '';
        }
      });

      // توابع بهینه‌سازی (همون قبل)
      function optimizeSVG() {
        let svg = inputSvg.value;
        if (!svg.trim()) {
          outputPre.textContent = getTranslation('svgNoInput');
          statsDiv.innerHTML = '';
          currentOptimized = '';
          return;
        }

        const originalSize = svg.length;

        // 1. حذف DOCTYPE
        if (optRemoveDoctype.checked) {
          svg = svg.replace(/<!DOCTYPE[^>]*>/gi, '');
        }

        // 2. حذف کامنت‌ها
        if (optRemoveComments.checked) {
          svg = svg.replace(/<!--[\s\S]*?-->/g, '');
        }

        // 3. حذف تگ‌های متادیتا
        if (optRemoveMetadata.checked) {
          svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
          svg = svg.replace(/<sodipodi:[^>]*>[\s\S]*?<\/sodipodi:[^>]*>/gi, '');
          svg = svg.replace(/<inkscape:[^>]*>[\s\S]*?<\/inkscape:[^>]*>/gi, '');
          svg = svg.replace(/\s+(sodipodi|inkscape):[a-zA-Z-]+="[^"]*"/gi, '');
        }

        // 4. حذف تگ‌های خالی
        if (optRemoveEmptyTags.checked) {
          svg = svg.replace(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*><\/\1>/g, '');
          svg = svg.replace(/<([a-zA-Z][a-zA-Z0-9]*)\s*\/>/g, (match, tag) => {
            if (match.includes('=')) return match;
            return '';
          });
        }

        // 5. گرد کردن اعداد
        if (optRoundNumbers.checked) {
          svg = svg.replace(/\b(\d+(?:\.\d+)?)\b/g, (match) => {
            let num = parseFloat(match);
            if (isNaN(num)) return match;
            if (Number.isInteger(num)) return match;
            let rounded = Math.round(num * 1000) / 1000;
            return rounded.toString();
          });
        }

        // 6. حذف فضاهای اضافی (minify)
        if (optMinifyWhitespace.checked) {
          svg = svg.replace(/>\s+</g, '><');
          svg = svg.replace(/^\s+|\s+$/g, '');
          svg = svg.replace(/\s*\n\s*/g, '');
          svg = svg.replace(/\s{2,}/g, ' ');
        }

        const newSize = svg.length;
        const percent = ((1 - newSize / originalSize) * 100).toFixed(1);
        statsDiv.innerHTML = `
            <span class="stat-badge">${getTranslation('svgSizeBefore', { size: (originalSize / 1024).toFixed(2) })}</span>
            <span class="stat-badge">${getTranslation('svgSizeAfter', { size: (newSize / 1024).toFixed(2) })}</span>
            <span class="stat-badge">${getTranslation('svgSizeReduced', { percent })}</span>
        `;
        outputPre.textContent = svg;
        currentOptimized = svg;
      }

      optimizeBtn.addEventListener('click', optimizeSVG);
      copyOutputBtn.addEventListener('click', () => {
        if (!currentOptimized) {
          alert(getTranslation('svgOptimizeFirst'));
          return;
        }
        navigator.clipboard
          .writeText(currentOptimized)
          .then(() => {
            copyOutputBtn.textContent = getTranslation('copySuccess');
            setTimeout(() => {
              copyOutputBtn.textContent = getTranslation('svgCopyOutputBtn');
            }, 1500);
          })
          .catch(() => alert(getTranslation('copyError')));
      });
      downloadBtn.addEventListener('click', () => {
        if (!currentOptimized) {
          alert(getTranslation('svgOptimizeFirst'));
          return;
        }
        let downloadName = 'optimized.svg';
        if (originalFileName) {
          downloadName = `${originalFileName}-optimized.svg`;
        }
        const blob = new Blob([currentOptimized], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
