var allAccount = {
    // 所有账户url
    allAccountUrl:"/account/all",
    // 添加账户
    addAccountUrl:"/account/new",

    theadHtml:"<thead><tr><th>账户名称</th><th>账户余额</th></tr></thead>",
    init: function () {
        let that = this;
        that.initTable();
    },
    initTable(){
        let that = this;
        let $allAcountTable = $("#allCountTable");
        httpPost(that.allAccountUrl,"",function (msg) {
            $allAcountTable.append(that.theadHtml);
            if(msg['code'] === 200){
                let data = msg['data'];
                console.log(data)
                let keys = Object.keys(data);
                let bodyHtml = "<tbody>";
                if(keys != null && keys.length > 0){
                    keys.forEach(key => {
                        bodyHtml += "<tr><td>"+key+"</td><td>"+data[key]+"</td>\</tr>";
                    })
                }
                bodyHtml += "</tbody>"
                $allAcountTable.append(bodyHtml);
            }
        },function () {
            noticeError("查询失败");
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
    allAccount.init();
    allAccount.initEvents();
}
