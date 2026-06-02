const startCameraBtn = document.getElementById('startCameraBtn');
      const stopCameraBtn = document.getElementById('stopCameraBtn');
      const readerDiv = document.getElementById('reader');
      const uploadArea = document.getElementById('uploadArea');
      const fileInput = document.getElementById('fileInput');
      const resultArea = document.getElementById('resultArea');
      const qrResultText = document.getElementById('qrResultText');
      const copyResultBtn = document.getElementById('copyResultBtn');
      const statusMsg = document.getElementById('statusMsg');

      let html5QrCode = null;
      let isScanning = false;

      function showMessage(text, isError = false) {
        statusMsg.textContent = text;
        statusMsg.style.color = isError ? '#ffa2a2' : '#a3e9a4';
        setTimeout(() => {
          if (statusMsg.textContent === text) statusMsg.textContent = '';
        }, 4000);
      }

      async function startCamera() {
        if (isScanning) {
          showMessage('دوربین قبلاً روشن است');
          return;
        }
        if (!html5QrCode) {
          html5QrCode = new Html5Qrcode('reader');
        }
        readerDiv.style.display = 'block';
        try {
          await html5QrCode.start(
            { facingMode: 'environment' }, // دوربین عقب
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            (decodedText, decodedResult) => {
              // موفقیت
              showMessage('✅ QR کد با موفقیت اسکن شد');
              displayResult(decodedText);
              stopCamera(); // اختیاری: بعد از اولین اسکن دوربین را ببند
            },
            (errorMessage) => {
              // خطاهای عادی (مثل پیدا نشدن QR) را نادیده می‌گیریم
              // console.log(errorMessage);
            },
          );
          isScanning = true;
          showMessage('دوربین روشن شد. QR کد را در کادر قرار دهید.');
        } catch (err) {
          console.error(err);
          showMessage('خطا در دسترسی به دوربین: ' + err.message, true);
          readerDiv.style.display = 'none';
        }
      }

      async function stopCamera() {
        if (html5QrCode && isScanning) {
          try {
            await html5QrCode.stop();
            readerDiv.style.display = 'none';
            isScanning = false;
            showMessage('دوربین متوقف شد');
          } catch (err) {
            console.error(err);
          }
        } else {
          readerDiv.style.display = 'none';
          isScanning = false;
        }
      }

      function displayResult(text) {
        qrResultText.textContent = text;
        resultArea.style.display = 'block';
      }

      // آپلود تصویر و اسکن با jsQR (روش دوم برای فایل)
      async function scanImageFile(file) {
        if (!file) return;
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          // استفاده از jsQR (نیاز به لود کتابخانه)
          if (typeof jsQR === 'undefined') {
            // اگر jsQR لود نشد، از html5-qrcode برای اسکن از تصویر استفاده کنیم
            const html5Scanner = new Html5Qrcode('reader-temp', {
              verbose: false,
            });
            html5Scanner
              .scanFile(file, true)
              .then((decodedText) => {
                displayResult(decodedText);
                showMessage('✅ اسکن از تصویر موفق بود');
              })
              .catch((err) => {
                console.error(err);
                showMessage('QR کدی در تصویر پیدا نشد', true);
              });
            URL.revokeObjectURL(objectUrl);
            return;
          }
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          URL.revokeObjectURL(objectUrl);
          if (code) {
            displayResult(code.data);
            showMessage('✅ اسکن از تصویر موفق بود');
          } else {
            showMessage('QR کدی در تصویر پیدا نشد', true);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          showMessage('خطا در بارگذاری تصویر', true);
        };
        img.src = objectUrl;
      }

      // لود داینامیک jsQR برای پشتیبانی بهتر از فایل
      function loadJsQR() {
        return new Promise((resolve, reject) => {
          if (typeof jsQR !== 'undefined') resolve();
          const script = document.createElement('script');
          script.src =
            'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('خطا در لود jsQR'));
          document.head.appendChild(script);
        });
      }

      uploadArea.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', async (e) => {
        if (fileInput.files.length) {
          const file = fileInput.files[0];
          if (!file.type.startsWith('image/')) {
            showMessage('لطفاً یک فایل تصویری انتخاب کنید', true);
            return;
          }
          showMessage('در حال اسکن تصویر...');
          try {
            await loadJsQR();
            await scanImageFile(file);
          } catch (err) {
            // fallback به html5-qrcode
            const html5Scanner = new Html5Qrcode('reader-temp');
            html5Scanner
              .scanFile(file, true)
              .then((decodedText) => {
                displayResult(decodedText);
                showMessage('✅ اسکن از تصویر موفق بود');
              })
              .catch((err2) => {
                console.error(err2);
                showMessage('QR کدی در تصویر پیدا نشد', true);
              });
          }
        }
      });

      startCameraBtn.addEventListener('click', startCamera);
      stopCameraBtn.addEventListener('click', stopCamera);
      copyResultBtn.addEventListener('click', () => {
        const text = qrResultText.textContent;
        if (!text) return;
        navigator.clipboard
          .writeText(text)
          .then(() => {
            const old = copyResultBtn.textContent;
            copyResultBtn.textContent = '✅ کپی شد!';
            setTimeout(() => (copyResultBtn.textContent = old), 1500);
          })
          .catch(() => showMessage('خطا در کپی', true));
      });
