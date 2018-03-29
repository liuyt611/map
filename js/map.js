//地图上的小亮点--一小时刷新一次
var params = "?" + location.href.split('?')[1];
var _url = 'http://172.20.206.132:8088';
// var _url = 'http://172.16.224.83:8088';
// 172.20.206.132:8088/get_bubble_points----http://172.20.206.6:8088
var finish = true;
starHour();
function starHour(){
    $.ajax({
        url:_url + "/get_light_points" + params,
        type: "get",
        data:{'callback':'callback'},
        dataType:"json",
        success:function(data){
            // console.log(data,'starHour')
            var _data = data.data
            if(_data.length > 0){
                $('#starHour').html('');
            }
            var timerout = setTimeout(function(){
                starHour()
            },3600000);
            var _starHtml = '';

            for(var i = 0; i < _data.length;i ++){
                var _mark = {long:_data[i].longitude,lat:_data[i].latitude};
                var coordinate = projection([_mark.long,_mark.lat]);
                //生成页面小亮点
                _starHtml += '<div class="starHour"  style="transform:translate('+ coordinate[0] +'px,'+ coordinate[1] + 'px' +')"></div>';
            }
            $('#starHour').html(_starHtml);
        }
    });
}

//渲染数据
$("body").on("animationend",".marks",function(){
    $(this).css({
        opacity:1
    })
})
$("body").on("animationend",".starHour",function(){
    $(this).css({
        opacity:1
    })
})

// 广告系列
// var params = "?" + location.href.split('?')[1];
details();
function details(){ //renderData();
    $.ajax({
        url:_url + "/get_adv_card"+params,
        type: "get",
        data:{'callback':'callback'},
        dataType:"json",
        success:function(data){
            // console.log(data,'右上角图片')
            var timerout = setTimeout(function(){
                details()
            },5000);
            
            //渲染右上角数据
            var _html = '', _data = data.data;//, colorObj = {}
            for(var i = 0;i < _data.length;i++){
                var _dl = '',_img = _data[i].material_img_list;
                for(j = 0;j < _img.length;j++){
                    _dl += '<dd><img src="'+ _img[j] +'" /></dd>'
                }
                _html += '<dl>'+
                            '<dt>'+ _data[i].adv_name +'</dt>'+ _dl + 
                            '<dd class="endIcon"></dd>'+
                        '</dl>';
                // if(_data[i].color_id){
                //     colorObj[(i + 1)] = _data[i].color_id;
                // }
            }
            $('#detailsList').html(_html);

            //渲染气泡
            var params = "?" + location.href.split('?')[1];
            renderData();
            
        }
    })
}
function renderData(){
    if(finish){
        finish = false;
        $.ajax({
            url:_url + "/get_bubble_points"+params,
            type: "get",
            data:{'callback':'callback'},
            dataType:"json",
            success:function(data){
                // console.log(data,'气泡')
                renderPop(data.data)

                $('#pop').html(renderPop(data.data)['pop']);
                $('#starSecond').html(renderPop(data.data)['starSecond']);
                finish = true;
            }
        }) 
    }
}
function renderPop(data){    
    var _html={'pop':'','starSecond':''},_gender="",_ageMax = '',key,_sign,_mark,coordinate;
    var sex = {1:'男',2:'女',3:'未知'}
    for(var i = 0;i < data.length;i++){
        //gender 1男2女3未知,lon经度，lat纬度
        _gender = sex[data[i].gender]
        
        //年龄
        if(data[i].max_age > 50){
            _ageMax = 50;
        }else{
            _ageMax = data[i].max_age;
        }

        //气泡颜
        var colorObj = {
            1:'orange',
            2:'yellow',
            3: 'green',
            4: 'cyan',
            5: 'purple',
            6: 'pink'
        };
        // if(JSON.stringify(colorObj) === '{}'){//随机气泡颜色
        //     _sign = Math.ceil(Math.random() * 6); 
        // }else{
            for (key in colorObj){
                if(colorObj[key] === data[i].color){
                    _sign = key
                }
            }
        // }
        //生成气泡
        _mark = {long:data[i].longitude,lat:data[i].latitude};
        coordinate = projection([_mark.long,_mark.lat]);
        _html['pop'] += '<div class="marks marks'+ _sign +'" style="animation:fadeIn 4s;animation-delay:'+ (Math.random()) +'s;transform:translate('+ coordinate[0] +'px,'+ coordinate[1] + 'px' +')">'+
                '<span>' + _gender  + '</span>'+ data[i].min_age + '-' + _ageMax +
                '</div>';

        // 生成页面黄色小亮点---延迟60s消失
        _html['starSecond'] += '<div class="starSecond" node-id="10"  style="animation:fadeIn 4s;animation-delay:'+ (Math.random()) +'s;transform:translate('+ coordinate[0] +'px,'+ coordinate[1] + 'px' +')"></div>';
    }
    return _html;
}