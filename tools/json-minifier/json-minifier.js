(function () {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('status');
    const downloadBtn = document.getElementById('downloadBtn');

    let minifiedContent = null;
    let originalFileName = '';

    function minifyJSON(jsonString) {
        try {
            const obj = JSON.parse(jsonString);
            return JSON.stringify(obj);
        } catch (e) {
            throw new Error(getTranslation('jsonInvalidJsonError') || getTranslation('invalidJsonError') + e.message);
        }
    }

    function processFile(file) {
        if (!file || !file.name.toLowerCase().endsWith('.json')) {
            if (statusDiv) {
                statusDiv.innerHTML = `<span class="error">${getTranslation('jsonFileTypeError') || getTranslation('fileTypeError')}</span>`;
            }
            if (downloadBtn) {
                downloadBtn.style.display = 'none';
            }
            return;
        }

        originalFileName = file.name.replace(/\.json$/i, '');
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const original = e.target.result;
                const minified = minifyJSON(original);
                const originalSize = (original.length / 1024).toFixed(2);
                const newSize = (minified.length / 1024).toFixed(2);
                const percent = ((1 - minified.length / original.length) * 100).toFixed(1);

                if (statusDiv) {
                    statusDiv.innerHTML = `
                        <span class="success">${getTranslation('jsonStatusSuccess') || getTranslation('statusSuccess')}</span><br>
                        ${getTranslation('jsonSizeBefore') || getTranslation('sizeBefore')} ${originalSize} KB<br>
                        ${getTranslation('jsonSizeAfter') || getTranslation('sizeAfter')} ${newSize} KB<br>
                        ${getTranslation('jsonSizeSaved') || getTranslation('sizeSaved')} ${percent}%
                    `;
                }

                minifiedContent = minified;
                if (downloadBtn) {
                    downloadBtn.style.display = 'block';
                }
            } catch (err) {
                if (statusDiv) {
                    statusDiv.innerHTML = `<span class="error">❌ ${err.message}</span>`;
                }
                if (downloadBtn) {
                    downloadBtn.style.display = 'none';
                }
            }
        };

        reader.onerror = () => {
            if (statusDiv) {
                statusDiv.innerHTML = `<span class="error">${getTranslation('jsonFileReadError') || getTranslation('fileReadError')}</span>`;
            }
            if (downloadBtn) {
                downloadBtn.style.display = 'none';
            }
        };

        reader.readAsText(file);
    }

    function handleDrop(event) {
        event.preventDefault();
        if (dropZone) {
            dropZone.style.background = '#1e2137';
        }
        const file = event.dataTransfer.files[0];
        if (file) processFile(file);
    }

    function initJsonMinifier() {
        if (!dropZone || !fileInput || !statusDiv || !downloadBtn) {
            return;
        }

        translatePage();

        if (downloadBtn) {
            downloadBtn.style.display = 'none';
            downloadBtn.addEventListener('click', () => {
                if (!minifiedContent) return;
                const blob = new Blob([minifiedContent], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${originalFileName}_minified.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                if (statusDiv) {
                    statusDiv.innerHTML += `<br><span class="success">${getTranslation('jsonDownloadStarted') || getTranslation('downloadStarted')} ${a.download}</span>`;
                }
            });
        }

        if (dropZone) {
            dropZone.addEventListener('click', () => fileInput && fileInput.click());
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.style.background = '#292e4a';
            });
            dropZone.addEventListener('dragleave', () => {
                dropZone.style.background = '#1e2137';
            });
            dropZone.addEventListener('drop', handleDrop);
        }

        if (fileInput) {
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length) processFile(fileInput.files[0]);
            });
        }
    }

    initJsonMinifier();
})();
