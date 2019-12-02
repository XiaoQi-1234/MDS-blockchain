package com.blockchain.core.controller;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.tio.utils.json.Json;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.blockchain.base.BaseData;
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
import com.blockchain.crypto.Sha256;
import com.blockchain.extend.homomorphic.Keys.DecryptData;
import com.blockchain.extend.homomorphic.Keys.Encrypt;
import com.blockchain.extend.homomorphic.Keys.EncryptData;
import com.blockchain.extend.homomorphic.Keys.Init_Keys;
import com.blockchain.extend.homomorphic.Keys.Key;
import com.blockchain.extend.homomorphic.bean.HomData;
import com.blockchain.extend.homomorphic.bean.HomObject;
import com.blockchain.server.CheckService;
import com.blockchain.server.TransactionService;

@RestController
@RequestMapping("/hom")
@CrossOrigin
public class HomomorphicController {
	@Autowired
	public TransactionService transactionService;
	@Autowired
	public CheckService checkService;
	@Autowired
	public TransactionPool transactionPool;

	/**
	 * 加法同态加密
	 * 
	 * @param plaintext
	 * @return
	 * @throws Exception
	 */
	@PostMapping("/encrypt")
	public BaseData encrypt(@RequestBody JSON homJson) throws Exception {
		// 准备
		HomObject ho = JSON.parseObject(homJson.toJSONString(), HomObject.class);
		String hdSha = Sha256.sha256(JSON.toJSONString(ho.getHd()));// 加密数据的HASH部分作为交易的data

		// -------------解密
		Queue<String> queue = new LinkedBlockingQueue<String>();
		// 秘钥准备
		Init_Keys init_keys = new Init_Keys(2019);
		Key homomorphicKey = init_keys.getKey();

		// 1.明文分隔为字符串数组
		HomData hd = ho.getHd();
		String[] plainArray = hd.getPlaintext();
		String ss = "";

		// 2.明文加密
		for (int i = 0; i < plainArray.length; i++) {
			String s = EncryptData.encryptPlus(homomorphicKey, plainArray[i]);
			queue.offer(s);

			if (i == 0) {// 写麻烦了 先这样吧
				ss = s;
			} else {
				ss = ss + "," + s;
			}
		}
		// 3.密文求和
		String secret_sum = "1";
		while (!queue.isEmpty()) {
			secret_sum = Encrypt.add(new BigInteger(secret_sum), new BigInteger(queue.poll())).toString();
		}

		// 4.解密
		String plain_sum = DecryptData.DecryptPlus(homomorphicKey, secret_sum);

		hd.setSum_plain(plain_sum);
		hd.setSum_secret(secret_sum);
		hd.setSum_secrettext(ss.split(","));

		// --------------构建交易
		TransactionRequest transactionRequest = new TransactionRequest();
		transactionRequest.setAmount(new BigDecimal(5));
		transactionRequest.setData(hdSha);
		transactionRequest.setFrom(ho.getFrom());
		transactionRequest.setPrivateKey(ho.getSk());
		transactionRequest.setTo(ho.getTo());
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
			return ResultGenerator.genSuccessResult(hd);
		} else if (!confirm) {
			return ResultGenerator.genFailResult("当前交易已存在");
		} else {
			return ResultGenerator.genFailResult(result.getMessage());
		}

	}



}
