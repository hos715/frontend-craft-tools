// ---------- عناصر DOM ----------
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const generateBtn = document.getElementById('generateBtn');
    const statusDiv = document.getElementById('statusMsg');
    const resultArea = document.getElementById('resultArea');
    const htmlCodePre = document.getElementById('htmlCode');
    const manifestCodePre = document.getElementById('manifestCode');
    const iconPreviewList = document.getElementById('iconPreviewList');
    const downloadZipBtn = document.getElementById('downloadZipBtn');

    let uploadedImage = null;       // HTMLImageElement
    let generatedBlobs = new Map();  // نام فایل -> Blob
    let manifestObject = null;

    // سایزهای استاندارد
    const iconSizes = [16, 32, 57, 72, 96, 120, 144, 152, 180, 192, 384, 512];

    // نمایش پیام
    function showStatus(text, type = 'success') {
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = type === 'error' ? `❌ ${text}` : (type === 'warning' ? `⚠️ ${text}` : `✅ ${text}`);
        statusDiv.className = `status ${type === 'error' ? 'error' : (type === 'warning' ? 'warning' : 'success')}`;
        setTimeout(() => {
            if (statusDiv.innerHTML === `✅ ${text}` || statusDiv.innerHTML === `❌ ${text}` || statusDiv.innerHTML === `⚠️ ${text}`)
                statusDiv.style.display = 'none';
        }, 5000);
    }

    function handleImage(file) {
        if (!file.type.startsWith('image/')) {
            showStatus(getTranslation('notImageFile'), 'error');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // محدودیت جدید: حداقل 256x256
                if (img.width < 256 || img.height < 256) {
                    showStatus(getTranslation('faviconDimError', { w: img.width, h: img.height }), 'error');
                    uploadedImage = null;
                    previewContainer.innerHTML = '';
                    return;
                }
                uploadedImage = img;
                previewContainer.innerHTML = `<img src="${e.target.result}" class="preview-img" style="max-width:100%; max-height:150px; border-radius:20px;">`;
                showStatus(getTranslation('faviconImageLoaded', { w: img.width, h: img.height }), 'success');
                
                // هشدار در صورت کوچک بودن برای سایزهای بزرگ
                if (img.width < 512 || img.height < 512) {
                    showStatus(getTranslation('faviconUpscaleWarning'), 'warning');
                }
            };
            img.onerror = () => showStatus(getTranslation('imageLoadError'), 'error');
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length) handleImage(fileInput.files[0]);
    });
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.background = '#292e4a'; });
    dropZone.addEventListener('dragleave', () => { dropZone.style.background = '#1e2137'; });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.background = '#1e2137';
        const file = e.dataTransfer.files[0];
        if (file) handleImage(file);
    });

    // تبدیل تصویر به سایز مشخص (Promise<Blob>)
    function resizeImageToBlob(img, size, format = 'image/png') {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            // برای حفظ نسبت ابعاد (تصویر مربعی می‌کشیم)
            ctx.drawImage(img, 0, 0, size, size);
            canvas.toBlob(blob => resolve(blob), format, 1.0);
        });
    }

    // ساخت favicon.ico واقعی از یک تصویر PNG (سایز 32)
    async function createIcoFromBlob(pngBlob, size = 32) {
        const buffer = await pngBlob.arrayBuffer();
        const pngData = new Uint8Array(buffer);
        const iconHeader = new ArrayBuffer(6);
        const iconDir = new DataView(iconHeader);
        iconDir.setUint16(0, 0, true);      // Reserved
        iconDir.setUint16(2, 1, true);      // Type: 1 = ICO
        iconDir.setUint16(4, 1, true);      // Count: 1 image
        
        const entryHeader = new ArrayBuffer(16);
        const entry = new DataView(entryHeader);
        entry.setUint8(0, size);
        entry.setUint8(1, size);
        entry.setUint8(2, 0);
        entry.setUint8(3, 0);
        entry.setUint16(4, 1, true);
        entry.setUint16(6, 32, true);
        const imageSize = pngData.byteLength;
        entry.setUint32(8, imageSize, true);
        entry.setUint32(12, 6 + 16, true);
        
        const finalBuffer = new ArrayBuffer(iconHeader.byteLength + entryHeader.byteLength + imageSize);
        const finalView = new Uint8Array(finalBuffer);
        finalView.set(new Uint8Array(iconHeader), 0);
        finalView.set(new Uint8Array(entryHeader), 6);
        finalView.set(pngData, 6 + 16);
        
        return new Blob([finalBuffer], { type: 'image/x-icon' });
    }

    async function generateAll() {
        if (!uploadedImage) {
            showStatus(getTranslation('faviconSelectImage256'), 'error');
            return;
        }

        showStatus(getTranslation('faviconGenerating'), 'success');
        
        generatedBlobs.clear();
        // تولید PNG برای هر سایز
        for (let sz of iconSizes) {
            const blob = await resizeImageToBlob(uploadedImage, sz);
            generatedBlobs.set(`favicon-${sz}x${sz}.png`, blob);
        }
        // ساخت favicon.ico از سایز 32px
        const png32Blob = generatedBlobs.get('favicon-32x32.png');
        if (png32Blob) {
            const icoBlob = await createIcoFromBlob(png32Blob, 32);
            generatedBlobs.set('favicon.ico', icoBlob);
        }
        
        // آماده‌سازی manifest.json
        const manifest = {
            name: document.getElementById('appName').value,
            short_name: document.getElementById('shortName').value,
            description: document.getElementById('appDesc').value,
            start_url: ".",
            display: document.getElementById('displayMode').value,
            orientation: document.getElementById('orientation').value,
            theme_color: document.getElementById('themeColor').value,
            background_color: document.getElementById('bgColor').value,
            icons: [
                { src: "favicon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
                { src: "favicon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
            ]
        };
        manifestObject = manifest;
        
        // کد HTML
        let htmlLink = `<!-- Favicon -->\n`;
        htmlLink += `<link rel="icon" type="image/x-icon" href="favicon.ico">\n`;
        for (let sz of iconSizes) {
            htmlLink += `<link rel="icon" type="image/png" sizes="${sz}x${sz}" href="favicon-${sz}x${sz}.png">\n`;
        }
        htmlLink += `<!-- Manifest -->\n<link rel="manifest" href="manifest.json">\n`;
        htmlLink += `<!-- Theme color -->\n<meta name="theme-color" content="${manifest.theme_color}">`;
        
        htmlCodePre.textContent = htmlLink;
        manifestCodePre.textContent = JSON.stringify(manifest, null, 2);
        
        // پیش‌نمایش
        iconPreviewList.innerHTML = '';
        for (let sz of [32, 72, 192, 512]) {
            const blob = generatedBlobs.get(`favicon-${sz}x${sz}.png`);
            if (blob) {
                const url = URL.createObjectURL(blob);
                const div = document.createElement('div');
                div.className = 'icon-preview';
                div.innerHTML = `<img src="${url}" alt="${sz}px"><div>${sz}px</div>`;
                iconPreviewList.appendChild(div);
            }
        }
        
        resultArea.style.display = 'block';
        showStatus(getTranslation('faviconGenerateSuccess'));
    }

    generateBtn.addEventListener('click', generateAll);
    
    downloadZipBtn.addEventListener('click', async () => {
        if (generatedBlobs.size === 0 || !manifestObject) {
            showStatus(getTranslation('faviconGenerateFirst'), 'error');
            return;
        }
        const zip = new JSZip();
        for (let [filename, blob] of generatedBlobs.entries()) {
            zip.file(filename, blob);
        }
        zip.file("manifest.json", JSON.stringify(manifestObject, null, 2));

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement('a');
        const url = URL.createObjectURL(content);
        link.href = url;
        link.download = "favicon_pack.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showStatus(getTranslation('faviconZipDownloaded'));
    });
