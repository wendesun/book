var Ajax =  {
    _cache:{},
    _get:function (url, params, success, error) {
        if (this._cache[url]){
            return;
        }
        this._cache[url] = true;
        var that = this;
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            data: params,
            timeout: 5000,
            success: function (data) {
                that._cache[url] = false;
                success && success(data)
            },
            error: function (xhr, type) {
                that._cache[url] = false;
                error && error()
            }
        })
    }
}

var MockData = {
    bookList:{
        'bookList|20': [{
            'photo': '@Image("100x100", "#FF6600")',
            'name': '@ctitle',
            'status|1': ['未借阅', '借阅中'],
            'classify|1': ['PHP', 'JAVA', 'Javascript', 'Python'],
            'description': '@cparagraph',
            'borrower': '@cname',
            'startTime': '@date("yyyy-MM-dd HH:mm")'
        }],
        'scode|1':[200, 400]
    },
    historyList:{
        'historyList|20': [{
            'photo': '@Image("100x100", "#FF6600")',
            'name': '@ctitle',
            'status|1': ['未借阅', '借阅中'],
            'classify|1': ['PHP', 'JAVA', 'Javascript', 'Python'],
            'startTime': '@date("yyyy-MM-dd HH:mm")',
            'endTime': '@date("yyyy-MM-dd HH:mm")'
        }],
        'scode|1':[200, 400]
    },
    init:function () {
        var data = Mock.mock({
            // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
            'list|1-10': [{
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'id|+1': 1
            }]
        });

        Mock.mock(/\.json/, this.bookList);
        Mock.mock(/\.json/, this.historyList);
        // 输出结果
        console.log(JSON.stringify(bookList, null, 4));
    }
}

var Load = {
    show:function (delay) {
        delay = delay || 1500;
        var html = '<div class="loading hide flex flex-pack-center flex-align-center">' +
            '<div class="spinner">' +
            '<div class="spinner-container container1">' +
            '<div class="circle1"></div>' +
            '<div class="circle2"></div>' +
            '<div class="circle3"></div>' +
            '<div class="circle4"></div>' +
            '</div>' +
            '<div class="spinner-container container2">' +
            '<div class="circle1"></div>' +
            '<div class="circle2"></div>' +
            '<div class="circle3"></div>' +
            '<div class="circle4"></div>' +
            '</div>' +
            '<div class="spinner-container container3">' +
            '<div class="circle1"></div>' +
            '<div class="circle2"></div>' +
            '<div class="circle3"></div>' +
            '<div class="circle4"></div>' +
            '</div>' +
            '</div>' +
            '</div>';
        if($(".loading").length === 0){
            $(html).appendTo("body");
        }
        $(".loading").removeClass("hide");
        if(delay){
            this.hide(delay);
        }
    },
    hide:function (delay) {
        delay = delay || 0;
        if (delay > 0) {
            setTimeout(function () {
                $(".loading").addClass("hide");
            }, delay);
        } else {
            $(".loading").addClass("hide");
        }
    }
}

var Tip = {
    show:function (msg, delay) {
        msg = msg || "";
        delay = delay || 3000;
        var html = '<div id="Tip" class="tip hide">' + msg + '</div>';
        if($("#Tip").length === 0){
            $(html).appendTo("body");
            $("#Tip").removeClass("hide");
        }
        if(delay){
            this.hide(delay);
        }
    },
    hide:function (delay) {
        delay = delay || 0;
        if (delay > 0) {
            setTimeout(function () {
                $("#Tip").remove();
            }, delay);
        } else {
            $("#Tip").remove();
        }
    }
}

var Layer = {
    init:function () {
        this.stopTouchMove(); //禁止浮层划动
        this.close();
    },
    stopTouchMove:function () {
        $("body").on("touchmove tap", ".layer", function (e) {
            e.preventDefault();
        });
    },
    show:function () {
        $(".layer").removeClass("hide");
    },
    close:function () {
        $("body").on("tap", ".layer .layer-bg", function () {
            $(".layer").remove();
        })
    }
}

var Book =  {
    listCache: {},
    historyCache: {},
    init:function () {
        this.navbar();
        this.listItem();
        this.loadList();
    },
    navbar:function () {
        $("#bookList").tap(function () {
            $(".book-history").addClass("hide");
            $(".book-list").html("");
            Tip.hide(); //关闭异常提示
            Book.loadList();
					

        });
        $("#myHistory").tap(function () {
            $(".book-list").addClass("hide");
            $(".book-history").html("");
            Tip.hide(); //关闭异常提示
            Book.loadHistory();

        })
    },
    listItem:function () {
        $(".book-list").on("tap", ".book-panel", function (e) {
            var index = $(this).index();
            var book = Book.listCache.bookList[index];
            var photo = book.photo,
                name = book.name,
                status = book.status,
                classify = book.classify,
                description = book.description,
                borrower = book.borrower,
                startTime = book.startTime;
            var html = '<div class="layer hide">' +
                '<div class="layer-bg"></div>' +
                '<div class="layer-main">' +
                    '<img src="' + photo + '" alt="">' +
                        '<div class="layer-content">' +
                            '<h3>' + name + '</h3>' +
                            '<p>' + classify + '</p>' +
                            '<p class="layer-description">' + description + '</p>' +
                            '<span class="layer-book-label">' + status + '</span>' +
                        '</div>' +
                        '<div class="layer-book-status">' +
                            '<p>借阅人：' + borrower + '</p>' +
                            '<p>借阅时间：' + startTime + '</p>' +
                        '</div>' +
                '</div>' +
            '</div>';
            if($(".layer").length === 0){
                $(html).appendTo("body");
            }
            Layer.show();
            e.prevent;
        });
    },
    loadList:function () {
        Load.show();
        Mock.mock(/\.json/, MockData.bookList);
        var that = this;
        Ajax._get("book.json",{},function (data) {
            // console.log(JSON.stringify(data, null, 4));
            if(data.scode != 200){
                Load.hide();
                Tip.show("接口异常，请重试！");
                return
            }
            that.listCache = data;
            var html = "",
                name = "",
                classify = "",
                status = "",
                photo = "";
            for(var i = 0; i< data.bookList.length; i++){
                name =  data.bookList[i].name;
                classify =  data.bookList[i].classify;
                status =  data.bookList[i].status;
                photo = data.bookList[i].photo;
                html += '<a href="javascript:void(0);" class="book-panel">' +
                    '<div class="flex flex-pack-center">' +
                    '<div class="book-photo">' +
                    '<img src="'+ photo +'" alt="">' +
                    '</div>' +
                    '<div class="book-content flex-1">' +
                    '<h3>'+ name +'</h3>' +
                    '<p>' + classify + '</p>' +
                    '<span class="label label-default">' + status + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</a>';
            }
            $(".book-list").html(html);
            Load.hide();
            $(".book-list").removeClass("hide");

        },function () {
            alert("网络异常")
        })
    },
    loadHistory:function () {
        Load.show();
        Mock.mock(/\.json/, MockData.historyList);
        Ajax._get("history.json",{},function (data) {
            if(data.scode != 200){
                Load.hide();
                Tip.show("接口异常，请重试！");
                return
            }
            Book.historyCache = data;
            var html = "",
                photo = "",
                name = "",
                classify = "",
                status = "",
                startTime = "",
                endTime = "";
            for(var i = 0; i< data.historyList.length; i++){
                photo = data.historyList[i].photo;
                name =  data.historyList[i].name;
                classify =  data.historyList[i].classify;
                status =  data.historyList[i].status;
                startTime =  data.historyList[i].startTime;
                endTime =  data.historyList[i].endTime;
                html += '<div class="book-panel flex flex-pack-center">' +
                    '<div class="book-photo">' +
                        '<img src="' + photo + '" alt="">' +
                    '</div>' +
                    '<div class="book-content flex-1">' +
                        '<div>' +
                            '<span class="book-status">' + status +'</span>' +
                            '<h3>'+ name + '</h3>' +
                        '</div>' +
                        '<p>' + classify +'</p>' +
                        '<p>借阅时间：' + startTime + '</p>' +
                        '<p>归还时间：' + endTime + '</p>' +
                    '</div>' +
                '</div>';
            }
            $(".book-history").html(html);
            Load.hide(); //关闭加载中
            $(".book-history").removeClass("hide");
        },function () {
            alert("网络异常")
        })
    }
}

Layer.init();
Book.init();
