const AllQueues = require("../backend/model/AllQueues");
const chai = require("chai");
const assert = chai.assert;

describe("formAllQueues & getAllQueues", () => {
    it("should form and return an object of all 4 specialities", () => {
        let all_queues = new AllQueues();
        all_queues.formAllQueues();
        let expected = {
            "HR": {"items": [], "limit": 0}, 
            "finance": {"items": [], "limit": 0}, 
            "management": {"items": [], "limit": 0}, 
            "technical": {"items": [], "limit": 0}
        };
        let actual = all_queues.getAllQueues();
        assert.deepEqual(expected, actual);
    })
})

describe("getAllSpecialities", () => {
    it("should return all 4 of the specialities", () => {
        let all_queues = new AllQueues();
        let expected = ["finance", "technical", "management", "HR"];
        let actual = all_queues.getAllSpecialities();
        assert.deepEqual(expected, actual);
    })
})

describe("getOneQueue", () => {
    it("should return queue of particular speciality", () => {
        let all_queues = new AllQueues();
        all_queues.formAllQueues();
        all_queues.getAllQueues()["finance"]["items"].push({"email": "test@email.com", "name": "test"});
        let expected = {
            "items": [{"email": "test@email.com", "name": "test"}],
            "limit": 0
        };
        let actual = all_queues.getOneQueue("finance");
        assert.deepEqual(expected, actual);
    })
})