var account = {
    // 添加交易
    addBuildUrl:"/transaction/build",
    // 转账确认
    confirmBuildUrl:"/transaction/confirm",
    trHtml:'<tr>\n' +
        '    <td class="b-0">%wkKey</td>\n' +
        '        <td class="text-right font-medium b-0">%wkValue</td>\n' +
        '        </tr>\n',
    wkKeyArray:['软件学院','互联网医疗协同创新中心','郑州大学第一附属医院','河南省人民医院'],
    init: function () {
        let that = this;
        that.createDongTai();
    },
    initEvents:function() {
        let that = this;
        $("#btnAdd").click(function () {
            let buildObjJson = that.getBuildJson();
            console.log(buildObjJson)
            httpPost(that.addBuildUrl,buildObjJson,function (e) {
                that.confirmBuild(buildObjJson,e);
            },function () {
                noticeError("交易失败!");
            })
        });
    },
    // 获取交易数据
    getBuildJson(){
        let from = $("#from").val();
        let to = $("#to").val();
        let amount = $("#amount").val();
        let privateKey = $("#privateKey").val();


        /*身体指标数据*/
        let niaoSuan = $("#niaoSuan").val()
        let xueXiao = $("#xueXiao").val()
        let xueTang = $("#xueTang").val()
        let ganYou = $("#ganYou").val()
        let xueYa = $("#xueYa").val()
        let guBing = $("#guBing").val()
        let data =
            "尿酸指标："+niaoSuan+";"+
            "血小板指标："+xueXiao+";"+
            "血糖指标："+xueTang+";"+
            "甘油三脂指标："+ganYou+";"+
            "血压指标："+xueYa+";"+
            "谷丙转氨酶指标："+guBing;
        let buildObj = {from:from,to:to,data:data,amount:amount,privateKey:privateKey};
        return JSON.stringify(buildObj);
    },
    confirmBuild(buildObjJson,e){
        let that = this;
        if (confirm(buildObjJson) === true) {
            for ( var key in e) {
                if(key === "data"){
                    var confirmData = e[key];
                    httpPost(that.confirmBuildUrl,JSON.stringify(confirmData),function () {
                        noticeSuccess("转账成功！");
                    },function () {
                        noticeError("转账失败！");
                    })
                }
            }
        } else {
            return ;
        }
    },
    createDongTai() {
        let that = this;
        let wkKeyArray = that.wkKeyArray;
        let trHtml = that.trHtml;
        let content = '';
        let numArr = getrandom(20, 100, 4);
        var chart = c3.generate({
            bindto: '#visitor',
            data: {
                columns: [
                    [wkKeyArray[0], numArr[0]],
                    [wkKeyArray[1], numArr[1]],
                    [wkKeyArray[2], numArr[2]],
                    [wkKeyArray[3], numArr[3]],
                ],
                type: 'donut',
                onclick: function (d, i) {
                    console.log("onclick", d, i);
                },
                onmouseover: function (d, i) {
                    console.log("onmouseover", d, i);
                },
                onmouseout: function (d, i) {
                    console.log("onmouseout", d, i);
                }
            },
            donut: {
                label: {
                    show: false
                },
                title: "算力",
                width: 20,
            },

            legend: {
                hide: true
                //or hide: 'data1'
                //or hide: ['data1', 'data2']
            },
            color: {
                pattern: ['#eceff1', '#745af2', '#26c6da', '#1e88e5']
            }
        });
        for (let i = 0; i < wkKeyArray.length; i++) {
            content += trHtml.replace(/%wkKey/g, wkKeyArray[i]).replace(/%wkValue/g, numArr[i]+".0%");
        }
        $("#pic").html(content)
    },

}
window.onload=function(){
    account.init();
    account.initEvents();
}
