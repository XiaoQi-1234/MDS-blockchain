package com.blockchain.bean.extend;

import java.util.List;
import java.util.Map;

public class UpTX {
    private String from;
    private String to;
    private String sk;
    private Map<String, String> data;

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

    public Map<String, String> getData() {
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "UpTX{" +
                "from='" + from + '\'' +
                ", to='" + to + '\'' +
                ", sk='" + sk + '\'' +
                ", data=" + data +
                '}';
    }
}
