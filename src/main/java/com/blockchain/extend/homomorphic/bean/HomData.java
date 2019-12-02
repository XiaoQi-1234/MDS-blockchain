package com.blockchain.extend.homomorphic.bean;

import java.util.Arrays;

/**
 * @Description
 * @author XL
 * @date 2019-11-30 20:54
 *
 */
public class HomData {
	private String[] plaintext;// 明文数组
	private String sum_plain;// 解密后的和
	private String[] sum_secrettext;// 用和算法加密的 密文
	private String sum_secret;// 密文和

	public HomData() {
	}

	public HomData(String[] plaintext, String[] sum_secrettext, String sum_secret, String sum_plain) {
		super();
		this.plaintext = plaintext;
		this.sum_secrettext = sum_secrettext;
		this.sum_secret = sum_secret;
		this.sum_plain = sum_plain;
	}

	public String[] getPlaintext() {
		return plaintext;
	}

	public void setPlaintext(String[] plaintext) {
		this.plaintext = plaintext;
	}

	public String[] getSum_secrettext() {
		return sum_secrettext;
	}

	public void setSum_secrettext(String[] sum_secrettext) {
		this.sum_secrettext = sum_secrettext;
	}

	public String getSum_secret() {
		return sum_secret;
	}

	public void setSum_secret(String sum_secret) {
		this.sum_secret = sum_secret;
	}

	public String getSum_plain() {
		return sum_plain;
	}

	public void setSum_plain(String sum_plain) {
		this.sum_plain = sum_plain;
	}

	@Override
	public String toString() {
		return "HomData [plaintext=" + Arrays.toString(plaintext) + ", sum_secrettext="
				+ Arrays.toString(sum_secrettext) + ", sum_secret=" + sum_secret + ", sum_plain=" + sum_plain + "]";
	}

}
