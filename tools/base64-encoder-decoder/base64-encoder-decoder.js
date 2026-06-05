const tabBtns = document.querySelectorAll('.tab-btn');
      const panes = {
        encode: document.getElementById('encodePane'),
        decode: document.getElementById('decodePane'),
      };
      const encodeDropZone = document.getElementById('encodeDropZone');
      const encodeFileInput = document.getElementById('encodeFileInput');
      const encodeResultDiv = document.getElementById('encodeResult');
      const base64Output = document.getElementById('base64Output');
      const copyBase64Btn = document.getElementById('copyBase64Btn');
      const downloadFromBase64Btn = document.getElementById(
        'downloadFromBase64Btn',
      );
      const encodeInfo = document.getElementById('encodeInfo');
      const base64Input = document.getElementById('base64Input');
      const decodeBtn = document.getElementById('decodeBtn');
      const decodeResultDiv = document.getElementById('decodeResult');
      const downloadDecodedBtn = document.getElementById('downloadDecodedBtn');
      const decodePreview = document.getElementById('decodePreview');
      const decodeInfo = document.getElementById('decodeInfo');

      let currentBase64Data = null;
      let currentDecodedBlob = null;
      let currentDecodedMime = null;

      function downloadBlob(blob, mime, suggestedFilename) {
        let extension = '';
        if (mime === 'application/octet-stream') {
          extension = '.heic';
        } else {
          const extMap = {
            'image/png': '.png',
            'image/jpeg': '.jpg',
            'image/webp': '.webp',
            'image/heic': '.heic',
            'application/pdf': '.pdf',
            'text/plain': '.txt',
            'application/json': '.json',
          };
          extension = extMap[mime] || '.bin';
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${suggestedFilename || 'file'}${extension}`;
        a.click();
        URL.revokeObjectURL(url);
      }

      tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          tabBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          for (const [key, pane] of Object.entries(panes)) {
            pane.classList.remove('active');
          }
          panes[tab].classList.add('active');
        });
      });

      function handleEncodeFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          base64Output.value = dataUrl;
          currentBase64Data = dataUrl;
          encodeResultDiv.style.display = 'block';
          encodeInfo.innerHTML = getTranslation('base64FileInfo', {
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            type: file.type || getTranslation('unknownType'),
          });
        };
        reader.readAsDataURL(file);
      }

      encodeDropZone.addEventListener('click', () => encodeFileInput.click());
      encodeFileInput.addEventListener('change', (e) => {
        if (encodeFileInput.files.length)
          handleEncodeFile(encodeFileInput.files[0]);
      });
      encodeDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        encodeDropZone.style.background = '#292e4a';
      });
      encodeDropZone.addEventListener('dragleave', () => {
        encodeDropZone.style.background = '#1e2137';
      });
      encodeDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        encodeDropZone.style.background = '#1e2137';
        const file = e.dataTransfer.files[0];
        if (file) handleEncodeFile(file);
      });

      copyBase64Btn.addEventListener('click', () => {
        if (!base64Output.value) return;
        navigator.clipboard
          .writeText(base64Output.value)
          .then(() => {
            copyBase64Btn.textContent = getTranslation('copySuccess');
            setTimeout(
              () => (copyBase64Btn.textContent = getTranslation('copyTextBtn')),
              1500,
            );
          })
          .catch(() => alert(getTranslation('copyError')));
      });

      downloadFromBase64Btn.addEventListener('click', () => {
        if (!currentBase64Data) return;
        const match = currentBase64Data.match(/^data:(.+?);base64,(.+)$/);
        if (match) {
          let mime = match[1];
          const base64 = match[2];
          const binary = atob(base64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++)
            array[i] = binary.charCodeAt(i);
          const blob = new Blob([array], { type: mime });
          downloadBlob(blob, mime, 'base64_export');
        } else {
          alert(getTranslation('base64InvalidFormat'));
        }
      });

      function decodeBase64ToFile(base64String) {
        let mime = 'application/octet-stream';
        let rawBase64 = base64String;
        if (base64String.includes(';base64,')) {
          const parts = base64String.match(/^data:(.+?);base64,(.+)$/);
          if (parts) {
            mime = parts[1];
            rawBase64 = parts[2];
          }
        }
        try {
          const binary = atob(rawBase64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++)
            array[i] = binary.charCodeAt(i);
          const blob = new Blob([array], { type: mime });
          currentDecodedBlob = blob;
          currentDecodedMime = mime;
          const url = URL.createObjectURL(blob);
          decodePreview.innerHTML = '';
          if (mime.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            img.style.borderRadius = '16px';
            decodePreview.appendChild(img);
          } else {
            const p = document.createElement('p');
            p.textContent = getTranslation('base64FileTypeInfo', {
              mime,
              size: (blob.size / 1024).toFixed(2),
            });
            decodePreview.appendChild(p);
          }
          decodeResultDiv.style.display = 'block';
          let infoMsg = getTranslation('base64MimeInfo', {
            mime,
            size: (blob.size / 1024).toFixed(2),
          });
          if (mime === 'application/octet-stream') {
            infoMsg += `<br>${getTranslation('base64HeicWarning')}`;
          }
          decodeInfo.innerHTML = infoMsg;
          return true;
        } catch (e) {
          alert(getTranslation('base64InvalidString') + e.message);
          return false;
        }
      }

      decodeBtn.addEventListener('click', () => {
        const input = base64Input.value.trim();
        if (!input) {
          alert(getTranslation('base64EnterString'));
          return;
        }
        decodeBase64ToFile(input);
      });

      downloadDecodedBtn.addEventListener('click', () => {
        if (!currentDecodedBlob) return;
        downloadBlob(currentDecodedBlob, currentDecodedMime, 'decoded_file');
      });
