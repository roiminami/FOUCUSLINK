(function () {
    // ================= 1. 统一配置区 =================
    const FOCUSLINK_HOME = 'https://focuslink.minami.ac.cn/';
    const FOCUSLINK_SITES = [
        { name: '応用情報',   url: 'https://ipa.minami.ac.cn/ap', match: '/ap' },
        { name: '情報支援士', url: 'https://ipa.minami.ac.cn/sc', match: '/sc' },
        { name: 'TOEIC',      url: 'https://toeic.minami.ac.cn/', match: 'toeic.' },
        { name: 'ブログ',     url: 'https://minami.ac.cn/',       match: 'minami.ac.cn' }
    ];
    // ================================================

    if (document.getElementById('focuslink-global-bar')) return;

    const currentFullUrl = window.location.href;
    const currentHost = window.location.hostname;

    const style = document.createElement('style');
    style.textContent = `
        #focuslink-global-bar {
            background-color: #0f172a;
            color: #cbd5e1;
            border-bottom: 1px solid #1e293b;
            font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 11px;
            line-height: 1;
            user-select: none;
            width: 100%;
            box-sizing: border-box;
            position: relative;
            z-index: 9999;
        }
        #focuslink-global-bar * { box-sizing: border-box; }
        .fl-inner {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 16px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .fl-brand {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #ffffff;
            text-decoration: none;
            font-weight: 900;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            flex-shrink: 0;
        }
        .fl-brand:hover { opacity: 0.9; }
        .fl-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #2dd4bf;
            display: inline-block;
        }
        .fl-nav {
            display: flex;
            align-items: center;
            gap: 4px;
            overflow-x: auto;
            white-space: nowrap;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .fl-nav::-webkit-scrollbar { display: none; }
        .fl-link {
            padding: 4px 8px;
            border-radius: 4px;
            color: #cbd5e1;
            text-decoration: none;
            font-weight: 700;
            font-size: 10.5px;
            transition: background-color 0.15s, color 0.15s;
        }
        .fl-link:hover {
            color: #ffffff;
            background-color: #1e293b;
        }
        .fl-link.active {
            background-color: #4f46e5;
            color: #ffffff;
        }
    `;
    document.head.appendChild(style);

    const linksHtml = FOCUSLINK_SITES.map(site => {
        const isBlog = site.match === 'minami.ac.cn' && (currentHost === 'minami.ac.cn' || currentHost === 'www.minami.ac.cn');
        const isSubSite = site.match !== 'minami.ac.cn' && currentFullUrl.includes(site.match);
        const isLocalDefault = (currentHost === '' || currentHost === 'localhost') && site.match === '/ap';
        const isActive = isBlog || isSubSite || isLocalDefault;

        return `<a href="${site.url}" class="fl-link${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>${site.name}</a>`;
    }).join('');

    const barHtml = `
        <div id="focuslink-global-bar">
            <div class="fl-inner">
                <a href="${FOCUSLINK_HOME}" class="fl-brand">
                    <span class="fl-dot"></span>
                    <span>FocusLink</span>
                </a>
                <nav aria-label="FocusLink サイト切替" class="fl-nav">
                    ${linksHtml}
                </nav>
            </div>
        </div>
    `;

    function mountBar() {
        if (document.getElementById('focuslink-global-bar')) return;
        const target = document.getElementById('focuslink-bar-root');
        if (target) {
            target.innerHTML = barHtml;
        } else if (document.body) {
            document.body.insertAdjacentHTML('afterbegin', barHtml);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountBar);
    } else {
        mountBar();
    }
})();
