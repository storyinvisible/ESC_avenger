const Agent = require("../backend/model/Agent");
const chai = require("chai");
const assert = chai.assert;

describe('changestatus', () => {
    it('set the agent\' status', () => {
        let agent = new Agent("finance");
        agent.changestatus("unavailable");
        assert.equal("unavailable", agent["status"]);
    })
})


describe('agentDequeue', () => {
    it('agent\'s method to dequeue the account from the queue', () => {
        let agent = new Agent("finance");
        let queue = [{"email": "test@email.com", "name": "test"}, {"email": "test2@email.com", "name": "test2"}];
        assert.deepEqual({"email": "test@email.com", "name": "test"}, agent.agentDequeue(queue));
        assert.deepEqual({"email": "test2@email.com", "name": "test2"}, queue[0]);
        assert.equal(0, agent["capacity"]);

        /* what if the agent status is not available */
        let agent2 = new Agent("HR");
        agent2.changestatus("unavailable");
        let queue2 = [{"email": "test3@email.com", "name": "test3"}, {"email": "test4@email.com", "name": "test4"}];
        assert.isNaN(NaN, agent.agentDequeue(queue2));
        assert.equal(1, agent2["capacity"]);
    })
})

describe('end_conversation', () => {
    it('remove the current user from the map', () => {
        let agent = new Agent("finance");
        let queue = [{"email": "test@email.com", "name": "test"}, {"email": "test2@email.com", "name": "test2"}];
        agent.agentDequeue(queue);
        agent.end_conversation("test@email.com");
        let current_user_size = agent["current_user"].size;
        assert.deepEqual({"email": "test2@email.com", "name": "test2"}, queue[0]);
        assert.equal(0, current_user_size);
        assert.equal(1, agent["capacity"]);
    })
})

describe('check_capacity', () => {
    it('return the agent\'s current capacity', () => {
        let agent = new Agent("finance");
        assert.equal(1, agent["capacity"]);
        let queue = [{"email": "test@email.com", "name": "test"}, {"email": "test2@email.com", "name": "test2"}];
        agent.agentDequeue(queue);
        assert.equal(0, agent.check_capacity());

        let agent2 = new Agent("management");
        agent2.changestatus("unavailable");
        assert.equal(0, agent2.check_capacity())
    })
})

describe('getSpeciality', () => {
    it('return the agent\'s specialty', () => {
        let agent = new Agent("finance");
        let agent2 = new Agent("technical");
        let agent3 = new Agent("management");
        let agent4 = new Agent("HR");
        assert.equal("finance", agent.getSpeciality());
        assert.equal("technical", agent2.getSpeciality());
        assert.equal("management", agent3.getSpeciality());
        assert.equal("HR", agent4.getSpeciality());
    })
})

describe('setId', () => {
    it('set the agent\'s id', () => {
        let agent = new Agent("finance");
        assert.equal(0, agent["id"]);
        agent.setId(2);
        assert.equal(2, agent["id"])
        agent.setId(10);
        assert.equal(10, agent["id"]);
    })
})