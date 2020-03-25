const AllAgents = require("../backend/model/AllAgents");
const chai = require("chai");
const assert = chai.assert;

describe('addAgent', () => {
    it('create new entry with particular id under the requested speciality', () => {
        let all_agents = new AllAgents();
        let agent = {"speciality": "finance", "id": 1, "capacity": 1};
        let expected = {
            "finance": {
                1: agent
            },
            "technical": {},
            "management": {},
            "HR": {}
        };
        all_agents.addAgent(agent);
        let actual = all_agents.getAllAgents();
        assert.deepEqual(expected, actual);
        /* check if the method won't accept duplicated key */
        let agent1 = {"speciality": "finance", "id": 1, "capacity": 2};
        all_agents.addAgent(agent1);
        let expected1 = 1;
        let actual1 = all_agents.getOneAgent("finance", 1);
        assert.equal(expected1, actual1["capacity"]);
    }) 
})

describe('removeAgent', () => {
    it('remove one particular agent object with requested speciality and id', () => {
        let all_agents = new AllAgents();
        let agent = {"speciality": "finance", "id": 1};
        all_agents.addAgent(agent);
        let speciality = "finance";
        let id = 1;
        let expected = {"finance": {}, "technical": {}, "management": {}, "HR": {}};
        all_agents.removeAgent(speciality, id);
        let actual = all_agents.getAllAgents();
        assert.deepEqual(expected, actual);
    }) 
})

describe('getAllAgents', () => {
    it('return a dictionary of 4 speciality objects', () => {
        let all_agents = new AllAgents();
        let expected = {"finance": {}, "technical": {}, "management": {}, "HR": {}};
        let actual = all_agents.getAllAgents();
        assert.deepEqual(expected, actual);
        assert.containsAllKeys(actual, ["finance", "technical", "management", "HR"]);
    }) 
})

describe('getOneAgent', () => {
    it('return a particular agent object of requested speciality and id', () => {
        let all_agents = new AllAgents();
        let agent = {"speciality": "finance", "id": 1};
        all_agents.addAgent(agent);
        let speciality = "finance";
        let id = 1;
        let expected = {"speciality": "finance", "id": 1};
        let actual = all_agents.getOneAgent(speciality, id);
        assert.deepEqual(expected, actual);
    }) 
})

describe('getTheMostAvailableAgent', () => {
    it('return the agent object with highest capability and available with particular speciality', () => {
        let all_agents = new AllAgents();
        let agent = {"speciality": "finance", "id": 1, "status": "available", "capacity": 1};
        let agent2 = {"speciality": "finance", "id": 2, "status": "available", "capacity": 2};
        let agent3 = {"speciality": "finance", "id": 3, "status": "available", "capacity": 3};
        let agent4 = {"speciality": "finance", "id": 3, "status": "unavailable", "capacity": 4};
        all_agents.addAgent(agent);
        all_agents.addAgent(agent2);
        all_agents.addAgent(agent3);
        all_agents.addAgent(agent4);
        let speciality = "finance";
        let expected = agent3;
        let actual = all_agents.getTheMostAvailableAgent(speciality);
        assert.deepEqual(expected, actual);
    }) 
})