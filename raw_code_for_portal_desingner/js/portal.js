//zackey_portal_manage
(() => {
    
    var setting_APP = 1;

    function filesrc(filekey, ID, content) {

        const b = navigator.userAgent.toLowerCase();

        var apiurl = '/k/v1/file.json?fileKey=' + filekey;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', apiurl, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');	//これが無いとIE,FFがNG
        xhr.responseType = "blob";
        var blob = xhr.responseType;
        xhr.onload = function () {
            //blobからURL生成
            var blob = xhr.response;
            var url = window.URL || window.webkitURL;
            var image = url.createObjectURL(blob);

            if (content == 'app') {

                $('#APPID_' + ID + '_img_' + content).attr('src', image);

            } else if (content == 'portal') {

                //ブラウザで指定方法振り分け
                if (b.indexOf("safari") != -1 || b.indexOf("chrome") != -1 || b.indexOf("ipad") != -1 || b.indexOf("ipod") != -1 || b.indexOf("iphone") != -1 || b.indexOf("android") != -1) {

                    $('#portal-img-key').css({ 'background-image': '-webkit-linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + image + ')' });

                } else if (ua.indexOf("firefox")) {

                    $('#portal-img-key').css({ 'background-image': '-moz-radial-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + image + ')' });

                } else {

                    $('#portal-img-key').css({ 'background-image': 'radial-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + image + ')' });

                }

            } else {

                $('#SPACE_' + ID + '_img_' + content).attr('src', image);

            }
        };
        xhr.send();

    }

    function Portal_header(array) {
        const record = array[0];
        $('#app-header').text(record['アプリ群タイトル'].value);
        $('#space-header').text(record['スペースタイトル'].value);
        $('#info-header').text(record['お知らせタイトル'].value);

        filesrc(record['ポータル背景_画像'].value[0].fileKey, 0, 'portal');

    }

    function color_selector(b, ID, cl1, cl2, angle) {

        //ブラウザで指定方法振り分け
        if (b.indexOf("safari") != -1 || b.indexOf("chrome") != -1 || b.indexOf("ipad") != -1 || b.indexOf("ipod") != -1 || b.indexOf("iphone") != -1 || b.indexOf("android") != -1) {

            $('#APP_' + ID + '_color').css({ 'background': '-webkit-linear-gradient(' + angle + 'deg, ' + cl1 + ' 0%, ' + cl2 + ' 100%)' });

        } else if (ua.indexOf("firefox")) {

            $('#APP_' + ID + '_color').css({ 'background': '-moz-radial-gradient(' + angle + 'deg, ' + cl1 + cl2 + ' ' });

        } else {

            $('#APP_' + ID + '_color').css({ 'background': 'radial-gradient(' + angle + 'deg, ' + cl1 + cl2 + ')' });

        }

    }

    function MakeAppList(r, cl, browser) {

        let ID = r["アプリID"].value;
        let NAME = r['アプリ名'].value;
        let FILE_KEY = r['アプリアイコン'].value[0].fileKey;

        let VIEW = r['優先一覧ID'].value ? r['優先一覧ID'].value : null;

        //要素作成
        let list = document.createElement('li');
        let a = document.createElement('a');
        let div = document.createElement('div');
        let img = document.createElement('img');
        let p = document.createElement('p');

        //構造作成
        list.appendChild(a);
        a.appendChild(div);
        a.appendChild(p);
        div.appendChild(img);

        //クラス付与、各要素追加
        $(list).addClass('basic-app');

        $(a).addClass('basic-app-link');
        a.href = location.origin + location.pathname + ID + '/';

        if (VIEW != null) {
            a.href += '?view=' + VIEW;
        }

        $(div).addClass('basic-app-icon');
        $(div).addClass('basic-app-icon--color');
        $(div).attr('id', 'APP_' + ID + '_color');

        $(img).addClass('basic-app-icon-img');
        $(img).attr('id', 'APPID_' + ID + '_img_app');

        $(p).addClass('basic-app-name');
        p.innerText = NAME;

        $('#basic-app-list').append(list);

        filesrc(FILE_KEY, ID, 'app');

        color_selector(browser, ID, cl.first, cl.second, cl.angle);

    }

    function MakeSpaceList(ID, NAME, FILE_KEY) {

        //要素作成
        let list = document.createElement('li');
        let a = document.createElement('a');
        let div = document.createElement('div');
        let img = document.createElement('img');
        let p = document.createElement('p');

        //構造作成
        list.appendChild(a);
        a.appendChild(div);
        div.appendChild(img);
        a.appendChild(p);

        //クラス付与、各要素追加
        $(list).addClass('basic-space');

        $(a).addClass('basic-space-link');
        if (location.pathname != '/k/m/') {
            a.href = location.origin + location.pathname + '#/space/' + ID;
        } else {
            a.href = location.origin + location.pathname + 'space/' + ID;
        }

        $(div).addClass('basic-space-img-container');

        $(img).addClass('basic-space-img');
        $(img).attr('id', 'SPACE_' + ID + '_img_space');

        $(p).addClass('basic-space-name');
        p.innerText = NAME;

        $('#basic-space-list').append(list);

        filesrc(FILE_KEY, ID, 'space');

    }

    function Apps_shortcuts(array) {
        const records = array;

        const users_browser = navigator.userAgent.toLowerCase();

        for (let i = 0; i < records.length; i++) {

            const record = records[i];

            const color = {
                'angle': record['数値'].value,
                'first': record['カラー1'].value,
                'second': record['カラー2'].value,
            };

            MakeAppList(record, color, users_browser);

        }

    }

    function Information(array) {
        const records = array;

        let box = document.createElement('div');
        box.innerHTML = records[0]['お知らせ内容'].value;

        $(box).appendTo($('#basic-info'));
    }

    function Spaces_shortcuts(array) {
        const records = array;

        for (let i = 0; i < records.length; i++) {

            const record = records[i];

            MakeSpaceList(record['スペースID'].value, record['スペース名'].value, record['スペースアイコン'].value[0].fileKey);

        }

    }


    var setting_body = {
        'app': setting_APP,
        'query': 'order by 管理番号 asc, アプリ優先順位 asc, スペース優先順位 asc,更新日時 desc limit 100 offset 0'
    };

    kintone.api(kintone.api.url('/k/v1/records', true), 'GET', setting_body, function (resp) {

        const records = resp.records;

        //各種レコード枠
        const portal = [];
        const info = [];
        const apps = [];
        const space = [];

        //レコード判別,格納
        for (let de = 0; de < records.length; de++) {
            switch (Number(records[de]['管理番号'].value)) {

                case 0:
                    portal.push(records[de]);
                    break;

                case 1:
                    info.push(records[de]);
                    break;

                case 2:
                    apps.push(records[de]);
                    break;

                case 3:
                    space.push(records[de]);
                    break;
            }
        }

        //ポータルヘッダー設定
        Portal_header(portal);

        Apps_shortcuts(apps);

        Information(info);

        Spaces_shortcuts(space);

    }, function (error) {
        console.log(error);
    });
})();