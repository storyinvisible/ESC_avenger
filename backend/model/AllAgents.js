const AllQueues = require("./AllQueues");
const all_queues = new AllQueues();

class AllAgents {
    constructor() {
        this.all_agents = {};
        let specialities = all_queues.getAllSpecialities();
        for (let i = 0; i < specialities.length; i++) {
            this.all_agents[specialities[i]] = {};
        }
    }

    addAgent(agent) {
        let speciality = agent["speciality"];
        let id = agent["id"];

        /* make sure the agent id is unique */
        if (this.all_agents[id.toString()] != NaN) {
            this.all_agents[speciality.toString()][id.toString()] = agent;
        } else {
            return "Duplicated ID!";
        }
    }

    removeAgent(speciality, id) {
        delete this.all_agents[speciality.toString()][id.toString()];
    }

    getOneAgent(speciality, id) {
        return this.all_agents[speciality.toString()][id.toString()];
    }

    getAllAgents() {
        return this.all_agents;
    }

    getTheMostAvailableAgent(speciality) {
        let choosen_agent;
        let this_spec = this.all_agents[speciality.toString()];
        let all_capacities = [];
        for (let agent in this_spec) {
            if (this_spec[agent]["status"] === "available") {
                all_capacities.push(this_spec[agent]["capacity"]);
            }
        }
        let found_agent = false;
        for (let agent in this_spec) {
            if (this_spec[agent]["capacity"] === Math.max(...all_capacities)) {
                choosen_agent = this_spec[agent];
                found_agent = true;
                break;
            }
        }
        if (found_agent === true) {
            return choosen_agent;
        }
        return "No suitable agent at the moment!";
    }
}

module.exports = AllAgents;