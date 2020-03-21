class AllAgents {
    constructor() {
        this.all_agents = {};
        this.agent_id = 0;
    }

    add_agent(agent) {
        this.agent_id++;
        this.all_agents[this.agent_id] = agent;
    }

    remove_agent(agent_id) {
        delete this.all_agents[agent_id.toString()];
    }

    get_all_agents() {
        return this.all_agents;
    }
}

module.exports = AllAgents;