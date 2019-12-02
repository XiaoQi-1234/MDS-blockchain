var blockDetail = {
    // 获取最后一个区块
    getLastBlockUrl:"/block/lastblock",
    init: function () {
        let that = this;
        httpPost(that.getLastBlockUrl,null,function (msg) {
            console.log(msg);
            if(msg['code'] == 200){
                that.setValueToTable(msg['data']);
            }
        },function () {
            console.log("获取失败");
        })
    },
    setValueToTable(block){
        let blockHeader = block['blockHeader'];
        let blockBody = block['blockBody'];

        let $blockTable = $("#blockTable");

        let blockHeaderkeys = Object.keys(blockHeader);
        let bodyHtml = "<tbody>";
        bodyHtml += "<tr><td style='font-weight: bolder'><h4>blockHeader信息：</h4></td><td></td></tr>";
        blockHeaderkeys.forEach(key=>{
            bodyHtml += "<tr><td>"+key+":</td><td>"+blockHeader[key]+"</td></tr>";
            console.log(key)
            console.log(blockHeader[key])
        })
        bodyHtml += "<tr><td style='font-weight: bolder'><h4>blockBody信息：</h4></td><td></td></tr>";
        let blockKeys = Object.keys(blockBody);
        blockKeys.forEach(key=>{
            console.log(blockBody)
            if(key == "addresses"){
                let addresses = blockBody[key];
                let length = addresses.length;
                let adsContent = "";
                for (let i = 0; i < length; i++) {
                    let ads = addresses[i];
                    adsContent += (ads+"<br/>");
                }
                bodyHtml += "<tr><td>"+key+":</td><td>"+adsContent+"</td></tr>";
            }
            if(key == 'transactions'){
                let trs = blockBody[key];
                let length = trs.length;
                let trsContent = "";
                for (let i = 0; i < length; i++) {
                    let tr = trs[i];
                    trsContent += (tr['txHash']+"<br/>");
                }
                bodyHtml += "<tr><td>"+key+":</td><td>"+trsContent+"</td></tr>";
            }
        })
        bodyHtml += "</tbody>";
        $blockTable.html(bodyHtml);
    },
    initEvents:function() {

    },
}
window.onload=function(){
    blockDetail.init();
    blockDetail.initEvents();
}
