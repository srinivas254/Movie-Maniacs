package com.taskforge.backend.service;

public class UserNameGenerator {

    public static String generate(String name){
        String[] parts = name.trim().split("\\s+");
        String base = String.join("_",parts);
        int randomNum = (int) (Math.random() * 9000) + 1000;
        return base +"_"+randomNum;
    }
}
