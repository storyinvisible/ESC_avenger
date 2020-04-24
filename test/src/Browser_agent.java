
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.List;
import java.util.Random;

public class Browser_agent extends Thread {
    Agent agent;
    WebDriver driver;
    static Random random = new Random();
    Browser_agent(Agent agent,WebDriver driver){
        this.agent=agent;
        this.driver=driver;

    }

    @Override
    public void run() {
        driver.get("http://127.0.0.1:8080");
        WebElement username = driver.findElement(By.id("username"));
        username.sendKeys(this.agent.email);
        WebElement password = driver.findElement(By.id("password"));
        password.sendKeys(this.agent.password);
        Select speciality= new Select(driver.findElement(By.id("speciality")));
        speciality.selectByVisibleText(this.agent.speciality);
        WebElement loginButton = driver.findElement(By.id("sign_in"));
        try {
            Thread.sleep(5000);
        }catch (InterruptedException e){
            e.printStackTrace();
        }

        loginButton.click();
    }
    public void signout(){
        WebElement logoutButton = driver.findElement(By.id("sign_out"));
        logoutButton.click();
        try {
            Thread.sleep(1999);
        }catch (InterruptedException e){}
        driver.close();
    }
    public boolean sendMsg(){
        List<WebElement> messageField = driver.findElements(By.id("messageField"));
        if(!messageField.isEmpty()){
            messageField.get(0).sendKeys(Web_strain_test.generateRandomWords(3+random.nextInt(5)));
            try {
                Thread.sleep(1500);
            }catch (InterruptedException e){}
            messageField.get(0).sendKeys(Keys.ENTER);
            System.out.println("");
            try {
                Thread.sleep(1500);
            }catch (InterruptedException e){}
            WebElement clseConversation= driver.findElement(By.id("close_conversation"));
            clseConversation.click();
            return true;

        }
        else {
            return false;
        }

    }


}

