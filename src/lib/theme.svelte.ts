let isDark = $state(false);
let initialized = $state(false);

export function initTheme() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('fictograph-theme');
    isDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme();
    initialized = true;
}

function applyTheme() {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('fictograph-theme', isDark ? 'dark' : 'light');

    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (favicon) {
        favicon.href = isDark ? '/favicon-dark.svg' : '/favicon-light.svg';
    }
}

export function toggleTheme() {
    isDark = !isDark;
    applyTheme();
}

export function getIsDark() {
    return isDark;
}

export function isInitialized() {
    return initialized;
}

