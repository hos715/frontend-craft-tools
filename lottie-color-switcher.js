(function () {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const fileStatusDiv = document.getElementById('fileStatus');
    const colorPanel = document.getElementById('colorPanel');
    const colorTableBody = document.getElementById('colorTableBody');
    const applyBtn = document.getElementById('applyBtn');
    const resetMappingBtn = document.getElementById('resetMappingBtn');
    const actionStatus = document.getElementById('actionStatus');

    let originalJsonObject = null;
    let uniqueColorsList = [];
    let currentMapping = new Map();

    function formatString(str, vars = {}) {
        return str.replace(/\{(.*?)\}/g, (_, key) => vars[key] || '');
    }

    function showStatus(msg, isError = false) {
        if (!actionStatus) return;
        actionStatus.innerHTML = msg;
        actionStatus.className = `status ${isError ? 'error' : 'success'}`;
        setTimeout(() => {
            if (actionStatus.innerHTML === msg) {
                actionStatus.innerHTML = '';
            }
        }, 4000);
    }

    function isRgbaArray(value) {
        return Array.isArray(value) && value.length === 4 && value.every(v => typeof v === 'number' && v >= 0 && v <= 1);
    }

    function isHexString(value) {
        return typeof value === 'string' && /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
    }

    function rgbaArrayToHex(arr) {
        const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
        return `#${toHex(arr[0])}${toHex(arr[1])}${toHex(arr[2])}`;
    }

    function hexToRgbaArray(hex) {
        let h = hex.slice(1);
        if (h.length === 3) h = h.split('').map(c => c + c).join('');
        if (h.length !== 6) return [0, 0, 0, 1];
        const r = parseInt(h.slice(0, 2), 16) / 255;
        const g = parseInt(h.slice(2, 4), 16) / 255;
        const b = parseInt(h.slice(4, 6), 16) / 255;
        return [r, g, b, 1];
    }

    function getColorKey(value) {
        if (isRgbaArray(value)) {
            return `rgba(${value.map(v => Math.round(v * 255)).join(',')})`;
        }
        if (isHexString(value)) {
            return value.toLowerCase();
        }
        if (typeof value === 'string' && value.startsWith('rgba')) {
            return value.toLowerCase().replace(/\s/g, '');
        }
        return null;
    }

    function extractAllColors(obj, colorSet = new Set()) {
        if (obj === null || typeof obj !== 'object') return colorSet;

        if (isRgbaArray(obj)) {
            const key = getColorKey(obj);
            if (key) colorSet.add(JSON.stringify({ type: 'array', value: obj, key }));
        } else if (isHexString(obj)) {
            const key = getColorKey(obj);
            if (key) colorSet.add(JSON.stringify({ type: 'hex', value: obj, key }));
        }

        if (Array.isArray(obj)) {
            for (let item of obj) {
                extractAllColors(item, colorSet);
            }
        } else {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    extractAllColors(obj[prop], colorSet);
                }
            }
        }

        return colorSet;
    }

    function replaceColorsDeep(obj, mappingMap) {
        if (obj === null || typeof obj !== 'object') return obj;

        if (isRgbaArray(obj)) {
            const key = getColorKey(obj);
            if (key && mappingMap.has(key)) {
                let newVal = mappingMap.get(key);
                if (typeof newVal === 'string' && isHexString(newVal)) {
                    return hexToRgbaArray(newVal);
                } else if (Array.isArray(newVal) && isRgbaArray(newVal)) {
                    return [...newVal];
                } else if (typeof newVal === 'string' && newVal.startsWith('rgba')) {
                    const match = newVal.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                    if (match) {
                        return [match[1] / 255, match[2] / 255, match[3] / 255, match[4] ? parseFloat(match[4]) : 1];
                    }
                }
                return obj;
            }
        } else if (isHexString(obj)) {
            const key = getColorKey(obj);
            if (key && mappingMap.has(key)) {
                let newVal = mappingMap.get(key);
                if (typeof newVal === 'string' && isHexString(newVal)) {
                    return newVal.toLowerCase();
                } else if (Array.isArray(newVal) && isRgbaArray(newVal)) {
                    return rgbaArrayToHex(newVal);
                }
                return obj;
            }
        }

        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                obj[i] = replaceColorsDeep(obj[i], mappingMap);
            }
        } else {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    obj[prop] = replaceColorsDeep(obj[prop], mappingMap);
                }
            }
        }

        return obj;
    }

    function resetMappingToOriginal() {
        if (!uniqueColorsList.length) return;
        uniqueColorsList.forEach((colorItem) => {
            if (colorItem.type === 'array') {
                currentMapping.set(colorItem.displayKey, rgbaArrayToHex(colorItem.originalValue));
            } else {
                currentMapping.set(colorItem.displayKey, colorItem.originalValue);
            }
        });
        renderColorTable();
        showStatus(getTranslation('lottieResetSuccess'));
    }

    function renderColorTable() {
        if (!colorTableBody) return;
        colorTableBody.innerHTML = '';

        uniqueColorsList.forEach((item) => {
            const previewOldHex = item.type === 'array' ? rgbaArrayToHex(item.originalValue) : item.originalValue;
            const currentNewValue = currentMapping.get(item.displayKey) || (item.type === 'array' ? rgbaArrayToHex(item.originalValue) : item.originalValue);
            const tr = document.createElement('tr');

            const tdPreview = document.createElement('td');
            const previewBox = document.createElement('div');
            previewBox.className = 'color-preview-old';
            previewBox.style.backgroundColor = previewOldHex;
            tdPreview.appendChild(previewBox);

            const tdOldVal = document.createElement('td');
            tdOldVal.innerHTML = `<code class="badge">${item.displayKey}</code><br><span style="font-size:11px;">${item.type === 'array' ? JSON.stringify(item.originalValue) : item.originalValue}</span>`;

            const tdType = document.createElement('td');
            tdType.innerHTML = getTranslation(item.type === 'array' ? 'lottieColorTypeArray' : 'lottieColorTypeHex');

            const tdNew = document.createElement('td');
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.value = isHexString(currentNewValue) ? currentNewValue : '#9d6cab';
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.className = 'new-color-input';
            textInput.value = currentNewValue;
            textInput.placeholder = getTranslation('lottieNewColorPlaceholder');

            const updateMapping = () => {
                let newColor = textInput.value.trim();
                if (!newColor) newColor = colorPicker.value;
                if (isHexString(newColor) || /^rgba?\(/i.test(newColor)) {
                    currentMapping.set(item.displayKey, newColor);
                    showStatus(`🔁 ${item.displayKey} → ${newColor}`);
                } else if (/^[0-9A-Fa-f]{6}$/.test(newColor)) {
                    newColor = `#${newColor}`;
                    currentMapping.set(item.displayKey, newColor);
                    textInput.value = newColor;
                    showStatus(`✅ ${newColor}`);
                } else {
                    showStatus(getTranslation('lottieInvalidColorFormat', { value: newColor }), true);
                    return;
                }
                colorPicker.value = isHexString(currentMapping.get(item.displayKey)) ? currentMapping.get(item.displayKey) : '#9d6cab';
                textInput.value = currentMapping.get(item.displayKey);
            };

            colorPicker.addEventListener('input', () => {
                textInput.value = colorPicker.value;
                updateMapping();
            });
            textInput.addEventListener('change', updateMapping);

            tdNew.appendChild(colorPicker);
            tdNew.appendChild(textInput);

            const tdAction = document.createElement('td');
            const resetRowBtn = document.createElement('button');
            resetRowBtn.textContent = '↺';
            resetRowBtn.style.background = '#2d3142';
            resetRowBtn.style.padding = '6px 12px';
            resetRowBtn.addEventListener('click', () => {
                const originalDefault = item.type === 'array' ? rgbaArrayToHex(item.originalValue) : item.originalValue;
                currentMapping.set(item.displayKey, originalDefault);
                renderColorTable();
                showStatus(getTranslation('lottieResetRowMessage', { displayKey: item.displayKey }));
            });
            tdAction.appendChild(resetRowBtn);

            tr.appendChild(tdPreview);
            tr.appendChild(tdOldVal);
            tr.appendChild(tdType);
            tr.appendChild(tdNew);
            tr.appendChild(tdAction);
            colorTableBody.appendChild(tr);
        });
    }

    function loadJsonFile(file) {
        if (!file || !file.name.toLowerCase().endsWith('.json')) {
            alert(getTranslation('lottieChooseFileError'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonContent = e.target.result;
                const jsonObj = JSON.parse(jsonContent);
                originalJsonObject = jsonObj;

                if (fileStatusDiv) {
                    fileStatusDiv.style.display = 'inline-block';
                    fileStatusDiv.innerHTML = getTranslation('lottieFileStatusTemplate', {
                        name: file.name,
                        size: (jsonContent.length / 1024).toFixed(1)
                    });
                }

                const colorSet = extractAllColors(jsonObj);
                uniqueColorsList = Array.from(colorSet).map((itemStr) => {
                    const parsed = JSON.parse(itemStr);
                    return {
                        type: parsed.type,
                        originalValue: parsed.value,
                        displayKey: parsed.key,
                    };
                });

                currentMapping.clear();
                uniqueColorsList.forEach((item) => {
                    currentMapping.set(item.displayKey, item.type === 'array' ? rgbaArrayToHex(item.originalValue) : item.originalValue);
                });

                if (colorPanel) {
                    colorPanel.style.display = 'block';
                }
                renderColorTable();
                showStatus(getTranslation('lottieColorDetectedMessage', { count: uniqueColorsList.length }));
            } catch (err) {
                alert(getTranslation('lottieInvalidJsonAlert') + err.message);
                console.error(err);
            }
        };
        reader.readAsText(file);
    }

    function initLottieSwitcher() {
        translatePage();

        if (uploadZone) {
            uploadZone.addEventListener('click', () => fileInput && fileInput.click());
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.background = '#292e4a';
            });
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.style.background = '#1e2137';
            });
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.background = '#1e2137';
                const file = e.dataTransfer.files[0];
                if (file && file.name.endsWith('.json')) {
                    loadJsonFile(file);
                } else {
                    alert(getTranslation('lottieChooseFileError'));
                }
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', () => {
                if (fileInput.files.length) {
                    loadJsonFile(fileInput.files[0]);
                }
            });
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                if (!originalJsonObject) {
                    alert(getTranslation('lottieNoFileUploaded'));
                    return;
                }

                const finalReplaceMap = new Map();
                uniqueColorsList.forEach((item) => {
                    const newColorRaw = currentMapping.get(item.displayKey);
                    if (!newColorRaw) return;

                    let finalNewValue = null;
                    if (isHexString(newColorRaw)) {
                        finalNewValue = item.type === 'array' ? hexToRgbaArray(newColorRaw) : newColorRaw.toLowerCase();
                    } else if (typeof newColorRaw === 'string' && /^rgba?/i.test(newColorRaw)) {
                        const match = newColorRaw.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                        if (match) {
                            finalNewValue = [match[1] / 255, match[2] / 255, match[3] / 255, match[4] ? parseFloat(match[4]) : 1];
                        }
                    } else if (Array.isArray(newColorRaw) && newColorRaw.length === 4) {
                        finalNewValue = newColorRaw;
                    }

                    if (finalNewValue !== null) {
                        finalReplaceMap.set(item.displayKey, finalNewValue);
                    }
                });

                const newJsonObj = JSON.parse(JSON.stringify(originalJsonObject));
                try {
                    replaceColorsDeep(newJsonObj, finalReplaceMap);
                    const outputJsonStr = JSON.stringify(newJsonObj, null, 2);
                    const blob = new Blob([outputJsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'lottie_updated_colors.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    showStatus(getTranslation('lottieSuccessDownload'));
                } catch (e) {
                    showStatus(getTranslation('lottieReplaceError') + e.message, true);
                }
            });
        }

        if (resetMappingBtn) {
            resetMappingBtn.addEventListener('click', resetMappingToOriginal);
        }

        console.log(getTranslation('lottieConsoleReady'));
    }

    initLottieSwitcher();
})();
