const markdownInput = document.getElementById('markdownInput');
      const previewDiv = document.getElementById('preview');
      const resetBtn = document.getElementById('resetBtn');
      const ltrBtn = document.getElementById('ltrBtn');
      const rtlBtn = document.getElementById('rtlBtn');

      const defaultMarkdown = `# عنوان اصلی

## عنوان سطح دو

متن معمولی با **توپر** و *ایتالیک* و ~~خط خورده~~.

- آیتم لیست اول
- آیتم لیست دوم
  - زیر آیتم

1. لیست شماره دار
2. مورد دوم

[لینک به گوگل](https://google.com)

![تصویر نمونه](https://via.placeholder.com/150)

\`کد درون خطی\`

\`\`\`javascript
// بلوک کد
function hello() {
  console.log("Hello World");
}
\`\`\`

> نقل قول زیبا

| جدول | مثال |
|------|------|
| سلول 1 | سلول 2 |

---

**متن فارسی برای تست راست‌چین:**  
لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.`;

      function updatePreview() {
        const markdown = markdownInput.value;
        const html = marked.parse(markdown);
        previewDiv.innerHTML = html;
      }

      function setDirection(dir) {
        // تغییر جهت پیش‌نمایش
        previewDiv.setAttribute('dir', dir);
        // تغییر جهت و textarea
        if (dir === 'ltr') {
          markdownInput.style.direction = 'ltr';
          markdownInput.style.textAlign = 'left';
          markdownInput.classList.remove('rtl-textarea');
          ltrBtn.classList.add('active-dir');
          rtlBtn.classList.remove('active-dir');
        } else {
          markdownInput.style.direction = 'rtl';
          markdownInput.style.textAlign = 'right';
          markdownInput.classList.add('rtl-textarea');
          rtlBtn.classList.add('active-dir');
          ltrBtn.classList.remove('active-dir');
        }
      }

      resetBtn.addEventListener('click', () => {
        markdownInput.value = defaultMarkdown;
        updatePreview();
      });
      ltrBtn.addEventListener('click', () => setDirection('ltr'));
      rtlBtn.addEventListener('click', () => setDirection('rtl'));
      markdownInput.addEventListener('input', updatePreview);

      // مقدار اولیه
      markdownInput.value = defaultMarkdown;
      updatePreview();
      setDirection('ltr');
