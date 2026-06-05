const dropZone = document.getElementById('dropZone');
      const fileInput = document.getElementById('fileInput');
      const qualityRange = document.getElementById('qualityRange');
      const qualityNum = document.getElementById('qualityNum');
      const outputFormat = document.getElementById('outputFormat');
      const compressBtn = document.getElementById('compressBtn');
      const previewArea = document.getElementById('previewArea');
      const originalImg = document.getElementById('originalImg');
      const compressedImg = document.getElementById('compressedImg');
      const originalSizeSpan = document.getElementById('originalSize');
      const compressedSizeSpan = document.getElementById('compressedSize');
      const downloadBtn = document.getElementById('downloadBtn');
      const statusMsg = document.getElementById('statusMsg');

      let originalFile = null;
      let compressedBlob = null;

      function showMessage(text, isError = false) {
        statusMsg.style.display = 'block';
        statusMsg.textContent = text;
        statusMsg.style.color = isError ? '#ffa2a2' : '#a3e9a4';
        setTimeout(() => {
          if (statusMsg.textContent === text) statusMsg.style.display = 'none';
        }, 4000);
      }

      qualityRange.addEventListener('input', () => {
        qualityNum.value = qualityRange.value;
      });
      qualityNum.addEventListener('input', () => {
        let val = parseInt(qualityNum.value);
        if (isNaN(val)) val = 85;
        val = Math.min(100, Math.max(10, val));
        qualityRange.value = val;
        qualityNum.value = val;
      });

      function handleFile(file) {
        if (!file.type.startsWith('image/')) {
          showMessage(getTranslation('notImageFile'), true);
          return;
        }
        originalFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          originalImg.src = e.target.result;
          originalSizeSpan.innerHTML = getTranslation('imageCompressorSizeInfo', {
            size: (file.size / 1024).toFixed(2),
          });
          previewArea.style.display = 'block';
          showMessage(getTranslation('imageCompressorLoaded'));
        };
        reader.onerror = () => showMessage(getTranslation('imageLoadError'), true);
        reader.readAsDataURL(file);
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

      async function compressImage() {
        if (!originalFile) {
          showMessage(getTranslation('selectImageFirst'), true);
          return;
        }
        const quality = parseInt(qualityRange.value) / 100;
        const format = outputFormat.value;

        const img = await new Promise((resolve, reject) => {
          const imgEl = new Image();
          imgEl.onload = () => resolve(imgEl);
          imgEl.onerror = () => reject(new Error(getTranslation('imageLoadError')));
          imgEl.src = URL.createObjectURL(originalFile);
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, format, quality);
        });

        URL.revokeObjectURL(img.src);

        if (!blob) {
          showMessage(getTranslation('imageCompressorError'), true);
          return;
        }

        compressedBlob = blob;
        const compressedUrl = URL.createObjectURL(blob);
        compressedImg.src = compressedUrl;
        compressedSizeSpan.innerHTML = getTranslation('imageCompressorReduced', {
          size: (blob.size / 1024).toFixed(2),
          percent: ((1 - blob.size / originalFile.size) * 100).toFixed(1),
        });
        showMessage(getTranslation('imageCompressorSuccess'));
      }

      compressBtn.addEventListener('click', compressImage);

      downloadBtn.addEventListener('click', () => {
        if (!compressedBlob) {
          showMessage(getTranslation('imageCompressorCompressFirst'), true);
          return;
        }
        const link = document.createElement('a');
        let ext = '.jpg';
        if (outputFormat.value === 'image/webp') ext = '.webp';
        else if (outputFormat.value === 'image/png') ext = '.png';
        link.download = `compressed_${Date.now()}${ext}`;
        link.href = URL.createObjectURL(compressedBlob);
        link.click();
        URL.revokeObjectURL(link.href);
      });
