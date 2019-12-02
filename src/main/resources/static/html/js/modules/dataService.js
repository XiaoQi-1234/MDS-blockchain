var dataService = {
    curRowNums:2,
    curArray:[],

    tr1Html:'<tr>\n' +
        '    <td class="b-0">%wkKey</td>\n' +
        '        <td class="text-right font-medium b-0">%wkValue</td>\n' +
        '        </tr>\n',
    wkKeyArray:['软件学院','互联网医疗协同创新中心','郑州大学第一附属医院','河南省人民医院'],
    trHtml:'<tr id="tr_%rowNum">\n' +
        '                                        <td>\n' +
        '                                            <div class="form-group row" style="margin-bottom: 0px;">\n' +
        '                                                <label class="control-label col-md-3 col-form-label" for="source" style="padding-right: 0px;">明文：</label>\n' +
        '                                                <div class="col-md-9" style="padding-left: 0px">\n' +
        '                                                    <input type="text" class="form-control" id="ming_%rowNum" name="ming_%rowNum" title="">\n' +
        '                                                </div>\n' +
        '                                            </div>\n' +
        '                                        </td>\n' +
        '                                        <td>\n' +
        '                                             <div class="form-group row" style="margin-bottom: 0px;">\n' +
        '                                                 <label class="control-label col-md-3 col-form-label" for="source" style="padding-right: 0px;">密文：</label>\n' +
        '                                                 <div class="col-md-9" style="padding-left: 0px">\n' +
        '                                                     <input type="text" class="form-control" id="mi_%rowNum" name="mi_%rowNum" title="">\n' +
        '                                                 </div>\n' +
        '                                             </div>\n' +
        '                                         </td>\n' +

        '                                         <td>\n' +
        '                                            <button id="btnDel_%rowNum" type="button" class="btn btn-primary">删除</button>\n' +
        '                                        </td>'+
        '                                    </tr>',

    // 获取诊疗数据
    getTTResUrl:"/hom/encrypt",

    init: function () {
        let that = this;
        that.createDongTai();
        that.initOriginRow();
    },
    handleData(data){
    },
    initOriginRow(){
        let that = this;
        let curRowNums = that.curRowNums;
        for (let i = 0; i < curRowNums; i++) {
            that.createRow(i);
        }
    },
    createRow(rowNum){
        let that = this;

        var $allMing = $("#allMing");
        let row = that.trHtml.replace(/%rowNum/g,rowNum);
        $allMing.append(row);

        that.createClickEvent(rowNum);

        that.addArray(rowNum);
    },
    addArray(rowNum){
        let that = this;
        that.curArray.push(rowNum);
    },
    createClickEvent(rowNum){
        let that = this;
        let array = that.curArray;
        $("#btnDel_"+rowNum).click(function () {
            $("#tr_"+rowNum).remove();
            let index  = array.indexOf(rowNum);
            array.splice(index,1);
            if(array.length === 0){
                that.curRowNums = 0;
            }
            console.log(that.curArray);
        });
    },
    initEvents:function() {
        let that = this;
        let array = that.curArray;
        $("#btnConfirm").click(function () {
            let objJson = that.getDataFromPage();
            console.log(objJson)
            httpPost(that.getTTResUrl,objJson,function (msg) {
                noticeSuccess("加密成功！");
                let data = msg['data'];
                let sumSecrettexts = data['sum_secrettext'];
                for (let i = 0; i < array.length; i++) {
                    let index = array[i];
                    $("#mi_"+index).val(sumSecrettexts[i]);
                }
                $("#mingSum").val(data['sum_plain']);
                $("#miSum").val(data['sum_secret']);
            },function () {
                noticeError("加密失败！");
            })
        });


        // 添加一行
        $("#btnAddRow").click(function () {
            let curRowNums = that.curRowNums;
            that.createRow(curRowNums);
            that.curRowNums += 1;
        });
    },
    getDataFromPage(){
        let from = $("#from").val();
        let to = $("#to").val();
        let privateKey = $("#privateKey").val();
        let that = this;
        let array = that.curArray;
        let plaintext = [];
        array.forEach(function (item,inde) {
            let ming = $("#ming_"+item).val();
            plaintext.push(ming);
        })
        let data= {plaintext:plaintext,sum_plain:"",sum_secret:"",sum_secrettext:[]};
        let obj = {to:to,from:from,sk:privateKey,hd:data};
        console.log(obj)
        return JSON.stringify(obj);
    },
    createDongTai() {
        let that = this;
        let wkKeyArray = that.wkKeyArray;
        let trHtml = that.tr1Html;
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
    dataService.init();
    dataService.initEvents();
}
