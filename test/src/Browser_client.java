package com.example.libseleniumtest;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.Random;

public class Browser_client extends Thread {
    WebDriver driver;
    String Specialty;
    Browser_client(WebDriver driver,String specialty){
        this.driver=driver;
        this.Specialty=specialty;

    }
    @Override
    public void run() {
        driver.get("http://127.0.0.1:3007");
        WebElement username = driver.findElement(By.id("username"));
        Random random = new Random();
        username.sendKeys(Web_strain_test.generateRandomWords(1));
        WebElement password = driver.findElement(By.id("password"));
        password.sendKeys(Web_strain_test.generateRandomWords(1));
        WebElement loginButton = driver.findElement(By.className("connectionCmp-btn"));
        Select speciality= new Select(driver.findElement(By.id("speciality")));
        speciality.selectByVisibleText(Specialty);
        try {
            Thread.sleep(5000);
        }catch (InterruptedException e){
            e.printStackTrace();
        }

        loginButton.click();

    }
    public void quit(){
        driver.close();
    }
}
