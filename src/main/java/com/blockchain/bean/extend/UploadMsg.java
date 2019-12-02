package com.blockchain.bean.extend;

import java.lang.reflect.Array;
import java.util.List;
import java.util.Map;

public class UploadMsg {
    private String msg;
    private String code;// 0x0000：成功；0x0001：失败
    private Map<String, String> data;

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Map<String, String> getData() {
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "UploadMsg{" +
                "msg='" + msg + '\'' +
                ", code='" + code + '\'' +
                ", data=" + data +
                '}';
    }
}
