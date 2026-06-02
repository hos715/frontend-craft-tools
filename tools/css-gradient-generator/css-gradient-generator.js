// ---------- DOM elements ----------
      const gradientPreview = document.getElementById('gradientPreview');
      const cssCodePre = document.getElementById('cssCode');
      const fullCssPreview = document.getElementById('fullCssPreview');
      const gradientType = document.getElementById('gradientType');
      const angleRange = document.getElementById('angleRange');
      const angleNumber = document.getElementById('angleNumber');
      const colorsContainer = document.getElementById('colorsContainer');
      const addColorBtn = document.getElementById('addColorBtn');
      const saveGradientBtn = document.getElementById('saveGradientBtn');
      const clearSavedBtn = document.getElementById('clearSavedBtn');
      const saveNameInput = document.getElementById('saveName');
      const savedGradientsDiv = document.getElementById('savedGradients');
      const copyBtn = document.getElementById('copyBtn');

      // داده‌ها
      let colors = ['#9d6cab', '#3f5dad']; // حداقل دو رنگ

      // ---------- توابع کمکی ----------
      function updateGradient() {
        const type = gradientType.value;
        let gradientCss = '';
        const colorStops = colors
          .map((c, idx) => {
            const percent = Math.round((idx / (colors.length - 1)) * 100);
            return `${c} ${percent}%`;
          })
          .join(', ');

        if (type === 'linear') {
          const angle = angleRange.value;
          gradientCss = `linear-gradient(${angle}deg, ${colorStops})`;
        } else if (type === 'radial') {
          gradientCss = `radial-gradient(circle, ${colorStops})`;
        } else {
          // conic
          const angle = angleRange.value;
          gradientCss = `conic-gradient(from ${angle}deg, ${colorStops})`;
        }

        gradientPreview.style.background = gradientCss;
        cssCodePre.textContent = `background: ${gradientCss};`;
        fullCssPreview.textContent = `.my-element {\n    background: ${gradientCss};\n}`;
      }

      // رندر کردن لیست رنگ‌ها در UI
      function renderColors() {
        colorsContainer.innerHTML = '';
        colors.forEach((color, index) => {
          const row = document.createElement('div');
          row.className = 'color-row';
          const colorPicker = document.createElement('input');
          colorPicker.type = 'color';
          colorPicker.value = color;
          colorPicker.addEventListener('input', (e) => {
            colors[index] = e.target.value;
            textInput.value = e.target.value;
            updateGradient();
          });
          const textInput = document.createElement('input');
          textInput.type = 'text';
          textInput.value = color;
          textInput.addEventListener('change', (e) => {
            let val = e.target.value;
            if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
              colors[index] = val;
              colorPicker.value = val;
              updateGradient();
            } else {
              e.target.value = colors[index];
            }
          });
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = '✖';
          deleteBtn.style.background = '#5e2a2a';
          deleteBtn.style.cursor = 'pointer';
          deleteBtn.addEventListener('click', () => {
            if (colors.length > 2) {
              colors.splice(index, 1);
              renderColors();
              updateGradient();
            } else {
              alert('حداقل دو رنگ نیاز است.');
            }
          });
          row.appendChild(colorPicker);
          row.appendChild(textInput);
          row.appendChild(deleteBtn);
          colorsContainer.appendChild(row);
        });
        // اگر تعداد رنگ‌ها کمتر از 6 باشه، دکمه افزودن فعاله (در غیر این صورت غیرفعال نمی‌کنیم ولی شرط می‌گذاریم)
      }

      // افزودن رنگ جدید
      addColorBtn.addEventListener('click', () => {
        if (colors.length >= 6) {
          alert('حداکثر ۶ رنگ مجاز است.');
          return;
        }
        colors.push('#ffffff');
        renderColors();
        updateGradient();
      });

      // تغییر نوع گرادیان
      gradientType.addEventListener('change', () => {
        const isLinearOrConic =
          gradientType.value === 'linear' || gradientType.value === 'conic';
        document.getElementById('angleGroup').style.display = isLinearOrConic
          ? 'block'
          : 'none';
        updateGradient();
      });

      // زاویه
      function syncAngle() {
        const val = angleRange.value;
        angleNumber.value = val;
        updateGradient();
      }
      angleRange.addEventListener('input', syncAngle);
      angleNumber.addEventListener('input', () => {
        let val = parseInt(angleNumber.value);
        if (isNaN(val)) val = 0;
        val = Math.min(360, Math.max(0, val));
        angleRange.value = val;
        angleNumber.value = val;
        updateGradient();
      });

      // ذخیره در localStorage
      function saveCurrentGradient() {
        let name = saveNameInput.value.trim();
        if (!name) name = `گرادیان ${new Date().toLocaleTimeString()}`;
        const type = gradientType.value;
        const angle = angleRange.value;
        const savedColors = [...colors];
        const gradients = JSON.parse(
          localStorage.getItem('css_gradients') || '[]',
        );
        gradients.unshift({
          name,
          type,
          angle,
          colors: savedColors,
          timestamp: Date.now(),
        });
        // نگهداری حداکثر ۲۰ عدد
        if (gradients.length > 20) gradients.pop();
        localStorage.setItem('css_gradients', JSON.stringify(gradients));
        loadSavedList();
        saveNameInput.value = '';
      }

      function loadSavedList() {
        const gradients = JSON.parse(
          localStorage.getItem('css_gradients') || '[]',
        );
        savedGradientsDiv.innerHTML =
          '<div style="font-size:0.7rem; color:#aaa;">⭐ گرادیان‌های ذخیره شده (کلیک کنید)</div>';
        gradients.forEach((item, idx) => {
          const div = document.createElement('div');
          div.className = 'saved-item';
          div.innerHTML = `<span>${item.name}</span><span class="badge">${item.type}</span>`;
          div.addEventListener('click', () => {
            // بازیابی گرادیان
            gradientType.value = item.type;
            colors = [...item.colors];
            angleRange.value = item.angle;
            angleNumber.value = item.angle;
            renderColors();
            // نمایش درست angle group
            const isLinearOrConic =
              item.type === 'linear' || item.type === 'conic';
            document.getElementById('angleGroup').style.display =
              isLinearOrConic ? 'block' : 'none';
            updateGradient();
          });
          savedGradientsDiv.appendChild(div);
        });
      }

      clearSavedBtn.addEventListener('click', () => {
        if (confirm('همه گرادیان‌های ذخیره شده حذف می‌شوند. ادامه؟')) {
          localStorage.removeItem('css_gradients');
          loadSavedList();
        }
      });

      saveGradientBtn.addEventListener('click', saveCurrentGradient);

      // کپی CSS
      copyBtn.addEventListener('click', () => {
        const cssText = cssCodePre.textContent;
        navigator.clipboard
          .writeText(cssText)
          .then(() => {
            const original = copyBtn.textContent;
            copyBtn.textContent = '✅ کپی شد!';
            setTimeout(() => (copyBtn.textContent = original), 1500);
          })
          .catch(() => alert('خطا در کپی'));
      });

      // مقداردهی اولیه
      function init() {
        renderColors();
        angleRange.value = 135;
        angleNumber.value = 135;
        gradientType.value = 'linear';
        updateGradient();
        loadSavedList();
      }
      init();
