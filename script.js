const translations = window.I18N_TRANSLATIONS || {};
const supportedLangs = ['fa', 'en', 'zh', 'hi'];
const defaultLang = 'fa';
let currentLang = defaultLang;

function getSavedLanguage() {
    const savedLang = localStorage.getItem('preferredLang');
    if (supportedLangs.includes(savedLang)) {
        return savedLang;
    }

    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    return supportedLangs.includes(browserLang) ? browserLang : defaultLang;
}

function formatString(str, vars = {}) {
    if (!str) return '';
    return str.replace(/\{(.*?)\}/g, (_, key) => vars[key] ?? '');
}

function getTranslation(key, vars = {}) {
    const text = translations[currentLang]?.[key] || translations[defaultLang]?.[key] || '';
    return formatString(text, vars);
}

function applyI18nToElement(element) {
    if (element.dataset.i18n) {
        element.textContent = getTranslation(element.dataset.i18n);
    }
    if (element.dataset.i18nHtml) {
        element.innerHTML = getTranslation(element.dataset.i18nHtml);
    }
    if (element.dataset.i18nPlaceholder) {
        element.placeholder = getTranslation(element.dataset.i18nPlaceholder);
    }
    if (element.dataset.i18nTitle) {
        element.title = getTranslation(element.dataset.i18nTitle);
    }
    if (element.dataset.i18nValue && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
        element.value = getTranslation(element.dataset.i18nValue);
    }
}

function translatePage() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = translations[currentLang]?.dir || translations[defaultLang].dir;

    document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-title], [data-i18n-value]').forEach(applyI18nToElement);

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titleKey = pageTitle.dataset.i18n || 'pageTitle';
        document.title = getTranslation(titleKey) || document.title;
    }

    const langSelectField = document.getElementById('langSelect');
    if (langSelectField) {
        langSelectField.value = currentLang;
    }

    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
}

function setLanguage(lang) {
    if (!supportedLangs.includes(lang)) {
        return;
    }
    currentLang = lang;
    localStorage.setItem('preferredLang', lang);
    translatePage();
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
