package com.blockchain.core.controller;

import cn.hutool.crypto.digest.DigestUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.blockchain.bean.extend.UpTX;
import com.blockchain.bean.extend.UploadFile;
import com.blockchain.bean.extend.UploadMsg;
import com.blockchain.bean.transaction.Transaction;
import com.blockchain.bean.transaction.TransactionRequest;
import com.blockchain.checker.CheckResult;
import com.blockchain.checker.RequestChecker;
import com.blockchain.common.ResultGenerator;
import com.blockchain.common.TransactionStatus;
import com.blockchain.core.net.MessageBuilder;
import com.blockchain.core.net.PacketType;
import com.blockchain.core.net.Sender;
import com.blockchain.core.pool.TransactionPool;
import com.blockchain.db.LevelDbStoreImpl;
import com.blockchain.server.CheckService;
import com.blockchain.server.TransactionService;
import org.iq80.leveldb.DB;
import org.iq80.leveldb.DBIterator;
import org.iq80.leveldb.impl.Iq80DBFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/file")
@CrossOrigin
public class FileController {
    private static final Logger LOGGER = LoggerFactory.getLogger(FileController.class);
    @Value("${filePath}")
    private String filePath;

    @Autowired
    private LevelDbStoreImpl levelDbStore;
    @Autowired
    public TransactionService transactionService;
    @Autowired
    public CheckService checkService;
    @Autowired
    public TransactionPool transactionPool;
    @Autowired
    public DB db;

    @PostMapping("/upload")
    @ResponseBody
    // 文件第一次上传处理
    public UploadMsg fileUpload(@RequestParam MultipartFile[] file, HttpServletRequest request) {
        System.out.println("upload");
        String from = request.getParameter("from");
        String to = request.getParameter("to");
        String sk = request.getParameter("sk");


        UploadMsg uploadMsg = new UploadMsg();
        Map<String, String> data = new HashMap<String, String>();
        if (file[0].isEmpty()) {
            uploadMsg.setCode("0x0001");
            return uploadMsg;
        } else {
            String[] fileName = new String[file.length];
            for (int i = 0; i < file.length; i++) {
                fileName[i] = file[i].getOriginalFilename();
            }
            String filepath = filePath;
            File localFile = new File(filepath);
            if (!localFile.exists()) {
                localFile.mkdirs();
            }
            try {
                for (int i = 0; i < file.length; i++) {

                    String path = filepath + fileName[i];
                    File server_file = new File(path);

                    file[i].transferTo(server_file);

                    String fileHash = DigestUtil.sha256Hex(server_file);
                    data.put(fileHash, path);

                }
                LOGGER.info("文件上传成功！");
                uploadMsg.setCode("0x0000");
                uploadMsg.setData(data);
                return uploadMsg;
            } catch (Exception e) {
                e.printStackTrace();
                LOGGER.info("文件上传异常");
                uploadMsg.setCode("0x0000");
                return uploadMsg;
            }

        }
    }

    @PostMapping("/uploaded")
    @ResponseBody
    // 文件第二次上传处理交易
    public UploadMsg fileUpload(@RequestBody JSON txJson) throws Exception {
        UploadMsg uploadMsg = new UploadMsg();
        UpTX upTX = JSON.parseObject(txJson.toJSONString(), UpTX.class);

        Map<String, String> pathMap = upTX.getData();
        Iterator<Map.Entry<String, String>> pathIterator = pathMap.entrySet().iterator();

        List<String> fNameList = new ArrayList<String>();
        while (pathIterator.hasNext()) {
            // 存储如数据库
            Map.Entry<String, String> entry = pathIterator.next();
            UploadFile uploadFile = new UploadFile();
            uploadFile.setFileHash(entry.getKey());
            String allPath = entry.getKey();
            uploadFile.setFilePath(allPath);
            fNameList.add(allPath.substring(allPath.lastIndexOf(File.separator) + 1));
            uploadFile.setUpUser(upTX.getFrom());
            uploadFile.setUpDate(System.currentTimeMillis());

            levelDbStore.put("file_" + entry.getKey(), JSON.toJSONString(uploadFile));
        }
        TransactionRequest transactionRequest = new TransactionRequest();
        transactionRequest.setAmount(new BigDecimal(-10));
        transactionRequest.setData("上传文件：" + String.join(",", fNameList));
        transactionRequest.setFrom(upTX.getFrom());
        transactionRequest.setPrivateKey(upTX.getSk());
        transactionRequest.setTo(upTX.getTo());

        // 这里校验请求参数
        RequestChecker.checkTransaction(transactionRequest);
        Transaction transaction = transactionService.buildTransaction(transactionRequest);
        // 这里校验交易数据的合法性
        if (checkService.checkTran(transaction).getCode() != CheckService.OK) {
            transaction.setStatus(TransactionStatus.FAIL);
            ResultGenerator.genFailResult("交易构建失败");
        }

        // confirm
        CheckResult result = checkService.checkTran(transaction);
        boolean confirm = transactionPool.addTransaction(transaction);
        // 打包信息到交易池成功,即当前交易池不存在此交易hash
        if (confirm && result.getCode() == CheckService.OK) {
            // 发送给其他节点
            Sender.sendGroup(MessageBuilder.buildTransactionPacket(transaction, PacketType.TRANSACTION_INFO_REQUEST));
            uploadMsg.setCode("0x0000");
        } else if (!confirm) {
            uploadMsg.setCode("0x0001");
        } else {
            uploadMsg.setCode("0x0001");
        }
        return uploadMsg;
    }

    @PostMapping("/uupload")
    @ResponseBody
    // 文件第一次上传处理
    public UploadMsg fileUupload(@RequestParam MultipartFile[] file, HttpServletRequest request) {
        System.out.println("upload");
        String from = request.getParameter("from");
        String to = request.getParameter("to");
        String sk = request.getParameter("sk");
        System.out.println(from);

        System.out.println(file.length);

        List<String> fNameList = new ArrayList<String>();
        UploadMsg uploadMsg = new UploadMsg();
        Map<String, String> data = new HashMap<String, String>();
        if (file[0].isEmpty()) {
            uploadMsg.setCode("0x0001");
            return uploadMsg;
        } else {
            String[] fileName = new String[file.length];
            for (int i = 0; i < file.length; i++) {
                fileName[i] = file[i].getOriginalFilename();
            }
            String filepath = filePath;
            File localFile = new File(filepath);
            if (!localFile.exists()) {
                localFile.mkdirs();
            }
            try {
                for (int i = 0; i < file.length; i++) {

                    String path = filepath + fileName[i];
                    File server_file = new File(path);

                    file[i].transferTo(server_file);

                    String fileHash = DigestUtil.sha256Hex(server_file);
                    // data.put(fileHash, path);
                    // 存储如数据库
                    UploadFile uploadFile = new UploadFile();
                    uploadFile.setFileHash(fileHash);
                    String allPath = path;
                    uploadFile.setFilePath(allPath);
                    fNameList.add(allPath.substring(allPath.lastIndexOf('/') + 1));
                    uploadFile.setUpUser(from);
                    uploadFile.setUpDate(System.currentTimeMillis());

                    levelDbStore.put("file_" + fileHash, JSON.toJSONString(uploadFile));

                }

                TransactionRequest transactionRequest = new TransactionRequest();
                transactionRequest.setAmount(new BigDecimal(10));
                transactionRequest.setData("上传文件：" + String.join(",", fNameList));
                transactionRequest.setFrom(to);
                transactionRequest.setPrivateKey(sk);
                transactionRequest.setTo(from);

                // 这里校验请求参数
                RequestChecker.checkTransaction(transactionRequest);
                Transaction transaction = transactionService.buildTransaction(transactionRequest);
                // 这里校验交易数据的合法性
                if (checkService.checkTran(transaction).getCode() != CheckService.OK) {
                    transaction.setStatus(TransactionStatus.FAIL);
                    ResultGenerator.genFailResult("交易构建失败");
                }

                // confirm
                CheckResult result = checkService.checkTran(transaction);
                boolean confirm = transactionPool.addTransaction(transaction);
                // 打包信息到交易池成功,即当前交易池不存在此交易hash
                if (confirm && result.getCode() == CheckService.OK) {
                    // 发送给其他节点
                    Sender.sendGroup(MessageBuilder.buildTransactionPacket(transaction, PacketType.TRANSACTION_INFO_REQUEST));
                    uploadMsg.setCode("0x0000");
                    LOGGER.info("文件上传成功！");
                } else if (!confirm) {
                    uploadMsg.setCode("0x0001");
                } else {
                    uploadMsg.setCode("0x0001");
                }
                return uploadMsg;
            } catch (Exception e) {
                e.printStackTrace();
                LOGGER.info("文件上传异常");
                uploadMsg.setCode("0x0000");
                return uploadMsg;
            }

        }
    }

    @PostMapping("/listFile")
    @ResponseBody
    // 文件列表展示
    public List<UploadFile> fileList() {
        Map<String, String> hashMap = new HashMap<>();
        List<UploadFile> fileList = new ArrayList<UploadFile>();
        try {
            DBIterator iterator = db.iterator();
            while (iterator.hasNext()) {
                Map.Entry<byte[], byte[]> next = iterator.next();
                String key = Iq80DBFactory.asString(next.getKey());
                if (key.startsWith("file_")) {
                    String value = Iq80DBFactory.asString(next.getValue());
                    hashMap.put(key, value);
                }
            }

            Iterator<Map.Entry<String, String>> mapIterator = hashMap.entrySet().iterator();
            while (mapIterator.hasNext()) {
                Map.Entry<String, String> entry = mapIterator.next();
                String value = entry.getValue();
                UploadFile uf = JSON.parseObject(value, UploadFile.class);
                fileList.add(uf);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileList;
    }


    @PostMapping("/download")
    @ResponseBody
    // 文件下载
    public void download(HttpServletResponse response,HttpServletRequest request) throws Exception {
        // 文件地址，真实环境是存放在数据库中的
        String hash  = request.getParameter("hash");
        System.out.println("++++++++++++++");
        System.out.println(hash);
        System.out.println("++++++++++++++");
        String  fileInfo = levelDbStore.get("file_" + hash);
        UploadFile uf = JSON.parseObject(fileInfo, UploadFile.class);
        String path = uf.getFilePath();
        String fName = path.substring(path.lastIndexOf('/')+1);

        System.out.println(path);
        File file = new File(path);
        // 创建输入对象
        FileInputStream fis = new FileInputStream(file);
        // 设置相关格式
        response.setContentType("application/force-download;charset=UTF-8");
        // 设置下载后的文件名以及header
        response.addHeader("Content-disposition", "attachment;fileName=" + fName);
        // 创建输出对象
        OutputStream os = response.getOutputStream();
        // 常规操作
        byte[] buf = new byte[1024];
        int len = 0;
        while ((len = fis.read(buf)) != -1) {
            os.write(buf, 0, len);
        }
        fis.close();

        /*if (file.exists()) {
           // response.setContentType("application/force-download");// 设置强制下载不打开
            response.addHeader("Content-Disposition", "attachment;fileName=" + java.net.URLEncoder.encode(file.getName(), "UTF-8"));// 设置文件名

            byte[] buffer = new byte[1024];
            FileInputStream fis = null;
            BufferedInputStream bis = null;
            try {
                fis = new FileInputStream(file);
                bis = new BufferedInputStream(fis);
                OutputStream os = response.getOutputStream();
                int i = bis.read(buffer);
                while (i != -1) {
                    os.write(buffer, 0, i);
                    i = bis.read(buffer);
                }
                System.out.println("success");
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (bis != null) {
                    try {
                        bis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if (fis != null) {
                    try {
                        fis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
   */


    }
}
