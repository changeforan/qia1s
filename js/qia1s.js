/**
 * Created by cs on 15-3-21.
 */
var errorvalue = 50;
var sum = 0;
var lap_count = 0;
var startTime;
var lapStartTime;
var timer;
var endTime;
var arr_results = new Array();
var title = new Array('不堪一击','毫不足虑','不足挂齿','初学乍练','勉勉强强','初窥门径','初出茅庐','略知一二','普普通通','平平常常','平淡无奇','粗懂皮毛','半生不熟','登堂入室','略有小成','已有小成','鹤立鸡群','驾轻就熟','青出於蓝','融会贯通','心领神会','炉火纯青','了然於胸','略有大成','已有大成','豁然贯通','非比寻常','出类拔萃','罕有敌手','技冠群雄','神乎其技','出神入化','傲视群雄','登峰造极','无与伦比','所向披靡','一代宗师','精深奥妙','神功盖世','举世无双','惊世骇俗','撼天动地','震古铄今','超凡入圣','威镇寰宇','空前绝后','天人合一','深藏不露','深不可测','返璞归真','极准很准');

$(document).ready(init());
function init(){
    $(document).on("pageshow","#rank",rankPageShow);
    $('#bt_show').css('display','none');
    $('#button').touchstart(buttonPressed);
    $("#bt_share").click(share);


}

function share(){

    if (( $("#name").val() != "")&&(strlen($("#name").val()) < 12 )) {
        $.post("server/rank.php",
            {
                action:"insert",
                name:$("#name").val(),
                points:sum,
                title:$("#txt_show_title").text()
            },
            function(data,status){
                if (data == 'success') {
                    alert("提交成功！");
                    location.href='#game';
                }
            });
    } else {alert('错误：昵称为空或过长！')}

}
function buttonPressed(){
    switch ($('#button').text()) {
        case "开始":
            $('#button').text('计次');
            startTime = new Date().getTime();
            lapStartTime = startTime;
            var node = $('<tr></tr>').html("<th data-priority='1'>计次</th><th data-priority='2'>时间(毫秒)</th><th data-priority='3'>得分</th>");
            $('#results_table_head').append(node);
            timer=setInterval("updatetimer()",5);
            break;
        case "计次":
            endTime = new Date().getTime();
            var lap = endTime-lapStartTime;
            if (isGameOver(lap)) {
                clearInterval(timer);
                updatetimer();
                para = document.createElement('h2');
                para.innerHTML = '总分:'+sum+' 获得称号:'+ title[(sum>51000) ? 50 : (parseInt(sum/1000))];
                $('#timer_total').after(para);
                $('#txt_show_sum').text(sum);
                $('#txt_show_title').text(title[(sum>51000) ? 50 : (parseInt(sum/1000))]);
                $('title').text("我在掐一秒游戏获得" + sum +"分，荣获称号:"+title[(sum>51000) ? 50 : (parseInt(sum/1000))]);
                $('#button').text('再来一次');
                $('#bt_show').css('display','');
            }else{
                var points = 0;
                if (lap == 1000) { points = 300;}else {points = 100 + Math.round( 100 - (100/errorvalue) * Math.abs(lap - 1000) ); }
                lap_count++;
                sum += points;
                var para = document.createElement('tr');
                para.innerHTML = '<th>'+lap_count+'</th>'+'<td>'+Math.abs(lap)+'</td>'+'<td>'+points+'</td>';
                $('#results_table_body').prepend(para);
                $('#results_table').table('refresh');


            }
            lapStartTime = new Date().getTime();

            break;
        case "再来一次":
            $('title').text("掐一秒游戏");
            $('#button').text('开始');
            $('#results_table_body').empty();
            $('#results_table_head').empty();
            $('#bt_show').css('display','none');
            $('#timer_total').text('00:00.00');
            $('#timer_lap').text('计次:0.00');
            $('h2').remove();
            sum = 0;
            lap_count = 0;
            break;
        default :
    }


}

function updatetimer(){
    endTime = new Date().getTime();
    var total = Number(endTime) - Number(startTime);
    var ms = total % 1000;
    ms = Math.round(ms / 10);
    total = parseInt(total / 1000);
    var s = total % 60;
    total = parseInt(total / 60);
    var min = total % 60;
    total = parseInt(total / 60);
    var h = total;
    $('#timer_total').text((min<10? '0'+min : min )+':'+(s<10? '0'+s : s )+'.'+(ms<10? '0'+ms : ms ));

    var lap = Number(endTime) - Number(lapStartTime);
    $('#timer_lap').text('计次:'+(lap/1000).toFixed(2));
}

function isGameOver(lap){
    return (Math.abs(lap - 1000) > errorvalue);
}

function rankPageShow(){
    $.post("server/rank.php",
        {action:"check"},
        function(data,status){
            $('#rank_table_body').empty();
            var i = 0;
            $.each(data,function(idx,item){
                i++;
                var para=$("<tr></tr>").html('<th>'+i+'</th>'+'<td>'+item.name +'</td>'+'<td>'+item.points+'</td>'+'<td>'+item.title +'</td>');
                $('#rank_table_body').append(para);
            });
            $('#rank_table').table('refresh');
        },
        "json"
    );
}

function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            len++;
        }
        else {
            len+=2;
        }
    }
    return len;
}