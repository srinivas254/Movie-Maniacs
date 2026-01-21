package com.taskforge.backend.service;

public class UserNameGenerator {

    public static String generate(String name){
        String[] parts = name.trim().split("\\s+");
        String base = String.join("_",parts);

        long timeStamp = System.currentTimeMillis();
        long randomNum =  (long) (Math.random() * 90000) + 10000;
        long uniqueNum = timeStamp + randomNum;
        return base +"_"+uniqueNum;
    }
}
