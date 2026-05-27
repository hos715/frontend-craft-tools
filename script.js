const supportedLangs = ['fa', 'en', 'zh', 'hi'];
const defaultLang = 'fa';
let currentLang = defaultLang;

const translations = {
    fa: {
        dir: 'rtl',
        pageTitle: '🧰 ابزارهای JSON',
        pageSubtitle: 'مجموعه‌ای از ابزارهای ساده برای کار با فایل‌های JSON در مرورگر.',
        pageIntro: 'این پروژه یک صفحه‌ی پل معرفی است و به مرور زمان می‌تواند ابزارهای بیشتری را در خود جای دهد.',
        infoText: 'صفحه‌ی اصلی اینجا است، و ابزارهای فعلی به صورت جداگانه در صفحات دیگر قرار دارند.',
        footerText: 'پروژه آماده توسعه است؛ ابزارهای جدید می‌توانند به همین ساختار اضافه شوند.',
        langLabel: 'زبان:',
        toolLinkJsonMinifier: '🗜️ Minify کننده JSON',
        toolLinkLottie: '🎨 تعویض رنگ‌های لاتی',
        indexTitle: '🧰 ابزارهای JSON',
        jsonPageTitle: '🗜️ Minify کننده JSON',
        jsonPageSubtitle: 'حذف فاصله‌ها، اینترها و فشرده‌سازی فایل لاتی یا هر JSON دیگر',
        jsonDropText: '📂 فایل JSON را بکش و رها کن یا کلیک کن',
        jsonDownloadBtn: '📥 دانلود فایل Minified شده',
        jsonFooterText: 'فقط ظاهر فایل فشرده می‌شود — ساختار و محتوا سالم می‌ماند.',
        jsonStatusSuccess: '✅ فشرده‌سازی انجام شد!',
        jsonSizeBefore: '📄 حجم قبل:',
        jsonSizeAfter: '📦 حجم بعد:',
        jsonSizeSaved: '🎯 کاهش حجم:',
        jsonFileTypeError: '❌ لطفاً یک فایل با پسوند .json انتخاب کنید',
        jsonFileReadError: '❌ خطا در خواندن فایل',
        jsonInvalidJsonError: '❌ فایل JSON معتبر نیست: ',
        jsonDownloadStarted: '📁 دانلود شروع شد:',
        lottiePageTitle: '🎨 تعویض خودکار رنگ‌های فایل لاتی (Lottie JSON)',
        lottiePageSubtitle: '🔍 رنگ‌های قدیم را استخراج کن، رنگ جدید انتخاب کن و آن‌ها را جایگزین کن.',
        lottieUploadText: '📂 فایل JSON لاتی را اینجا بکش و رها کن یا کلیک کن تا انتخاب کنی',
        lottieColorListTitle: '🎨 لیست رنگ‌های پیدا شده در فایل (unique)',
        lottiePreviewHeader: 'پیش‌نمایش',
        lottieOldValueHeader: 'مقدار قدیم (در فایل)',
        lottieTypeHeader: 'نوع',
        lottieNewColorHeader: 'رنگ جدید (Hex یا RGBA)',
        lottieActionHeader: 'عملیات',
        lottieApplyBtn: '✨ اعمال تغییرات و دانلود فایل جدید',
        lottieResetMappingBtn: '⟳ بازنشانی همه رنگ‌های جدید به حالت اولیه',
        lottieFooterLine1: '⚡ هر رنگ در هر جای فایل (stroke, fill, keyframes, expressions, ...) عوض می‌شود.',
        lottieFooterLine2: '✅ قالب قدیم می‌تواند آرایه [r,g,b,a] با دامنه 0 تا 1 یا رشته Hex مثل "#ffffff" باشد.',
        lottieBackLink: '← بازگشت به صفحه اصلی',
        lottieInvalidJsonAlert: 'فایل JSON معتبر نیست: ',
        lottieChooseFileError: 'لطفاً یک فایل JSON با پسوند .json انتخاب کن',
        lottieNoFileUploaded: 'هیچ فایلی بارگذاری نشده',
        lottieResetSuccess: '✅ همه رنگ‌ها بازنشانی شدند.',
        lottieColorDetectedMessage: '🎯 {count} رنگ یکتا شناسایی شد. برای هرکدام رنگ جدید وارد کن و اعمال را بزن.',
        lottieFileStatusTemplate: '📄 فایل: {name} — {size}KB — آماده استخراج رنگ‌ها',
        lottieSuccessDownload: '✅ فایل جدید با رنگ‌های به‌روز شده دانلود شد!',
        lottieReplaceError: '❌ خطا در جایگزینی رنگ‌ها: ',
        lottieInvalidColorFormat: '⚠️ فرمت نامعتبر: "{value}" — از #rrggbb یا rgba استفاده کن',
        lottieResetRowMessage: '🔄 رنگ "{displayKey}" به حالت اول برگشت',
        lottieColorTypeArray: '📦 آرایه RGBA',
        lottieColorTypeHex: '🔤 رشته Hex',
        lottieNewColorPlaceholder: '#rrggbb یا rgba(...)',
        lottieConsoleReady: 'اسکریپت آماده است. فایل لاتی را آپلود کن.'
    },
    en: {
        dir: 'ltr',
        pageTitle: '🧰 JSON Tools',
        pageSubtitle: 'A small collection of browser-based JSON utilities.',
        pageIntro: 'This project is a landing page that can grow with more browser-based JSON tools.',
        infoText: 'The main page lists current tools separately.',
        footerText: 'The project is ready to expand with more tools.',
        langLabel: 'Language:',
        toolLinkJsonMinifier: '🗜️ JSON Minifier',
        toolLinkLottie: '🎨 Lottie Color Switcher',
        indexTitle: '🧰 JSON Tools',
        jsonPageTitle: '🗜️ JSON Minifier',
        jsonPageSubtitle: 'Remove spaces, newlines, and minify any JSON file.',
        jsonDropText: '📂 Drag or click to select a JSON file',
        jsonDownloadBtn: '📥 Download minified JSON',
        jsonFooterText: 'Only the appearance changes — content and structure stay intact.',
        jsonStatusSuccess: '✅ Minification complete!',
        jsonSizeBefore: '📄 Original size:',
        jsonSizeAfter: '📦 Minified size:',
        jsonSizeSaved: '🎯 Size reduced:',
        jsonFileTypeError: '❌ Please select a .json file',
        jsonFileReadError: '❌ Error reading the file',
        jsonInvalidJsonError: '❌ Invalid JSON file: ',
        jsonDownloadStarted: '📁 Download started:',
        lottiePageTitle: '🎨 Lottie JSON Color Switcher',
        lottiePageSubtitle: '🔍 Extract old colors, choose new colors, and apply replacements.',
        lottieUploadText: '📂 Drag and drop a Lottie JSON file here or click to select',
        lottieColorListTitle: '🎨 Unique colors found in the file',
        lottiePreviewHeader: 'Preview',
        lottieOldValueHeader: 'Original value',
        lottieTypeHeader: 'Type',
        lottieNewColorHeader: 'New color (Hex or RGBA)',
        lottieActionHeader: 'Action',
        lottieApplyBtn: '✨ Apply changes and download updated file',
        lottieResetMappingBtn: '⟳ Reset all new colors to original',
        lottieFooterLine1: '⚡ Every color in the file (stroke, fill, keyframes, expressions, ...) will be replaced.',
        lottieFooterLine2: '✅ Original colors can be RGBA arrays [r,g,b,a] with values 0–1 or Hex strings like "#ffffff".',
        lottieBackLink: '← Back to home',
        lottieInvalidJsonAlert: 'Invalid JSON file: ',
        lottieChooseFileError: 'Please select a JSON file with .json extension',
        lottieNoFileUploaded: 'No file has been uploaded',
        lottieResetSuccess: '✅ All colors reset to default.',
        lottieColorDetectedMessage: '🎯 {count} unique colors detected. Enter a new color for each, then click Apply.',
        lottieFileStatusTemplate: '📄 File: {name} — {size}KB — ready to extract colors',
        lottieSuccessDownload: '✅ Updated file downloaded successfully!',
        lottieReplaceError: '❌ Error replacing colors: ',
        lottieInvalidColorFormat: '⚠️ Invalid format: "{value}" — use #rrggbb or rgba()',
        lottieResetRowMessage: '🔄 Color "{displayKey}" reset to original',
        lottieColorTypeArray: '📦 RGBA Array',
        lottieColorTypeHex: '🔤 Hex String',
        lottieNewColorPlaceholder: '#rrggbb or rgba(...)',
        lottieConsoleReady: 'Script is ready. Upload the Lottie file.'
    },
    zh: {
        dir: 'ltr',
        pageTitle: '🧰 JSON 工具',
        pageSubtitle: '一组基于浏览器的 JSON 小工具。',
        pageIntro: '该项目是一个着陆页，可随着更多基于浏览器的 JSON 工具扩展。',
        infoText: '主页将当前工具单独列出。',
        footerText: '该项目已准备好扩展更多工具。',
        langLabel: '语言:',
        toolLinkJsonMinifier: '🗜️ JSON 压缩器',
        toolLinkLottie: '🎨 Lottie 颜色替换器',
        indexTitle: '🧰 JSON 工具',
        jsonPageTitle: '🗜️ JSON 压缩器',
        jsonPageSubtitle: '删除空格、换行并压缩任何 JSON 文件。',
        jsonDropText: '📂 拖放或点击选择 JSON 文件',
        jsonDownloadBtn: '📥 下载压缩后的 JSON',
        jsonFooterText: '仅更改外观 — 内容和结构保持不变。',
        jsonStatusSuccess: '✅ 压缩完成！',
        jsonSizeBefore: '📄 原始大小:',
        jsonSizeAfter: '📦 压缩后大小:',
        jsonSizeSaved: '🎯 减少大小:',
        jsonFileTypeError: '❌ 请选择一个 .json 文件',
        jsonFileReadError: '❌ 读取文件时出错',
        jsonInvalidJsonError: '❌ 无效的 JSON 文件：',
        jsonDownloadStarted: '📁 已开始下载：',
        lottiePageTitle: '🎨 Lottie JSON 颜色替换器',
        lottiePageSubtitle: '🔍 提取旧颜色，选择新颜色，并应用替换。',
        lottieUploadText: '📂 将 Lottie JSON 文件拖放到此处或点击选择',
        lottieColorListTitle: '🎨 文件中找到的唯一颜色',
        lottiePreviewHeader: '预览',
        lottieOldValueHeader: '原始值',
        lottieTypeHeader: '类型',
        lottieNewColorHeader: '新颜色 (Hex 或 RGBA)',
        lottieActionHeader: '操作',
        lottieApplyBtn: '✨ 应用更改并下载更新文件',
        lottieResetMappingBtn: '⟳ 将所有新颜色重置为原始颜色',
        lottieFooterLine1: '⚡ 文件中的每种颜色（stroke、fill、keyframes、expressions 等）都将被替换。',
        lottieFooterLine2: '✅ 原始颜色可以是 RGBA 数组 [r,g,b,a]（范围 0–1）或类似 "#ffffff" 的 Hex 字符串。',
        lottieBackLink: '← 返回主页',
        lottieInvalidJsonAlert: '无效的 JSON 文件: ',
        lottieChooseFileError: '请选择扩展名为 .json 的 JSON 文件',
        lottieNoFileUploaded: '尚未上传文件',
        lottieResetSuccess: '✅ 所有颜色已重置为默认值。',
        lottieColorDetectedMessage: '🎯 检测到 {count} 种唯一颜色。为每个颜色输入新颜色，然后点击应用。',
        lottieFileStatusTemplate: '📄 文件: {name} — {size}KB — 准备提取颜色',
        lottieSuccessDownload: '✅ 已成功下载更新后的文件！',
        lottieReplaceError: '❌ 替换颜色时出错: ',
        lottieInvalidColorFormat: '⚠️ 格式无效: "{value}" — 请使用 #rrggbb 或 rgba()',
        lottieResetRowMessage: '🔄 颜色 "{displayKey}" 已重置为原始值',
        lottieColorTypeArray: '📦 RGBA 数组',
        lottieColorTypeHex: '🔤 Hex 字符串',
        lottieNewColorPlaceholder: '#rrggbb 或 rgba(...)',
        lottieConsoleReady: '脚本已准备好。上传 Lottie 文件。'
    },
    hi: {
        dir: 'ltr',
        pageTitle: '🧰 JSON टूल',
        pageSubtitle: 'ब्राउज़र-आधारित JSON उपयोगिताओं का एक छोटा समूह।',
        pageIntro: 'यह प्रोजेक्ट एक लैंडिंग पेज है जो और ब्राउज़र-आधारित JSON टूल के साथ बढ़ सकता है।',
        infoText: 'मुख्य पेज वर्तमान टूल को अलग-अलग सूचीबद्ध करता है।',
        footerText: 'प्रोजेक्ट अधिक टूल के साथ बढ़ने के लिए तैयार है।',
        langLabel: 'भाषा:',
        toolLinkJsonMinifier: '🗜️ JSON मिनिफायर',
        toolLinkLottie: '🎨 Lottie रंग बदलने वाला',
        indexTitle: '🧰 JSON टूल',
        jsonPageTitle: '🗜️ JSON मिनिफायर',
        jsonPageSubtitle: 'स्पेस और लाइन ब्रेक हटाएं और किसी भी JSON फ़ाइल को मिनिफाई करें।',
        jsonDropText: '📂 JSON फ़ाइल खींचें या चुनने के लिए क्लिक करें',
        jsonDownloadBtn: '📥 मिनिफाइड JSON डाउनलोड करें',
        jsonFooterText: 'केवल दिखावट बदलती है — सामग्री और संरचना सुरक्षित रहती है।',
        jsonStatusSuccess: '✅ मिनिफिकेशन पूरा हुआ!',
        jsonSizeBefore: '📄 मूल आकार:',
        jsonSizeAfter: '📦 मिनिफाइड आकार:',
        jsonSizeSaved: '🎯 आकार में कमी:',
        jsonFileTypeError: '❌ कृपया .json फ़ाइल चुनें',
        jsonFileReadError: '❌ फ़ाइल पढ़ने में त्रुटि',
        jsonInvalidJsonError: '❌ अमान्य JSON फ़ाइल: ',
        jsonDownloadStarted: '📁 डाउनलोड शुरू हुआ:',
        lottiePageTitle: '🎨 Lottie JSON रंग बदलने वाला',
        lottiePageSubtitle: '🔍 पुराने रंग निकालें, नए रंग चुनें और उन्हें लागू करें।',
        lottieUploadText: '📂 Lottie JSON फ़ाइल को यहाँ ड्रैग करें या चुनने के लिए क्लिक करें',
        lottieColorListTitle: '🎨 फ़ाइल में पाए गए अद्वितीय रंग',
        lottiePreviewHeader: 'पूर्वावलोकन',
        lottieOldValueHeader: 'मूल मान',
        lottieTypeHeader: 'प्रकार',
        lottieNewColorHeader: 'नया रंग (Hex या RGBA)',
        lottieActionHeader: 'कार्य',
        lottieApplyBtn: '✨ परिवर्तन लागू करें और अपडेट की गई फ़ाइल डाउनलोड करें',
        lottieResetMappingBtn: '⟳ सभी नए रंगों को मूल पर रीसेट करें',
        lottieFooterLine1: '⚡ फ़ाइल में हर रंग (stroke, fill, keyframes, expressions, ...) को बदल दिया जाएगा।',
        lottieFooterLine2: '✅ मूल रंग RGBA ऐरे [r,g,b,a] (0-1) या "#ffffff" जैसे Hex स्ट्रिंग हो सकते हैं।',
        lottieBackLink: '← होम पर वापस जाएँ',
        lottieInvalidJsonAlert: 'अमान्य JSON फ़ाइल: ',
        lottieChooseFileError: '.json एक्सटेंशन वाली JSON फ़ाइल चुनें',
        lottieNoFileUploaded: 'कोई फ़ाइल अपलोड नहीं की गई',
        lottieResetSuccess: '✅ सभी रंग डिफ़ॉल्ट पर रीसेट हो गए।',
        lottieColorDetectedMessage: '🎯 {count} अद्वितीय रंग पाए गए। प्रत्येक के लिए नया रंग दर्ज करें, फिर लागू पर क्लिक करें।',
        lottieFileStatusTemplate: '📄 फ़ाइल: {name} — {size}KB — रंग निकालने के लिए तैयार है',
        lottieSuccessDownload: '✅ अपडेट की गई फ़ाइल सफलतापूर्वक डाउनलोड हो गई!',
        lottieReplaceError: '❌ रंग बदलते समय त्रुटि: ',
        lottieInvalidColorFormat: '⚠️ अमान्य फ़ॉर्मेट: "{value}" — #rrggbb या rgba() का उपयोग करें',
        lottieResetRowMessage: '🔄 रंग "{displayKey}" को मूल पर रीसेट किया गया',
        lottieColorTypeArray: '📦 RGBA ऐरे',
        lottieColorTypeHex: '🔤 Hex स्ट्रिंग',
        lottieNewColorPlaceholder: '#rrggbb या rgba(...)',
        lottieConsoleReady: 'स्क्रिप्ट तैयार है। Lottie फ़ाइल अपलोड करें।'
    }
};

function getSavedLanguage() {
    const savedLang = localStorage.getItem('preferredLang');
    if (supportedLangs.includes(savedLang)) {
        return savedLang;
    }

    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    return supportedLangs.includes(browserLang) ? browserLang : defaultLang;
}

function formatString(str, vars = {}) {
    return str.replace(/\{(.*?)\}/g, (_, key) => vars[key] || '');
}

function getTranslation(key, vars = {}) {
    const text = translations[currentLang]?.[key] || translations[defaultLang]?.[key] || '';
    return formatString(text, vars);
}

function setLanguage(lang) {
    if (!supportedLangs.includes(lang)) {
        return;
    }
    currentLang = lang;
    localStorage.setItem('preferredLang', lang);
    translatePage();
}

function translatePage() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = translations[currentLang]?.dir || translations[defaultLang].dir;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        if (!key) return;
        element.textContent = getTranslation(key);
    });

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titleKey = pageTitle.dataset.i18n || 'pageTitle';
        document.title = getTranslation(titleKey) || document.title;
    }

    const jsonLink = document.getElementById('toolLinkJsonMinifier');
    if (jsonLink) {
        jsonLink.textContent = getTranslation('toolLinkJsonMinifier');
    }

    const lottieLink = document.getElementById('toolLinkLottie');
    if (lottieLink) {
        lottieLink.textContent = getTranslation('toolLinkLottie');
    }

    const langSelectField = document.getElementById('langSelect');
    if (langSelectField) {
        langSelectField.value = currentLang;
    }
}

function initI18n() {
    currentLang = getSavedLanguage();
    translatePage();

    const langSelectField = document.getElementById('langSelect');
    if (langSelectField) {
        langSelectField.addEventListener('change', (event) => setLanguage(event.target.value));
    }
}

initI18n();
