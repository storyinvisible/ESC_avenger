const list_of_queues = require("./create_queue_dict");
let all_specialities = ["finance", "technical", "management", "HR"];
let all_specialities_queues = list_of_queues.all_queues;
const assert = chai.assert;
queue.addLimit(1)
describe('addLimit', () => {
    it('push a new item into the queue', () => {

        
        assert.equal(queue.emptyslots(), 10);
    }) 
})
// Test queue 