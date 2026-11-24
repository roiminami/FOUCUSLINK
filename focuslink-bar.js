(function () {
    // ================= 1. 统一配置区 =================
    const FOCUSLINK_HOME = 'https://focuslink.minami.ac.cn/';
    const FOCUSLINK_NOTICE = '開発中 (WIP)'; // 顶部全局声明，不需要可留空 ''

    // wip: true 表示该站点/模块尚未开发，点击会弹出提示而不跳转
    const FOCUSLINK_SITES = [
        { name: '応用情報',   url: 'https://ipa.minami.ac.cn/ap', match: '/ap',          wip: false },
        { name: '情報支援士', url: 'https://ipa.minami.ac.cn/sc', match: '/sc',          wip: true  },
        { name: 'TOEIC',      url: 'https://toeic.minami.ac.cn/', match: 'toeic.',       wip: false },
        { name: 'ブログ',     url: 'https://minami.ac.cn/',       match: 'minami.ac.cn', wip: false }
    ];
    // ================================================

    if (document.getElementById('focuslink-global-bar')) return;

    const currentFullUrl = window.location.href;
    const currentHost = window.location.hostname;

    const style = document.createElement('style');
    style.textContent = `
        #focuslink-global-bar {
            background: rgba(15, 23, 42, 0.92);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            color: #cbd5e1;
            border-bottom: 1px solid #1e293b;
            font-family: 'Inter', 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 11px;
            line-height: 1;
            user-select: none;
            width: 100%;
            box-sizing: border-box;
            position: sticky;
            top: 0;
            z-index: 9999;
        }
        #focuslink-global-bar * { box-sizing: border-box; }
        .fl-inner {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 16px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .fl-left {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
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
        }
        .fl-brand:hover { opacity: 0.9; }
        .fl-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f97316, #2dd4bf);
            box-shadow: 0 0 8px rgba(249, 115, 22, 0.7);
            display: inline-block;
        }
        .fl-wip-banner {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 6px;
            border-radius: 999px;
            background: rgba(249, 115, 22, 0.14);
            border: 1px solid rgba(249, 115, 22, 0.35);
            color: #fdba74;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.02em;
        }
        .fl-nav {
            display: flex;
            align-items: center;
            gap: 6px;
            overflow-x: auto;
            white-space: nowrap;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .fl-nav::-webkit-scrollbar { display: none; }
        .fl-link {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 5px 9px;
            border-radius: 6px;
            color: #cbd5e1;
            text-decoration: none;
            font-weight: 700;
            font-size: 11px;
            transition: background-color 0.15s, color 0.15s, transform 0.15s;
        }
        .fl-link:hover {
            color: #ffffff;
            background-color: #1e293b;
        }
        .fl-link.active {
            background: linear-gradient(135deg, #4f46e5, #6366f1);
            color: #ffffff;
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.35);
        }
        .fl-link.is-wip {
            color: #64748b;
            cursor: not-allowed;
        }
        .fl-link.is-wip:hover {
            color: #94a3b8;
            background-color: rgba(30, 41, 59, 0.5);
        }
        .fl-tag {
            font-size: 9px;
            padding: 1px 4px;
            border-radius: 3px;
            background: #1e293b;
            color: #94a3b8;
            border: 1px solid #334155;
        }
        #fl-toast {
            position: fixed;
            top: 44px;
            right: 16px;
            background: #0f172a;
            color: #f8fafc;
            border: 1px solid #f97316;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
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
        const isBlog = site.match === 'minami.ac.cn' && (currentHost === 'minami.ac.cn' || currentHost === 'www.minami.ac.cn');
        const isSubSite = site.match !== 'minami.ac.cn' && currentFullUrl.includes(site.match);
        const isLocalDefault = (currentHost === '' || currentHost === 'localhost') && site.match === '/ap';
        const isActive = !site.wip && (isBlog || isSubSite || isLocalDefault);

        if (site.wip) {
            return `<a href="javascript:void(0)" class="fl-link is-wip" data-wip-name="${site.name}" title="現在開発中です">
                <span>${site.name}</span>
                <span class="fl-tag">準備中</span>
            </a>`;
        }

        return `<a href="${site.url}" class="fl-link${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>${site.name}</a>`;
    }).join('');

    const noticeHtml = FOCUSLINK_NOTICE
        ? `<span class="fl-wip-banner" title="一部コンテンツは現在開発中のデモです">🚧 ${FOCUSLINK_NOTICE}</span>`
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
                <nav aria-label="FocusLink サイト切替" class="fl-nav">
                    ${linksHtml}
                </nav>
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
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
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
                    showToast(`🚧 「${name}」は現在開発中です（近日公開予定）`);
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
