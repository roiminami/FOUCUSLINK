(function () {
    // ================= 1. 统一配置区 =================
    const FOCUSLINK_HOME = 'https://focuslink.minami.ac.cn/';
    const FOCUSLINK_NOTICE = 'SYS.UPDATE // 応用情報(AP)・TOEICポータル稼働中';

    // wip: true 表示该站点/模块尚未开发，点击会弹出提示而不跳转
    const FOCUSLINK_SITES = [
        { name: 'Portal',     url: 'https://focuslink.minami.ac.cn/', match: 'focuslink.',   wip: false, icon: '⚡' },
        { name: '応用情報',   url: 'https://ipa.minami.ac.cn/ap',     match: '/ap',          wip: false, icon: '💻' },
        { name: '情報支援士', url: 'https://ipa.minami.ac.cn/sc',     match: '/sc',          wip: true,  icon: '🛡️' },
        { name: 'TOEIC',      url: 'https://toeic.minami.ac.cn/',     match: 'toeic.',       wip: false, icon: '🌍' },
        { name: 'ブログ',     url: 'https://minami.ac.cn/',           match: 'minami.ac.cn', wip: false, icon: '✍️' }
    ];
    // ================================================

    if (document.getElementById('focuslink-global-bar')) return;

    const currentFullUrl = window.location.href;
    const currentHost = window.location.hostname;

    const style = document.createElement('style');
    style.textContent = `
        #focuslink-global-bar {
            background: rgba(5, 7, 14, 0.95);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            color: #cbd5e1;
            border-bottom: 1px solid rgba(0, 240, 255, 0.25);
            font-family: 'JetBrains Mono', 'Inter', 'Noto Sans JP', monospace;
            font-size: 11px;
            line-height: 1;
            user-select: none;
            width: 100%;
            box-sizing: border-box;
            position: sticky;
            top: 0;
            z-index: 9999;
            box-shadow: 0 4px 24px rgba(0, 240, 255, 0.08);
        }
        #focuslink-global-bar * { box-sizing: border-box; }
        .fl-inner {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 16px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .fl-left {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
        }
        .fl-brand {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            color: #ffffff;
            text-decoration: none;
            font-weight: 900;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            font-size: 12px;
        }
        .fl-brand:hover { color: #00f0ff; }
        .fl-dot {
            width: 8px;
            height: 8px;
            background: #00f0ff;
            box-shadow: 0 0 10px #00f0ff;
            display: inline-block;
            animation: flPulse 1.8s infinite ease-in-out;
        }
        @keyframes flPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.25); opacity: 0.65; }
        }
        .fl-wip-banner {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 3px 8px;
            background: rgba(255, 0, 85, 0.12);
            border: 1px solid rgba(255, 0, 85, 0.45);
            color: #ff6b9d;
            font-size: 10px;
            font-weight: 700;
        }
        .fl-right-group {
            display: flex;
            align-items: center;
            gap: 10px;
            overflow: hidden;
        }
        .fl-nav {
            display: flex;
            align-items: center;
            gap: 5px;
            overflow-x: auto;
            white-space: nowrap;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .fl-nav::-webkit-scrollbar { display: none; }
        .fl-link {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 5px 10px;
            color: #cbd5e1;
            text-decoration: none;
            font-weight: 700;
            font-size: 11px;
            white-space: nowrap;
            transition: all 0.18s ease;
            border: 1px solid transparent;
        }
        .fl-link:hover {
            color: #00f0ff;
            background-color: rgba(0, 240, 255, 0.08);
            border-color: rgba(0, 240, 255, 0.3);
        }
        .fl-link.active {
            background: rgba(0, 240, 255, 0.14);
            border-color: #00f0ff;
            color: #00f0ff;
            box-shadow: 0 0 12px rgba(0, 240, 255, 0.25);
        }
        .fl-link.is-wip {
            color: #64748b;
            cursor: not-allowed;
        }
        .fl-link.is-wip:hover {
            color: #ff0055;
            background-color: rgba(255, 0, 85, 0.08);
            border-color: rgba(255, 0, 85, 0.3);
        }
        .fl-tag {
            font-size: 9px;
            padding: 1px 4px;
            background: rgba(255, 0, 85, 0.15);
            color: #ff6b9d;
            border: 1px solid rgba(255, 0, 85, 0.35);
        }
        .fl-badge-cert {
            display: none;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: rgba(255, 230, 0, 0.1);
            border: 1px solid rgba(255, 230, 0, 0.45);
            color: #ffe600;
            font-size: 10px;
            font-weight: 800;
            white-space: nowrap;
        }
        @media (min-width: 900px) {
            .fl-badge-cert { display: inline-flex; }
        }
        @media (max-width: 640px) {
            .fl-wip-banner { display: none; }
        }
        #fl-toast {
            position: fixed;
            top: 48px;
            right: 16px;
            background: rgba(5, 7, 14, 0.96);
            backdrop-filter: blur(10px);
            color: #00f0ff;
            border: 1px solid #ff0055;
            padding: 10px 14px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            box-shadow: 0 0 25px rgba(255, 0, 85, 0.35);
            z-index: 10000;
            opacity: 0;
            transform: translateY(-6px);
            pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        #fl-toast.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    const linksHtml = FOCUSLINK_SITES.map(site => {
        const isPortal = site.match === 'focuslink.' && (
            currentHost.includes('focuslink.') ||
            currentHost === '' ||
            currentHost === 'localhost' ||
            currentHost === '127.0.0.1'
        );
        const isBlog = site.match === 'minami.ac.cn' && (currentHost === 'minami.ac.cn' || currentHost === 'www.minami.ac.cn');
        const isSubSite = site.match !== 'minami.ac.cn' && site.match !== 'focuslink.' && currentFullUrl.includes(site.match);
        const isActive = !site.wip && (isPortal || isBlog || isSubSite);

        if (site.wip) {
            return `<a href="javascript:void(0)" class="fl-link is-wip" data-wip-name="${site.name}" title="現在開発中です">
                <span>${site.icon} ${site.name}</span>
                <span class="fl-tag">DEV</span>
            </a>`;
        }

        return `<a href="${site.url}" class="fl-link${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>
            <span>${site.icon} ${site.name}</span>
        </a>`;
    }).join('');

    const noticeHtml = FOCUSLINK_NOTICE
        ? `<span class="fl-wip-banner">⚡ ${FOCUSLINK_NOTICE}</span>`
        : '';

    const barHtml = `
        <div id="focuslink-global-bar">
            <div class="fl-inner">
                <div class="fl-left">
                    <a href="${FOCUSLINK_HOME}" class="fl-brand">
                        <span class="fl-dot"></span>
                        <span>FocusLink</span>
                    </a>
                    ${noticeHtml}
                </div>
                <div class="fl-right-group">
                    <nav aria-label="FocusLink サイト切替" class="fl-nav">
                        ${linksHtml}
                    </nav>
                    <span class="fl-badge-cert" title="運営者 累計取得資格数">🏆 36_CERTS</span>
                </div>
            </div>
        </div>
        <div id="fl-toast" role="status" aria-live="polite"></div>
    `;

    let toastTimer = null;
    function showToast(message) {
        const toast = document.getElementById('fl-toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
    }

    function mountBar() {
        if (document.getElementById('focuslink-global-bar')) return;
        const target = document.getElementById('focuslink-bar-root');
        if (target) {
            target.innerHTML = barHtml;
        } else if (document.body) {
            document.body.insertAdjacentHTML('afterbegin', barHtml);
        }

        const bar = document.getElementById('focuslink-global-bar');
        if (bar) {
            bar.addEventListener('click', (e) => {
                const wipLink = e.target.closest('.fl-link.is-wip');
                if (wipLink) {
                    e.preventDefault();
                    const name = wipLink.getAttribute('data-wip-name') || 'このモジュール';
                    showToast(`[DEV_LOCK] 「${name}」モジュールは現在構築中です`);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mountBar);
    } else {
        mountBar();
    }
})();
