var fileInput2 = {
    //
    addFileUrl:"/file/uploaded",
    // 转账确认
    init: function () {
        let that = this;
        that.createFile();
    },
    createFile(){

    },
    initEvents:function() {
        console.log("aaaaaaaaaaa")
        let that = this;
        $("#btnAdd").click(function () {
            console.log("aaaaaaaa")
            var formdata=new FormData()
            console.log($("#fileA")[0].files)
            formdata.append('from',$("#from").val())
            formdata.append('to',$("#to").val())
            formdata.append('sk',$("#sk").val())
            formdata.append('file',$("#fileA")[0].files[0])
            console.log(formdata)
            $.ajax({
                url:'/file/uupload',
                type:'post',
                processData:false, //告诉jQuery不要去处理发送的数据
                contentType:false,// 告诉jQuery不要去设置Content-Type请求头
                data:formdata,
                success:function (data) {
                    if(data['code']== '0x0000'){
                        noticeSuccess("上传成功")
                        //window.location.href='data-trace-profile.html';
                        $("#from").val("")
                        $("#to").val("")
                        $("#sk").val("")
                        $("#fileA").val("")
                    }else{
                        noticeError("上传失败")}
                }
            })
        });
    },
    getJson(){
        let from = $("#from").val();
        let to = $("#to").val();
        let sk = $("#sk").val();
        let fileUrl = $("#file_url").val();
        let buildObj = {from:from,to:to,sk:sk,fileUrl:fileUrl};
        return JSON.stringify(buildObj);
    },
}
window.onload=function(){
    console.log("2222")
    fileInput2.init();
    fileInput2.initEvents();
}
