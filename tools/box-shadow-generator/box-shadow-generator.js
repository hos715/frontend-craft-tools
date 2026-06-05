// آرایه ذخیره سایه‌ها
      let shadows = [];

      // عناصر
      const shadowsContainer = document.getElementById('shadowsContainer');
      const addShadowBtn = document.getElementById('addShadowBtn');
      const previewBox = document.getElementById('previewBox');
      const cssOutput = document.getElementById('cssOutput');
      const copyBtn = document.getElementById('copyBtn');

      // تابع تولید یک سایه جدید (با مقادیر پیش‌فرض)
      function createShadowObject() {
        return {
          offsetX: 10,
          offsetY: 10,
          blur: 20,
          spread: 0,
          color: '#000000',
          opacity: 0.3,
          inset: false,
        };
      }

      // به‌روزرسانی نمایش سایه‌ها در UI
      function renderShadows() {
        shadowsContainer.innerHTML = '';
        shadows.forEach((shadow, index) => {
          const shadowDiv = document.createElement('div');
          shadowDiv.className = 'shadow-item';
          shadowDiv.innerHTML = `
                <div class="shadow-header">
                    <strong>${getTranslation('shadowTitle', { n: index + 1 })}</strong>
                    <button class="remove-shadow" data-index="${index}">${getTranslation('removeBtn')}</button>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:10px;">
                    <div style="flex:1">
                        <label>offset-x</label>
                        <div class="slider-row">
                            <input type="range" class="shadow-offsetX" data-index="${index}" min="-50" max="50" value="${shadow.offsetX}" step="1">
                            <input type="number" class="shadow-offsetX-num" data-index="${index}" value="${shadow.offsetX}" step="1">
                        </div>
                    </div>
                    <div style="flex:1">
                        <label>offset-y</label>
                        <div class="slider-row">
                            <input type="range" class="shadow-offsetY" data-index="${index}" min="-50" max="50" value="${shadow.offsetY}" step="1">
                            <input type="number" class="shadow-offsetY-num" data-index="${index}" value="${shadow.offsetY}" step="1">
                        </div>
                    </div>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:8px;">
                    <div style="flex:1">
                        <label>blur</label>
                        <div class="slider-row">
                            <input type="range" class="shadow-blur" data-index="${index}" min="0" max="100" value="${shadow.blur}" step="1">
                            <input type="number" class="shadow-blur-num" data-index="${index}" value="${shadow.blur}" step="1">
                        </div>
                    </div>
                    <div style="flex:1">
                        <label>spread</label>
                        <div class="slider-row">
                            <input type="range" class="shadow-spread" data-index="${index}" min="-50" max="50" value="${shadow.spread}" step="1">
                            <input type="number" class="shadow-spread-num" data-index="${index}" value="${shadow.spread}" step="1">
                        </div>
                    </div>
                </div>
                <div class="color-row" style="margin-top:8px;">
                    <div style="flex:1">
                        <label>${getTranslation('colorLabel')}</label>
                        <input type="color" class="shadow-color" data-index="${index}" value="${shadow.color}">
                    </div>
                    <div style="flex:1">
                        <label>${getTranslation('opacityLabel')}</label>
                        <div class="slider-row">
                            <input type="range" class="shadow-opacity" data-index="${index}" min="0" max="100" value="${shadow.opacity * 100}" step="1">
                            <input type="number" class="shadow-opacity-num" data-index="${index}" value="${shadow.opacity * 100}" step="1" style="width:60px;">
                        </div>
                    </div>
                </div>
                <div style="margin-top:8px;">
                    <label style="display:flex; align-items:center; gap:8px;">
                        <input type="checkbox" class="shadow-inset" data-index="${index}" ${shadow.inset ? 'checked' : ''}>
                        ${getTranslation('insetShadowLabel')}
                    </label>
                </div>
            `;
          shadowsContainer.appendChild(shadowDiv);
        });

        // اتصال رویدادها
        attachShadowEvents();
        updatePreviewAndCSS();
      }

      function attachShadowEvents() {
        // offsetX
        document.querySelectorAll('.shadow-offsetX').forEach((el) => {
          el.removeEventListener('input', handleShadowChange);
          el.addEventListener('input', handleShadowChange);
        });
        document.querySelectorAll('.shadow-offsetX-num').forEach((el) => {
          el.removeEventListener('change', handleShadowChangeNum);
          el.addEventListener('change', handleShadowChangeNum);
        });
        document.querySelectorAll('.shadow-offsetY').forEach((el) => {
          el.removeEventListener('input', handleShadowChange);
          el.addEventListener('input', handleShadowChange);
        });
        document.querySelectorAll('.shadow-offsetY-num').forEach((el) => {
          el.removeEventListener('change', handleShadowChangeNum);
          el.addEventListener('change', handleShadowChangeNum);
        });
        document.querySelectorAll('.shadow-blur').forEach((el) => {
          el.removeEventListener('input', handleShadowChange);
          el.addEventListener('input', handleShadowChange);
        });
        document.querySelectorAll('.shadow-blur-num').forEach((el) => {
          el.removeEventListener('change', handleShadowChangeNum);
          el.addEventListener('change', handleShadowChangeNum);
        });
        document.querySelectorAll('.shadow-spread').forEach((el) => {
          el.removeEventListener('input', handleShadowChange);
          el.addEventListener('input', handleShadowChange);
        });
        document.querySelectorAll('.shadow-spread-num').forEach((el) => {
          el.removeEventListener('change', handleShadowChangeNum);
          el.addEventListener('change', handleShadowChangeNum);
        });
        document.querySelectorAll('.shadow-color').forEach((el) => {
          el.removeEventListener('input', handleShadowChange);
          el.addEventListener('input', handleShadowChange);
        });
        document.querySelectorAll('.shadow-opacity').forEach((el) => {
          el.removeEventListener('input', handleShadowChange);
          el.addEventListener('input', handleShadowChange);
        });
        document.querySelectorAll('.shadow-opacity-num').forEach((el) => {
          el.removeEventListener('change', handleShadowChangeNum);
          el.addEventListener('change', handleShadowChangeNum);
        });
        document.querySelectorAll('.shadow-inset').forEach((el) => {
          el.removeEventListener('change', handleShadowChange);
          el.addEventListener('change', handleShadowChange);
        });
        document.querySelectorAll('.remove-shadow').forEach((btn) => {
          btn.removeEventListener('click', handleRemoveShadow);
          btn.addEventListener('click', handleRemoveShadow);
        });
      }

      function handleShadowChange(e) {
        const target = e.target;
        const index = parseInt(target.getAttribute('data-index'));
        if (isNaN(index)) return;
        if (target.classList.contains('shadow-offsetX'))
          shadows[index].offsetX = parseInt(target.value);
        else if (target.classList.contains('shadow-offsetY'))
          shadows[index].offsetY = parseInt(target.value);
        else if (target.classList.contains('shadow-blur'))
          shadows[index].blur = parseInt(target.value);
        else if (target.classList.contains('shadow-spread'))
          shadows[index].spread = parseInt(target.value);
        else if (target.classList.contains('shadow-color'))
          shadows[index].color = target.value;
        else if (target.classList.contains('shadow-opacity'))
          shadows[index].opacity = parseInt(target.value) / 100;
        else if (target.classList.contains('shadow-inset'))
          shadows[index].inset = target.checked;

        // هماهنگ‌سازی با فیلد عددی
        syncNumericFields(index);
        updatePreviewAndCSS();
      }

      function handleShadowChangeNum(e) {
        const target = e.target;
        const index = parseInt(target.getAttribute('data-index'));
        if (isNaN(index)) return;
        let val = parseInt(target.value);
        if (isNaN(val)) val = 0;
        if (target.classList.contains('shadow-offsetX-num')) {
          shadows[index].offsetX = val;
        } else if (target.classList.contains('shadow-offsetY-num')) {
          shadows[index].offsetY = val;
        } else if (target.classList.contains('shadow-blur-num')) {
          shadows[index].blur = val;
        } else if (target.classList.contains('shadow-spread-num')) {
          shadows[index].spread = val;
        } else if (target.classList.contains('shadow-opacity-num')) {
          shadows[index].opacity = val / 100;
        }
        syncSliderFields(index);
        updatePreviewAndCSS();
      }

      function syncNumericFields(index) {
        const shadow = shadows[index];
        const offsetXNum = document.querySelector(
          `.shadow-offsetX-num[data-index="${index}"]`,
        );
        if (offsetXNum) offsetXNum.value = shadow.offsetX;
        const offsetYNum = document.querySelector(
          `.shadow-offsetY-num[data-index="${index}"]`,
        );
        if (offsetYNum) offsetYNum.value = shadow.offsetY;
        const blurNum = document.querySelector(
          `.shadow-blur-num[data-index="${index}"]`,
        );
        if (blurNum) blurNum.value = shadow.blur;
        const spreadNum = document.querySelector(
          `.shadow-spread-num[data-index="${index}"]`,
        );
        if (spreadNum) spreadNum.value = shadow.spread;
        const opacityNum = document.querySelector(
          `.shadow-opacity-num[data-index="${index}"]`,
        );
        if (opacityNum) opacityNum.value = shadow.opacity * 100;
      }

      function syncSliderFields(index) {
        const shadow = shadows[index];
        const offsetXSlider = document.querySelector(
          `.shadow-offsetX[data-index="${index}"]`,
        );
        if (offsetXSlider) offsetXSlider.value = shadow.offsetX;
        const offsetYSlider = document.querySelector(
          `.shadow-offsetY[data-index="${index}"]`,
        );
        if (offsetYSlider) offsetYSlider.value = shadow.offsetY;
        const blurSlider = document.querySelector(
          `.shadow-blur[data-index="${index}"]`,
        );
        if (blurSlider) blurSlider.value = shadow.blur;
        const spreadSlider = document.querySelector(
          `.shadow-spread[data-index="${index}"]`,
        );
        if (spreadSlider) spreadSlider.value = shadow.spread;
        const opacitySlider = document.querySelector(
          `.shadow-opacity[data-index="${index}"]`,
        );
        if (opacitySlider) opacitySlider.value = shadow.opacity * 100;
        const colorPicker = document.querySelector(
          `.shadow-color[data-index="${index}"]`,
        );
        if (colorPicker) colorPicker.value = shadow.color;
        const insetCheck = document.querySelector(
          `.shadow-inset[data-index="${index}"]`,
        );
        if (insetCheck) insetCheck.checked = shadow.inset;
      }

      function handleRemoveShadow(e) {
        const btn = e.target;
        const index = parseInt(btn.getAttribute('data-index'));
        if (!isNaN(index)) {
          shadows.splice(index, 1);
          renderShadows();
        }
      }

      function updatePreviewAndCSS() {
        // ساخت CSS
        const cssShadows = shadows
          .map((s) => {
            const insetPart = s.inset ? 'inset ' : '';
            const rgba = hexToRgba(s.color, s.opacity);
            return `${insetPart}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${rgba}`;
          })
          .join(', ');
        const finalCss = cssShadows || 'none';
        previewBox.style.boxShadow = finalCss;
        cssOutput.textContent = `box-shadow: ${finalCss};`;
      }

      function hexToRgba(hex, opacity) {
        let r = 0,
          g = 0,
          b = 0;
        if (hex.startsWith('#')) {
          if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
          } else if (hex.length === 7) {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
          }
        }
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      addShadowBtn.addEventListener('click', () => {
        shadows.push(createShadowObject());
        renderShadows();
      });

      copyBtn.addEventListener('click', () => {
        const text = cssOutput.textContent;
        navigator.clipboard
          .writeText(text)
          .then(() => {
            copyBtn.textContent = getTranslation('copySuccess');
            setTimeout(
              () => (copyBtn.textContent = getTranslation('copyCssBtn')),
              1500,
            );
          })
          .catch(() => alert(getTranslation('copyError')));
      });

      window.addEventListener('languageChanged', renderShadows);

      // مقداردهی اولیه با یک سایه پیش‌فرض
      shadows.push(createShadowObject());
      renderShadows();
