
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
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
    static Agent agent_1 = new Agent("ironman@avenger.com", "a_Password_123", "Finance");
    static Agent agent_2 = new Agent("black_widow@avenger.com", "a_Password_123","HR");
    static Agent agent_3 = new Agent("captain_america@avenger.com", "a_Password_123", "Technical");


    static Random random = new Random();
    static Integer customersNp=20;
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
        System.setProperty("webdriver.gecko.driver", "/Users/lijiaxi/Downloads/geckodriver");
        for (Agent agent : agents){
            System.out.println(agent.email);
            WebDriver driver= new FirefoxDriver();
            Browser_agent thread= new Browser_agent(agent,driver);
            threads.add(thread);
            thread.start();



        }
        try {
            Thread.sleep(25000);
        }catch (InterruptedException e){
            e.printStackTrace();
        }


        for(int i =0; i <customersNp; i++){
            WebDriver driver = new FirefoxDriver();
            Browser_client browser_client= new Browser_client(driver,speciality[random.nextInt(3)]);
            client_thread.add(browser_client);
            browser_client.start();
        }
        try {
            Thread.sleep(25000);
        }catch (InterruptedException e){
            e.printStackTrace();
        }

        while (threads.size()!=0){
            for(int i =0; i<threads.size();i++){
                if(!threads.get(i).sendMsg()){
                    threads.get(i).signout();

                    threads.remove(i);

                    break;
                }
                try {
                    Thread.sleep(10000);
                }catch (InterruptedException e){}
            }
        }

        for(int i =0; i <customersNp; i++){

            client_thread.get(i).quit();
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



