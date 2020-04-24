import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import java.util.ArrayList;
import java.util.List;

public class SingleSpeciality {
    public static String agentPassword= "a_Passworld123";
    static Agent agent_1 = new Agent("ironman@avenger.com", "a_Password_123", "HR");
    static Agent agent_2 = new Agent("black_widow@avenger.com", "a_Password_123","HR");
    static Agent agent_3 = new Agent("captain_america@avenger.com", "a_Password_123", "HR");

    public static void main(String[] args) {
        int customersNp=12;
        List<Agent> agents= new ArrayList<>();
        agents.add(agent_1);
//        agents.add(agent_2);
//        agents.add(agent_3);
        List<Browser_agent> Agent_thread= new ArrayList<>();
        List<Browser_client> client_thread= new ArrayList<>();
        System.setProperty("webdriver.gecko.driver", "/Users/lijiaxi/Downloads/geckodriver");
        for (Agent agent : agents){
            System.out.println(agent.email);
            WebDriver driver= new FirefoxDriver();
            Browser_agent thread= new Browser_agent(agent,driver);
            Agent_thread.add(thread);
            thread.start();



        }
        try {
            Thread.sleep(25000);
        }catch (InterruptedException e){
            e.printStackTrace();
        }

        for(int i =0; i <customersNp; i++){
            WebDriver driver = new FirefoxDriver();
            Browser_client browser_client= new Browser_client(driver,"HR");
            client_thread.add(browser_client);
            browser_client.start();
        }
        try {
            Thread.sleep(15000);
        }catch (InterruptedException e){
            e.printStackTrace();
        }
        while (Agent_thread.size()!=0){
            for(int i =0; i<Agent_thread.size();i++){
                if(!Agent_thread.get(i).sendMsg()){
                    Agent_thread.get(i).signout();
                    Agent_thread.remove(i);

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
}
