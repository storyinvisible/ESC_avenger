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
        this.all_agents[speciality.toString()][id.toString()] = agent;
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
}

module.exports = AllAgents;