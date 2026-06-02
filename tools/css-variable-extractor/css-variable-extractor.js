const uploadArea = document.getElementById('uploadArea');
      const fileInput = document.getElementById('fileInput');
      const cssInput = document.getElementById('cssInput');
      const extractBtn = document.getElementById('extractBtn');
      const copyCssBtn = document.getElementById('copyCssBtn');
      const copyJsonBtn = document.getElementById('copyJsonBtn');
      const clearBtn = document.getElementById('clearBtn');
      const downloadCssBtn = document.getElementById('downloadCssBtn');
      const resultArea = document.getElementById('resultArea');
      const varTableBody = document.getElementById('varTableBody');
      const statsDiv = document.getElementById('stats');
      const errorMsg = document.getElementById('errorMsg');

      let currentVariables = [];

      function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        setTimeout(() => (errorMsg.style.display = 'none'), 5000);
      }

      // تشخیص نوع مقدار (با پشتیبانی از اعشار در HSL خام)
      function detectType(value) {
        value = value.trim();
        // رنگ‌های هگز و rgb, hsl توابع دار
        if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(value)) return 'color';
        if (/^rgb\(|^rgba\(|^hsl\(|^hsla\(/.test(value)) return 'color';
        // اضافه کردن الگوی HSL خام با اعداد اعشاری
        // مثال: "0 100% 63%" یا "222.2 84% 4.9%"
        if (/^\d+(?:\.\d+)?\s+\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%$/.test(value))
          return 'color';
        // اندازه‌ها با واحد
        if (
          /^\d+(\.\d+)?(px|rem|em|%|vw|vh|vmin|vmax|cm|mm|in|pt|pc)$/.test(
            value,
          )
        )
          return 'size';
        // عدد خالص
        if (/^\d+(\.\d+)?$/.test(value)) return 'number';
        if (/^url\(/.test(value)) return 'url';
        if (/^[\w-]+$/.test(value)) return 'keyword';
        return 'other';
      }

      // تبدیل مقدار به رنگ معتبر برای پیش‌نمایش
      function valueToColor(value, type) {
        if (type !== 'color') return null;
        value = value.trim();
        // هگز یا تابع رنگی
        if (/^#/.test(value) || /^rgb\(|^rgba\(|^hsl\(|^hsla\(/.test(value)) {
          return value;
        }
        // الگوی HSL خام با اعشار: "222.2 84% 4.9%" -> hsl(222.2, 84%, 4.9%)
        const hslMatch = value.match(
          /^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?%)\s+(\d+(?:\.\d+)?%)$/,
        );
        if (hslMatch) {
          return `hsl(${hslMatch[1]}, ${hslMatch[2]}, ${hslMatch[3]})`;
        }
        return null;
      }

      function extractVariables(cssText) {
        const regex = /--([a-zA-Z][a-zA-Z0-9-]*)\s*:\s*([^;]+);/g;
        const vars = [];
        let match;
        while ((match = regex.exec(cssText)) !== null) {
          let name = `--${match[1]}`;
          let value = match[2].trim();
          // حذف کامنت انتهایی
          value = value.replace(/\/\*.*?\*\/$/, '').trim();
          const type = detectType(value);
          vars.push({ name, value, type });
        }
        return vars;
      }

      function renderTable(vars) {
        varTableBody.innerHTML = '';
        if (!vars.length) {
          varTableBody.innerHTML =
            '<tr><td colspan="4">هیچ متغیری یافت نشد</td></tr>';
          statsDiv.innerHTML = '0 متغیر یافت شد';
          return;
        }
        for (const v of vars) {
          const row = document.createElement('tr');
          // نام
          const nameCell = document.createElement('td');
          nameCell.className = 'var-name';
          nameCell.textContent = v.name;
          // مقدار
          const valueCell = document.createElement('td');
          valueCell.className = 'var-value';
          valueCell.textContent = v.value;
          // نوع
          const typeCell = document.createElement('td');
          typeCell.innerHTML = `<span class="badge">${v.type}</span>`;
          // پیش‌نمایش
          const previewCell = document.createElement('td');
          const colorCss = valueToColor(v.value, v.type);
          if (colorCss) {
            const swatch = document.createElement('div');
            swatch.className = 'color-preview';
            swatch.style.backgroundColor = colorCss;
            previewCell.appendChild(swatch);
            previewCell.appendChild(document.createTextNode(v.value));
          } else {
            previewCell.textContent = '—';
          }
          row.appendChild(nameCell);
          row.appendChild(valueCell);
          row.appendChild(typeCell);
          row.appendChild(previewCell);
          varTableBody.appendChild(row);
        }
        statsDiv.innerHTML = `${vars.length} متغیر یافت شد.`;
      }

      function updateResult(vars) {
        currentVariables = vars;
        renderTable(vars);
        resultArea.style.display = 'block';
        copyCssBtn.disabled = false;
        copyJsonBtn.disabled = false;
        downloadCssBtn.disabled = false;
      }

      extractBtn.addEventListener('click', () => {
        const css = cssInput.value;
        if (!css.trim()) {
          showError('لطفاً کد CSS را وارد کنید یا فایل آپلود کنید');
          return;
        }
        const vars = extractVariables(css);
        if (!vars.length) {
          showError(
            'هیچ متغیر CSS معتبری یافت نشد. لطفاً الگوی `--name: value;` را بررسی کنید.',
          );
        }
        updateResult(vars);
      });

      function handleFile(file) {
        if (
          !file ||
          !(file.name.endsWith('.css') || file.type === 'text/css')
        ) {
          showError('لطفاً یک فایل CSS معتبر انتخاب کنید');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          cssInput.value = e.target.result;
          extractBtn.click();
        };
        reader.onerror = () => showError('خطا در خواندن فایل');
        reader.readAsText(file);
      }

      uploadArea.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length) handleFile(fileInput.files[0]);
      });
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#292e4a';
      });
      uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '#1e2137';
      });
      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#1e2137';
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      });

      copyCssBtn.addEventListener('click', () => {
        if (!currentVariables.length) return;
        let css = ':root {\n';
        for (const v of currentVariables) {
          css += `  ${v.name}: ${v.value};\n`;
        }
        css += '}';
        navigator.clipboard
          .writeText(css)
          .then(() => {
            const old = copyCssBtn.textContent;
            copyCssBtn.textContent = '✅ کپی شد!';
            setTimeout(() => (copyCssBtn.textContent = old), 1500);
          })
          .catch(() => showError('خطا در کپی'));
      });

      copyJsonBtn.addEventListener('click', () => {
        if (!currentVariables.length) return;
        const obj = {};
        for (const v of currentVariables) {
          obj[v.name] = v.value;
        }
        const json = JSON.stringify(obj, null, 2);
        navigator.clipboard
          .writeText(json)
          .then(() => {
            const old = copyJsonBtn.textContent;
            copyJsonBtn.textContent = '✅ کپی شد!';
            setTimeout(() => (copyJsonBtn.textContent = old), 1500);
          })
          .catch(() => showError('خطا در کپی'));
      });

      downloadCssBtn.addEventListener('click', () => {
        if (!currentVariables.length) return;
        let css = ':root {\n';
        for (const v of currentVariables) {
          css += `  ${v.name}: ${v.value};\n`;
        }
        css += '}';
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'variables.css';
        a.click();
        URL.revokeObjectURL(url);
      });

      clearBtn.addEventListener('click', () => {
        cssInput.value = '';
        resultArea.style.display = 'none';
        currentVariables = [];
        copyCssBtn.disabled = true;
        copyJsonBtn.disabled = true;
        downloadCssBtn.disabled = true;
      });

      // مثال پیش‌فرض با مقادیر HSL اعشاری
      const defaultCss = `:root {
  --color-1: 0 100% 63%;
  --color-2: 270 100% 63%;
  --color-3: 210 100% 63%;
  --color-4: 195 100% 63%;
  --color-5: 90 100% 63%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}`;
      cssInput.value = defaultCss;
      extractBtn.click();
