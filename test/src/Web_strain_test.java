

import org.openqa.selenium.By;
        import org.openqa.selenium.WebDriver;
        import org.openqa.selenium.WebElement;
        import org.openqa.selenium.chrome.ChromeDriver;
        import org.openqa.selenium.firefox.FirefoxDriver;
        import org.openqa.selenium.support.ui.Select;

        import javax.swing.*;
        import java.sql.ClientInfoStatus;
        import java.util.ArrayList;
        import java.util.List;
        import java.util.Random;

public class Web_strain_test {
    int number_agent=3;
    public static String agentPassword= "a_Passworld123";
    static Agent agent_1 = new Agent("ironman@email.com", "a_Password_123", "Finance");
    static Agent agent_2 = new Agent("black_window@avenger.com", "a_Password_123","HR");
    static Agent agent_3 = new Agent("captain_america@avenger.com", "a_Password_123", "Technical");


    static Random random = new Random();
    static Integer customersNp=10;
    public static void main(String[] args) throws InterruptedException{
        String[] speciality={"finance","HR","technical"};
        ArrayList<Agent> list = new ArrayList<>();
        // String agentPassword= "a_Passworld123";
        List<Agent> agents= new ArrayList<>();
        agents.add(agent_1);
        agents.add(agent_2);
        agents.add(agent_3);
        List<Browser_agent> threads= new ArrayList<>();
        List<Browser_client> client_thread= new ArrayList<>();
        // list.add(agent1);
        // list.add(agent2);
        // list.add(agent3);

        // list.add(new Agent("huangzhibo@gmail.com", agentPassword,random.nextInt(3) ));
        System.setProperty("webdriver.gecko.driver", "C:\\MyDrivers\\geckodriver.exe");
        for (Agent agent : agents){
            System.out.println(agent.email);
            WebDriver driver= new FirefoxDriver();
            Browser_agent thread= new Browser_agent(agent,driver);
            threads.add(thread);
            thread.start();



        }
        try {
            Thread.sleep(40000);
        }catch (InterruptedException e){
            e.printStackTrace();
        }


        for(int i =0; i <customersNp; i++){
            WebDriver driver = new FirefoxDriver();
            Browser_client browser_client= new Browser_client(driver,speciality[random.nextInt(2)]);
            client_thread.add(browser_client);
            browser_client.start();
        }
        for(Browser_agent thread : threads){
            System.out.println("Trying Signing Out");
            thread.signout();
        }

    }
    public static String[] generateRandomWords(int numberOfWords)
    {
        String[] randomStrings = new String[numberOfWords];
        Random random = new Random();
        for(int i = 0; i < numberOfWords; i++)
        {
            char[] word = new char[random.nextInt(8)+3]; // words of length 3 through 10. (1 and 2 letter words are boring.)
            for(int j = 0; j < word.length; j++)
            {
                word[j] = (char)('a' + random.nextInt(26));
            }
            randomStrings[i] = new String(word);
        }
        return randomStrings;
    }

}
class Browser_client extends Thread{
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
        username.sendKeys(Web_strain_test.generateRandomWords(3+random.nextInt(5)));
        WebElement password = driver.findElement(By.id("password"));
        password.sendKeys(Web_strain_test.generateRandomWords(3+random.nextInt(5)));

    }
    public void quit(){
        driver.close();
        driver.quit();
    }
}
class Browser_agent extends Thread{
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
    }
    public void sendMsg(){
        WebElement messageField = driver.findElement(By.id("messageField"));
        messageField.sendKeys(Web_strain_test.generateRandomWords(3+random.nextInt(5)));

    }

}

class Agent{
    public String email;
    public String password;
    public String speciality;
    Agent(String email, String password, String  speciality){
        this.email=email;
        this.password=password;
        this.speciality=speciality;
    }
}
