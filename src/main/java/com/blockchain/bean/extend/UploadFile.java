package com.blockchain.bean.extend;

import java.util.Date;

public class UploadFile {
    private String fileHash;
    private String filePath;
    private String upUser;
    private long upDate;

    public String getFileHash() {
        return fileHash;
    }


    public void setFileHash(String fileHash) {
        this.fileHash = fileHash;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public long getUpDate() {
        return upDate;
    }

    public void setUpDate(long upDate) {
        this.upDate = upDate;
    }

    public String getUpUser() {
        return upUser;
    }

    public void setUpUser(String upUser) {
        this.upUser = upUser;
    }

    @Override
    public String toString() {
        return "UploadFile{" +
                "fileHash='" + fileHash + '\'' +
                ", filePath='" + filePath + '\'' +
                ", upUser='" + upUser + '\'' +
                ", upDate=" + upDate +
                '}';
    }
}
