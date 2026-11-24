(function () {
    // ================= 1. 统一配置区 =================
    const FOCUSLINK_HOME = 'https://focuslink.minami.ac.cn/';
    const FOCUSLINK_NOTICE = '2026 修士論文・事業計画公開中';

    // wip: true 表示该站点/模块尚未开发，点击会弹出提示而不跳转
    const FOCUSLINK_SITES = [
        { name: 'Portal',     url: 'https://focuslink.minami.ac.cn/', match: 'focuslink.',   wip: false, icon: '🔥' },
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
            background: rgba(11, 15, 25, 0.94);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            color: #cbd5e1;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 11px;
            line-height: 1;
            user-select: none;
            width: 100%;
            box-sizing: border-box;
            position: sticky;
            top: 0;
            z-index: 9999;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45);
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
            letter-spacing: 0.06em;
            text-transform: uppercase;
            font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 12px;
        }
        .fl-brand:hover { opacity: 0.92; }
        .fl-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff6b35, #00f5d4);
            box-shadow: 0 0 10px rgba(255, 107, 53, 0.85);
            display: inline-block;
            animation: flPulse 2s infinite ease-in-out;
        }
        @keyframes flPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.25); opacity: 0.7; }
        }
        .fl-wip-banner {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 3px 8px;
            border-radius: 999px;
            background: linear-gradient(90deg, rgba(249, 115, 22, 0.16), rgba(236, 72, 153, 0.16));
            border: 1px solid rgba(249, 115, 22, 0.38);
            color: #fdba74;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.02em;
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
            border-radius: 7px;
            color: #cbd5e1;
            text-decoration: none;
            font-weight: 700;
            font-size: 11px;
            white-space: nowrap;
            transition: all 0.18s ease;
            border: 1px solid transparent;
        }
        .fl-link:hover {
            color: #ffffff;
            background-color: rgba(30, 41, 59, 0.85);
            border-color: rgba(255, 255, 255, 0.1);
        }
        .fl-link.active {
            background: linear-gradient(135deg, rgba(249, 115, 22, 0.22), rgba(236, 72, 153, 0.22));
            border-color: rgba(249, 115, 22, 0.55);
            color: #ffffff;
            box-shadow: 0 0 12px rgba(249, 115, 22, 0.25);
        }
        .fl-link.is-wip {
            color: #64748b;
            cursor: not-allowed;
        }
        .fl-link.is-wip:hover {
            color: #94a3b8;
            background-color: rgba(30, 41, 59, 0.45);
        }
        .fl-tag {
            font-size: 9px;
            padding: 1px 5px;
            border-radius: 4px;
            background: #1e293b;
            color: #94a3b8;
            border: 1px solid #334155;
        }
        .fl-badge-cert {
            display: none;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 6px;
            background: rgba(0, 245, 212, 0.1);
            border: 1px solid rgba(0, 245, 212, 0.3);
            color: #5eead4;
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
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
            background: rgba(15, 23, 42, 0.96);
            backdrop-filter: blur(10px);
            color: #f8fafc;
            border: 1px solid #f97316;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 700;
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.55);
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
                <span class="fl-tag">準備中</span>
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
                    <span class="fl-badge-cert" title="運営者 盧易南 累計取得資格数">🏆 36 CERTS</span>
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
                    const name = wipLink.getAttribute('data-wip-name') || 'このページ';
                    showToast(`🚧 「${name}」モジュールは現在開発中です（近日公開予定）`);
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
