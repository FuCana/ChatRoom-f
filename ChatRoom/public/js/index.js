/**
 * Created by hxsd on 2016/12/9.
 */




$(function () {
    // 标志变量，标志用户是否已登录
    var isLogin = false;

    // 和socket服务器建立连接，获得客户端的socket对象
    // 会发起向服务器的连接请求
    var clientSocket = io();

    // 监听服务器端发过来的消息
    clientSocket.on("hello", function (data) {
        alert("服务器端说：" + data);
    });

    // 客户端socket监听服务器发过来的消息
    clientSocket.on("message", function (data) {
        var type = data.type;   // 提交消息类型
        // 根据消息类型，作出相应的处理
        switch (type) {
            case "100": // 自己已经登入聊天室
                isLogin = true;
                showChatPanel(data);    // 显示聊天面板
                break;
            case "101": // 系统消息，有新用户进入聊天室
                if(isLogin) showWelcomeMsg(data);
                break;
            case "102": // 系统消息，有用户离开聊天室
                if(isLogin) showUserLeave(data);
                break;
            case "200": // 自身的聊天信息
                if(isLogin) showSelfChatMsg(data);
                break;
            case "201": // 群发的其他用户聊天信息
                if(isLogin) showChatMsg(data);
                break;
        }
    });
    // 滚动窗口的函数
    function scroll(){
        // 有多远，滚多远
        $("#messages").scrollTop($("#messages").prop("scrollHeight"));
    }

    // 在聊天窗口显示用户离开聊天室的消息
    function showUserLeave(data){
        // 在聊天界面给出提示信息
        var welcome = "<div class='loginMsg'>[系统消息]" + data.nickname + "离开了聊天室</div>";
        $("#messages").append(welcome);
        $("#Left").find(".DuringNum").text(data.users.length);
        console.log(users);

        scroll();   // 滚动窗口到最底部
    }

    // 在聊天窗口显示自己身的聊天信息
    function showSelfChatMsg(data){
        // 在聊天界面给出提示信息
        var welcome = "<div class='selfMsg'>"+data.content + "<div class='Me'><img src='"+data.photo+"'/></div></div>";
        $("#messages").append(welcome);


        scroll();   // 滚动窗口到最底部
    }


    // 在聊天窗口显示其他用户的聊天信息
    function showChatMsg(data){
        // 在聊天界面给出提示信息
        var welcome = "<p>"+data.nickname+"</p><div id='OthersMsg' class=''><div class='Others'><img src='"+data.photo+"'/></div>" + data.content + "</div>";
        $("#messages").append(welcome);

        scroll();   // 滚动窗口到最底部
    }

    // 在聊天窗口显示欢迎新用户的消息
    function showWelcomeMsg(data){
        // 在聊天界面给出提示信息
        var welcome = "<div class='loginMsg'>[系统消息]欢迎新用户," + data.nickname + "!</div>";
        $("#messages").append(welcome);
        $("#Left").find(".DuringNum").text(data.users.length);

        scroll();   // 滚动窗口到最底部
    }

    // 显示聊天界面的函数
    function showChatPanel(data) {
        // 隐藏登录界面
        $("#welcome").hide();

        // 显示聊天界面
        $("#chatroom").show();

        $("#Left").find(".name").text(data.nickname);
        $("#Left").find("img").attr("src",data.photo);
        $("#Left").find(".xingbie").text(data.gender);
        $("#Left").find(".DuringNum").html(data.users.length);


        // 在聊天界面给出提示信息
        var welcome = "<div class='loginMsg'>[系统消息]您已进入聊天室，请文明聊天!</div>";
        $("#messages").append(welcome);
    }

    // 响应用户登录事件
    $("#startchat").on("click", function () {
        // 获取用户输入的昵称
        var nickname = $.trim($("#nickname").val());

        var photo = $("#photo").find(".Bigpic").attr("src");

        var gender = $("#gender>p").text();
        console.log(gender);


        // 对昵称进行合法性验证(格式(是否为空..),有效性) - 略
        // ...

        // 构造要发给服务器端的消息内容
        var content = {
            type: "101",    // 代表用户登录
            nickname: nickname,
            photo: photo,
            gender: gender
        };

        // 发送登录信息给服务器端
        clientSocket.send(content); // send默认发送的是"message"
    });

    // 发送聊天内容
    $("#send").on("click",function(){
        // 获取用户输入的聊天内容
        var content = $.trim($("#message").val());

        // 非空验证、敏感词过滤等，略
        if(content == ""){
            alert("请输入内容！！！！！")
            return false;
        };

        // 发送给服务器端：先构造要发送的消息结构
        var message = {
            type: "201",    // 类型是公共聊天内容
            content: content
        };
        clientSocket.send(message);

        // 清空输入框
        $("#message").val("");
    });

    // 回车发送聊天内容
    $("#message").on("keyup",function(e){
        // 判断是否按下了回车键
        if(e.keyCode == 13){
            $("#send").click();
        }
    });
//-------------------------------------------------------------//


    $("#gender").on("click",function(){
        $("#gender").find("ul").slideDown();
    });

    $(".menu").find("li").each(function(index){

        $(this).on("click",function(event){
            event.stopPropagation(); //阻止事件冒泡
            $("#gender>p").text($(this).text());
            $(".menu").hide();

        })
    })

//换头像
    $("#photo").find(".Bigpic").on("click",function(){
        $("#chooseTX").slideDown();
    });
    $("#chooseTX").find("img").each(function(index){
        $(this).on("click",function(){
            var thispic = $(this).attr("src");
            $(".Bigpic").attr("src",thispic);
            $("#chooseTX").slideUp();
        });
    });



//----------------------------------------------
});


//------------------------------------------------------------//

















