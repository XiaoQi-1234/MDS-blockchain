/**
 *
 */
package com.blockchain.test;

import com.blockchain.db.AccountImpl;
import com.blockchain.db.LevelDbStoreImpl;
import org.iq80.leveldb.DB;
import org.iq80.leveldb.DBFactory;
import org.iq80.leveldb.DBIterator;
import org.iq80.leveldb.Options;
import org.iq80.leveldb.impl.Iq80DBFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.nio.charset.Charset;
import java.util.*;

/**
 * @author XL
 */
public class Test1 {
    @Value("${filePath}")
    private String filePath;


    private static final String PATH = "./levelDB";
    private static final Charset CHARSET = Charset.forName("utf-8");
    private static final File FILE = new File(PATH);

    /**
     * @param args
     */
    public static void main(String[] args) {
        Test1 t = new Test1();
        t.t4();
    }

    static void t1() {
        AccountImpl ai = new AccountImpl();
    }

    void t2() {
        System.out.println(filePath);
    }

    /**
     * 获取所有key
     */
    void t3() {
        DBFactory factory = new Iq80DBFactory();
        Options options = new Options();
        options.createIfMissing(true);
        try {
            DB db = factory.open(new File(PATH), options);

            DBIterator iterator = db.iterator();
            LinkedHashMap<String, String> linkedHashMap = new LinkedHashMap<>();
            while (iterator.hasNext()) {
                Map.Entry<byte[], byte[]> next = iterator.next();
                String key = Iq80DBFactory.asString(next.getKey());
                String value = Iq80DBFactory.asString(next.getValue());
                System.out.println(key + ": " + value);
                linkedHashMap.put(key, value);
            }

            /*System.out.println("----------");

            byte[] bytes = db.get(Iq80DBFactory.bytes("key_next_0000bcfea848efd87e6eb228230af0362c44410cef42851c64277db523e3f314"));
            String value = Iq80DBFactory.asString(bytes);
            System.out.println(value);*/
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    static void t4() {
        DBFactory factory = new Iq80DBFactory();
        Options options = new Options();
        options.createIfMissing(true);
        Map<String, String> hashMap = new HashMap<>();
        try {
            DB db = factory.open(new File(PATH), options);
            DBIterator iterator = db.iterator();
            while (iterator.hasNext()) {
                Map.Entry<byte[], byte[]> next = iterator.next();
                String key = Iq80DBFactory.asString(next.getKey());
                if(key.startsWith("file_")) {
                    String value = Iq80DBFactory.asString(next.getValue());
                    hashMap.put(key,value);
                }
            }

            Iterator<Map.Entry<String, String>> mapIterator = hashMap.entrySet().iterator();
            while (mapIterator.hasNext()){
                Map.Entry<String, String> entry = mapIterator.next();
                String key = entry.getKey();
                String value = entry.getValue();
                System.out.println(key+":"+value);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static void t5() {
        DBFactory factory = new Iq80DBFactory();
        Options options = new Options();
        options.createIfMissing(true);
        Map<String, String> hashMap = new HashMap<>();
        String key = "file_2ec2903b695b550d4a3f62110bf03681d4b27a786658591ec8dec4ea1fc6202b";
        try {
            DB db = factory.open(new File(PATH), options);
            db.delete(Iq80DBFactory.bytes(key));
        }catch (Exception e) {
            e.printStackTrace();
        }}
}
