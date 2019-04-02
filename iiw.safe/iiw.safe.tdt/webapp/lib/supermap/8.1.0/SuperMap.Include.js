    var r = new RegExp("(^|(.*?\\/))(SuperMap.Include\.js)(\\?|$)"),
        s = document.getElementsByTagName('script'),
        src, m, baseurl = "";

    for(var i=0, len=s.length; i<len; i++) {
        src = s[i].getAttribute('src');
        if(src) {
            var m = src.match(r);
            if(m) {
                baseurl = m[1];
                break;
            }
        }
    }

    function inputScript(inc){
        var url = inc;
        var element = document.createElement('script');
        element.type  = 'text/javascript';
        element.src = url;
        document.getElementsByTagName('head')[0].appendChild(element);
    }

    function inputCSS(style){
        var url = baseurl + '../theme/default/' + style;
        var element = document.createElement('link');
        element.type  = 'text/css';
        element.rel  = 'stylesheet';
        element.href = url;
        document.getElementsByTagName('head')[0].appendChild(element);
    }

    //加载类库资源文件
    function loadSuperMapLibs(cFun) {
        loadLocalization();
        inputCSS('style.css');
        inputCSS('google.css');
        if(cFun) cFun();
    }

    //引入汉化资源文件
    function loadLocalization() {
        var userLang;
        //针对不通浏览器做语言浏览器做判断
        if(navigator.userLanguage){
            //针对IE浏览器
            userLang = navigator.userLanguage;
        }else if(navigator.languages){
            //针对Chrome
            userLang = navigator.languages[0];
        }else{
            //其他
            userLang = navigator.language;
        }
        if(userLang.indexOf('zh') > -1){
            inputScript(baseurl + 'Lang/zh-CN.js');
        }else{
            inputScript(baseurl + 'Lang/en.js');
        }
    }