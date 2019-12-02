package com.blockchain.extend.homomorphic.Utils;

import java.math.BigInteger;
import java.security.PublicKey;

import javax.crypto.SecretKey;

import com.blockchain.extend.homomorphic.Algorithm.AESUtil;
import com.blockchain.extend.homomorphic.Algorithm.RSAUtil;

public class Encryption {
	// AES加密，传入明文和密钥，得到密文
	public static String aes_encryption(String message, SecretKey key) {
//        byte[] encodedBytes = AESUtil.AesEcbEncode(message.getBytes(), key);
//        String encodedText = AESUtil.byte2Base64(encodedBytes);
//        System.out.println("AES ECB模式 加密密文：" + encodedText);

		byte[] encodedBytes = AESUtil.AesCbcEncode(message.getBytes(), key, AESUtil.IVPARAMETERS);
		String encodedText = AESUtil.byte2Base64(encodedBytes);

		return encodedText;
	}

	// RSA加密，传入明文和公钥，得到密文
	public static BigInteger rsa_encryption(BigInteger message, PublicKey publicKey) throws Exception {
		byte[] privateTextByte = RSAUtil.publicEncrypt(message.toByteArray(), publicKey);
//        String privateText = RSAUtil.byte2Base64(privateTextByte);
		BigInteger privateText = new BigInteger(privateTextByte);
		return privateText;
	}
}
