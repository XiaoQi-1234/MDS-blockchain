var dataTrace = {
    // 获取诊疗数据
    getAllBlockUrl:"/block/getallblock",
    tbHtml:'<div class="card-body" style="border: solid 1px lightgrey;margin-top: 30px;border-radius: 20px">\n' +
        '                                <table>\n' +
        '                                    <tr><td>诊疗编号:</td><td>%txHash</td></tr>\n' +
        '                                    <tr><td>我的账户：</td><td>%from</td></tr>\n' +
        '                                    <tr><td>医院账户：</td><td>%to</td></tr>\n' +
        '                                    <tr><td>医疗花费：</td><td>%amount</td></tr>\n' +
        '                                    <tr><td>诊断过程：</td><td>%data</td></tr>\n' +
        '                                    <tr><td>诊疗时间：</td><td>%time</td></tr>\n' +
        '                                </table>\n' +
        '                            </div>',
    trHtml:'<tr>\n' +
        '    <td class="b-0">%wkKey</td>\n' +
        '        <td class="text-right font-medium b-0">%wkValue</td>\n' +
        '        </tr>\n',
    wkKeyArray:['软件学院','互联网医疗协同创新中心','郑州大学第一附属医院','河南省人民医院'],
    init: function () {
        let that = this;

        httpPost(that.getAllBlockUrl,null,function(msg){
            if(msg['code'] == 200){
                let data = msg['data'];
                console.log(data)
                that.handleData(data);
            }
        },function(){});
        that.createDongTai();
    },
    handleData(allBlocks){
        let that = this;
        let $allTable = $("#allTable");
        let allBlockLen = allBlocks.length;
        for (let i = allBlockLen-1; i >= 0; i--) {
            let block = allBlocks[i];
            let blockBody = block['blockBody'];
            let transactions = blockBody['transactions'];
            that.handleTs(transactions,$allTable);
        }
    },
    handleTs(transactions,$allTable){
        let that = this;
        let tbHtml = that.tbHtml;
        let length = transactions.length;

        if(length>0){
            for (let i = length-1; i >= 0; i--) {
                let tr = transactions[i];
                let time = tr['timestamp'];
                let fmtDate = "";
                if(time !== ''){
                    let date = new Date(time);
                    fmtDate = date.format('yyyy年MM月dd日 hh:mm:ss');
                }
                let table = tbHtml
                    .replace(/%txHash/g,tr['txHash'])
                    .replace(/%from/g,tr['from'])
                    .replace(/%to/g,tr['to'])
                    .replace(/%amount/g,tr['amount'])
                    .replace(/%data/g,tr['data'])
                    .replace(/%time/g,fmtDate);

                $allTable.append(table);
            }
        }
    },
    initEvents:function() {

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
    dataTrace.init();
    dataTrace.initEvents();
}
