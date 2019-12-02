package com.blockchain.extend.homomorphic.bean;

/**
 * @Description
 * @author XL
 * @date 2019-11-30 21:55
 *
 */
public class HomObject {
	private String from;
	private String to;
	private String sk;
	private HomData hd;
	
	

	public HomObject() {
		
	}
	
	

	public HomObject(String from, String to, String sk, HomData hd) {
		super();
		this.from = from;
		this.to = to;
		this.sk = sk;
		this.hd = hd;
	}



	public String getFrom() {
		return from;
	}

	public void setFrom(String from) {
		this.from = from;
	}

	public String getTo() {
		return to;
	}

	public void setTo(String to) {
		this.to = to;
	}

	public String getSk() {
		return sk;
	}

	public void setSk(String sk) {
		this.sk = sk;
	}

	public HomData getHd() {
		return hd;
	}

	public void setHd(HomData hd) {
		this.hd = hd;
	}

	@Override
	public String toString() {
		return "HomObject [from=" + from + ", to=" + to + ", sk=" + sk + ", hd=" + hd + "]";
	}

}
