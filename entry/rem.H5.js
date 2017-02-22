/**
 * Created by wangxin on 2016/8/27. 采用手淘适配方案。
 *
 * 本lib,将依据不同的屏幕dpr进行viewport缩放
 * 1、字体采用rem作为单位，则按屏幕等比例放大。
 * 2、若要限制字体大小不随屏幕大小变化，建议添加样式less[data-dpr = 2]{};
 * 3、若图片来自网络，建议将手动设置meta：<meta name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
 * 4、设计稿以750为准
 * 5、无论是安卓还是ios均读取其dpr = win.devicePixelRatio || 1;
 */

(function (win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name=' + 'viewport' + ']');
    var flexibleEl = doc.querySelector('meta[name=' + 'flexible' + ']');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});
    if ( metaEl ) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if ( match ) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if ( flexibleEl ) {
        var content = flexibleEl.getAttribute('content');
        if ( content ) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if ( initialDpr ) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
            if ( maximumDpr ) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
        }
    }

    if ( ! dpr && ! scale ) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if ( isIPhone ) {
            if ( devicePixelRatio >= 4 && (! dpr || dpr >= 4) ) {
                dpr = 4;
            }else if ( devicePixelRatio >= 3 && (! dpr || dpr >= 3) ) {
                dpr = 3;
            } else if ( devicePixelRatio >= 2 && (! dpr || dpr >= 2) ) {
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            dpr = 1;
        }
        scale = 1 / dpr;
    }
    docEl.setAttribute('data-dpr', dpr);

    if ( ! metaEl ) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if ( docEl.firstElementChild ) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem() {
        /*如果是750的设计稿*/
        var designWidth = 750;
        var width = docEl.clientWidth || docEl.getBoundingClientRect().width;

        /*以下为适配屏幕*/
        if ( width / dpr >= 768 ) {
            width = 768 * dpr;
        }

        var rem = width * 100 / designWidth;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function () {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function (e) {
        if ( e.persisted ) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);
    if ( doc.readyState === 'complete' ) {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function (e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }
    refreshRem();
    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function (d) {
        var val = parseFloat(d) * this.rem;
        if ( typeof d === 'string' && d.match(/rem$/) ) {
            val += 'px';
        }
        return val;
    };
    flexible.px2rem = function (d) {
        var val = parseFloat(d) / this.rem;
        if ( typeof d === 'string' && d.match(/px$/) ) {
            val += 'rem';
        }
        return val;
    }
})(window, window['lib'] || (window['lib'] = {}));
