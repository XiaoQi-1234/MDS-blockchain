var commonMod = {
    // 获取诊疗数据
    getBlockMinUrl:"/block/mine",
    initEvents:function() {
        let that = this;
        $("#wK").click(function () {
            httpPost(that.getBlockMinUrl,null,function (msg) {
                if(msg['code'] != 200){
                    noticeError("挖矿失败");
                }else{
                    noticeSuccess("挖矿成功");
                }
                console.log(msg)
            },function () {
                noticeSuccess("挖矿成功");
            })
        });
    }
}
commonMod.initEvents()
