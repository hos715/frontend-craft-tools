const dropzone = document.getElementById('dropzone');
      const fileInput = document.getElementById('fileInput');
      const qualitySlider = document.getElementById('qualitySlider');
      const qualityValue = document.getElementById('qualityValue');
      const convertBtn = document.getElementById('convertBtn');
      const statusDiv = document.getElementById('status');
      const previewContainer = document.getElementById('previewContainer');

      let selectedFiles = [];

      qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = qualitySlider.value + '%';
      });

      // باز کردن انتخاب فایل
      dropzone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length) {
          selectedFiles = Array.from(fileInput.files).filter(
            (f) => f.type === 'image/png',
          );
          if (selectedFiles.length === 0) {
            statusDiv.innerHTML =
              '<span class="error">❌ فقط فایل‌های PNG قابل قبول هستند.</span>';
            return;
          }
          statusDiv.innerHTML = `<span class="success">✅ ${selectedFiles.length} فایل PNG انتخاب شد. آماده تبدیل.</span>`;
          // نمایش پیش‌نمایش کوچک
          previewContainer.innerHTML = '';
          selectedFiles.forEach((file, idx) => {
            const url = URL.createObjectURL(file);
            const div = document.createElement('div');
            div.className = 'preview-card';
            div.innerHTML = `
                    <img src="${url}" class="preview-img" style="height:100px; object-fit:contain;">
                    <div class="info-text">${file.name} (${(file.size / 1024).toFixed(1)} KB)</div>
                `;
            previewContainer.appendChild(div);
            URL.revokeObjectURL(url); // آزادسازی حافظه بعد از ساخت img
            // اما img از url استفاده می‌کند و اگر revoke کنیم تصویر حذف می‌شود. روش بهتر:
            // برای هر تصویر یک blob URL نگه داریم. اصلاحی سریع:
          });
          // اصلاح: آدرس blob را نگه داریم تا نمایش داده شود. من دوباره شیوه بهتری می‌نویسم:
          // برای سادگی فعلاً دوباره نمایش را با یک حلقه درست انجام می‌دهیم:
          setTimeout(() => refreshPreviews(), 10);
        }
      });

      function refreshPreviews() {
        previewContainer.innerHTML = '';
        selectedFiles.forEach((file) => {
          const url = URL.createObjectURL(file);
          const div = document.createElement('div');
          div.className = 'preview-card';
          div.innerHTML = `
                <img src="${url}" class="preview-img" style="height:100px; object-fit:contain;">
                <div class="info-text">${file.name} (${(file.size / 1024).toFixed(1)} KB)</div>
            `;
          previewContainer.appendChild(div);
          // note: URL.revokeObjectURL بعد از لود تصویر نباید سریع بزنیم، صبر می‌کنیم تا صفحه بسته شود. اشکالی ندارد.
        });
      }

      // تبدیل یک فایل PNG به WebP و دانلود
      async function convertToWebP(file, quality) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const objectUrl = URL.createObjectURL(file);
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(
                    new Error(
                      'تبدیل به WebP ناموفق (مرورگر از WebP پشتیبانی نمی‌کند؟)',
                    ),
                  );
                }
                URL.revokeObjectURL(objectUrl);
              },
              'image/webp',
              quality / 100,
            );
          };
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('خطا در بارگذاری تصویر'));
          };
          img.src = objectUrl;
        });
      }

      convertBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) {
          statusDiv.innerHTML =
            '<span class="error">⚠️ ابتدا فایل PNG انتخاب کن.</span>';
          return;
        }

        const quality = parseInt(qualitySlider.value, 10);
        statusDiv.innerHTML = `<span class="success">🔄 در حال تبدیل ${selectedFiles.length} فایل به WebP با کیفیت ${quality}% ...</span>`;

        let successCount = 0;
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          try {
            const webpBlob = await convertToWebP(file, quality);
            const downloadUrl = URL.createObjectURL(webpBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            const newName = file.name.replace(/\.png$/i, '.webp');
            a.download = newName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            const originalSize = file.size;
            const newSize = webpBlob.size;
            const percent = ((1 - newSize / originalSize) * 100).toFixed(1);
            statusDiv.innerHTML += `<br>✅ ${newName} — ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB ( -${percent}% )`;
            successCount++;
          } catch (err) {
            statusDiv.innerHTML += `<br><span class="error">❌ خطا در ${file.name}: ${err.message}</span>`;
          }
        }
        if (successCount === selectedFiles.length) {
          statusDiv.innerHTML += `<br><span class="success">🎉 همه فایل‌ها با موفقیت تبدیل و دانلود شدند.</span>`;
        }
      });

      // درگ و دراپ
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.background = '#292e4a';
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.style.background = '#1e2137';
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.background = '#1e2137';
        const files = Array.from(e.dataTransfer.files).filter(
          (f) => f.type === 'image/png',
        );
        if (files.length === 0) {
          statusDiv.innerHTML =
            '<span class="error">❌ فقط فایل PNG قابل قبول است.</span>';
          return;
        }
        selectedFiles = files;
        statusDiv.innerHTML = `<span class="success">✅ ${selectedFiles.length} فایل PNG با درگ و دراپ افزوده شد.</span>`;
        refreshPreviews();
      });
