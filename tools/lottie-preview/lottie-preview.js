const dropZone = document.getElementById('dropZone');
      const fileInput = document.getElementById('fileInput');
      const animationContainer = document.getElementById('animationContainer');
      const statusMsg = document.getElementById('statusMsg');
      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      const stopBtn = document.getElementById('stopBtn');
      const speedSlider = document.getElementById('speedSlider');
      const speedValue = document.getElementById('speedValue');

      let animationItem = null;
      let animationData = null;

      function showMessage(text, isError = false) {
        statusMsg.textContent = text;
        statusMsg.style.color = isError ? '#ffa2a2' : '#a3e9a4';
        setTimeout(() => {
          if (statusMsg.textContent === text) statusMsg.textContent = '';
        }, 4000);
      }

      function loadAnimation(jsonData) {
        if (animationItem) {
          animationItem.destroy();
          animationItem = null;
        }
        try {
          animationItem = lottie.loadAnimation({
            container: document.getElementById('lottieCanvas'),
            renderer: 'canvas',
            loop: true,
            autoplay: true,
            animationData: jsonData,
          });
          animationItem.setSpeed(parseFloat(speedSlider.value));
          animationContainer.style.display = 'block';
          showMessage('✅ انیمیشن با موفقیت بارگذاری شد');
        } catch (err) {
          console.error(err);
          showMessage('خطا در بارگذاری فایل لاتی: فرمت JSON معتبر نیست', true);
          animationContainer.style.display = 'none';
        }
      }

      function handleFile(file) {
        if (!file || !file.name.endsWith('.json')) {
          showMessage('لطفاً یک فایل JSON معتبر (لاتی) انتخاب کنید', true);
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target.result);
            loadAnimation(json);
          } catch (err) {
            showMessage('فایل JSON معتبر نیست', true);
            animationContainer.style.display = 'none';
          }
        };
        reader.onerror = () => showMessage('خطا در خواندن فایل', true);
        reader.readAsText(file);
      }

      dropZone.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length) handleFile(fileInput.files[0]);
      });
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.background = '#292e4a';
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.style.background = '#1e2137';
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.background = '#1e2137';
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      });

      playBtn.addEventListener('click', () => {
        if (animationItem) animationItem.play();
        else showMessage('هیچ انیمیشنی بارگذاری نشده', true);
      });
      pauseBtn.addEventListener('click', () => {
        if (animationItem) animationItem.pause();
        else showMessage('هیچ انیمیشنی بارگذاری نشده', true);
      });
      stopBtn.addEventListener('click', () => {
        if (animationItem) {
          animationItem.stop();
        } else showMessage('هیچ انیمیشنی بارگذاری نشده', true);
      });
      speedSlider.addEventListener('input', () => {
        const val = parseFloat(speedSlider.value);
        speedValue.textContent = val.toFixed(2) + 'x';
        if (animationItem) animationItem.setSpeed(val);
      });
