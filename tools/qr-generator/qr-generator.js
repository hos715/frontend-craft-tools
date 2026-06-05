const qrText = document.getElementById('qrText');
      const qrSize = document.getElementById('qrSize');
      const sizeValue = document.getElementById('sizeValue');
      const qrCorrection = document.getElementById('qrCorrection');
      const generateBtn = document.getElementById('generateBtn');
      const previewArea = document.getElementById('previewArea');
      const qrCanvas = document.getElementById('qrCanvas');
      const downloadBtn = document.getElementById('downloadBtn');
      const statusMsg = document.getElementById('statusMsg');

      function showMessage(text, isError = false) {
        statusMsg.textContent = text;
        statusMsg.style.color = isError ? '#ffa2a2' : '#a3e9a4';
        setTimeout(() => {
          if (statusMsg.textContent === text) statusMsg.textContent = '';
        }, 3000);
      }

      function generateQR() {
        let text = qrText.value.trim();
        if (!text) {
          showMessage(getTranslation('qrEnterText'), true);
          return;
        }
        const correctionLevel = qrCorrection.value; // L, M, Q, H
        // حداکثر ظرفیت QR با سطح تصحیح (برای ورودی طولانی خطا می‌دهد، ولی سعی می‌کنیم)
        let qr;
        try {
          qr = qrcode(0, correctionLevel);
          qr.addData(text);
          qr.make();
        } catch (e) {
          showMessage(getTranslation('qrTextTooLong'), true);
          return;
        }
        const cellSize = qrSize.value / qr.getModuleCount();
        const size = qr.getModuleCount() * cellSize;

        qrCanvas.width = size;
        qrCanvas.height = size;
        const ctx = qrCanvas.getContext('2d');

        // پس‌زمینه سفید
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // رسم ماژول‌های سیاه
        ctx.fillStyle = '#000000';
        for (let row = 0; row < qr.getModuleCount(); row++) {
          for (let col = 0; col < qr.getModuleCount(); col++) {
            if (qr.isDark(row, col)) {
              ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
          }
        }

        previewArea.style.display = 'block';
        showMessage(getTranslation('qrSuccess'));
      }

      function downloadQR() {
        if (!qrCanvas.width) {
          showMessage(getTranslation('qrGenerateFirst'), true);
          return;
        }
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = qrCanvas.toDataURL('image/png');
        link.click();
        showMessage(getTranslation('qrDownloaded'));
      }

      qrSize.addEventListener('input', () => {
        sizeValue.textContent = qrSize.value + 'px';
        if (qrCanvas.width) generateQR();
      });
      qrCorrection.addEventListener('change', () => {
        if (qrCanvas.width) generateQR();
      });
      generateBtn.addEventListener('click', generateQR);
      downloadBtn.addEventListener('click', downloadQR);

      // تولید اولیه
      generateQR();
