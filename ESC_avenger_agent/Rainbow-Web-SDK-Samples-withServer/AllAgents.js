const AllQueues = require("./AllQueues");
const all_queues = new AllQueues();

class AllAgents {
    constructor() {
        this.all_agents = {};
        let specialities = all_queues.getAllSpecialities();
        for (let i = 0; i < specialities.length; i++) {
            this.all_agents[specialities[i]] = {};
        }
        this.agent_count=0;
    }

    addAgent(agent) {
        

        /* make sure the agent id is unique */
        this.agent_count++;
        agent.setid(this.agent_count)
        let speciality= agent.getSpeciality()
        console.log("before assignation")
        this.all_agents[speciality][this.agent_count] = agent;
        console.log("after assignation")
        return this.agent_count

    }

    removeAgent(speciality, id) {
        delete this.all_agents[speciality][id];
    }

    getOneAgent(speciality, id) {
        return this.all_agents[speciality][id];
    }

    getAllAgents() {
        return this.all_agents;
    }
    updateAgentstatus(speciality, id, status){
        this.all_agents[speciality][id].changestatus(status);
    }
    getTheMostAvailableAgent(speciality) {
        let choosen_agent;
        let this_spec = this.all_agents[speciality];
        let all_capacities = [];
        let max=0
        let most_available
        for (let id in this_spec) {
            if(this.all_agents[speciality][id].check_capacity()>max){
                max= this.all_agents[speciality][id].check_capacity()
                most_available=this.all_agents[speciality][id]
            }
        }
        if (max=0) {
            return null;
        }
        return most_available
    }
}

module.exports = AllAgents;