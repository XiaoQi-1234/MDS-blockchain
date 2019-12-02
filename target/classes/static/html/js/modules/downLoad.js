var downLoad = {
    // 所有账户url
    allFileUrl:"/file/listFile",
    // 添加账户
    downLoadFileUrl:"/file/download",

    theadHtml:"<thead><tr><th>用户</th><th>文件名</th><th>上传日期</th><th>操作</th></tr></thead>",
    init: function () {
        let that = this;
        that.initTable();
    },
    initTable(){
        let that = this;
        let $allFileTable = $("#allFileTable");
        httpPost(that.allFileUrl,null,function (msg) {
            console.log(msg)

            $allFileTable.append(that.theadHtml);
                let data =msg
                console.log(data);
                let bodyHtml = "<tbody>";
                if(data != null && data.length > 0){
                    data.forEach(obj => {
                        let fmtDate = "";
                        let time = obj['upDate']
                        if(time !== ''){
                            let date = new Date(time);
                            fmtDate = date.format('yyyy年MM月dd日 hh:mm:ss');
                        }
                        let filePath = obj['filePath']
                        let index = filePath.lastIndexOf('/');
                        let path = filePath.substr(index+1)
                        console.log(path)
                        let upUser = obj['upUser'];
                        if( upUser == undefined){
                            upUser ="未知"
                        }
                        bodyHtml += "<tr>" +
                            "<td>"+upUser+"</td>" +
                            "<td>"+path+"</td>" +
                            "<td>"+fmtDate+"</td>" +
                            "<td><form method='post' action="+that.downLoadFileUrl+"><input type='text' style='display: none'  name='hash' value="+obj['fileHash']+"><button type='submit'  class='btn btn-primary' value=''>下载</button></form></td>" +
                            "</tr>";
                    })
                }
                bodyHtml += "</tbody>"
                $allFileTable.append(bodyHtml);
        },function () {
            noticeError("查询失败");
        })
    },
    downLoadFile(fileHash){
        let that = this;
        console.log('===========================')
        console.log(fileHash)
        console.log('===========================')
        let json = JSON.stringify({hash:fileHash})
        console.log(json)
        httpPost(that.downLoadFileUrl,json,function (msg) {
            console.log(msg)
        },function () {

        })
    },
    initEvents:function() {
        let that = this;
        let $addModal = $("#addModal");
        let addAccountUrl = that.addAccountUrl;
        $("#btnAdd").click(function () {
            httpPost(addAccountUrl,null,function (msg) {
                console.log(msg);
                if(msg['code'] == 200){
                    let data = msg['data'];
                    $("#keyWords").val(data['keyWords']);
                    $("#privateKey").val(data['privateKey']);
                    $("#publicKey").val(data['publicKey']);
                    $("#address").val(data['address']);
                    $addModal.modal('show');
                }
            },function () {
                noticeError("创建账户失败");
            })
        });
        $("#confirmBtn").click(function () {
            that.closeModal($addModal);
            that.clearModal();
            that.afterClose();
        });

        //当模态对话框关闭时，清空数据
        $addModal.on("hidden.bs.modal",()=>{
            that.closeModal($addModal);
            that.clearModal();
            noticeSuccess("新建账户成功！")
        })
    },
    afterClose(){
        let that = this;
        that.clearTable()
        that.initTable();

    },
    clearModal(){
        $("#keyWords").val("");
        $("#privateKey").val("");
        $("#publicKey").val("");
        $("#address").val("");
    },
    closeModal($modal){
        $modal.modal('hide')
    },
    clearTable(){
        let $allAcountTable = $("#allCountTable");
        $allAcountTable.html("");
    },
}
window.onload=function(){
    downLoad.init();
    downLoad.initEvents();
}
