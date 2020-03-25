const Queue = require("../backend/model/Queue");
const chai = require("chai");
const assert = chai.assert;

describe('enqueue', () => {
    it('push a new item into the queue', () => {
        let queue = new Queue();
        let item = {"email": "test@email.com", "name": "test"};
        queue.enqueue(item);
        assert.include(queue.getallitem(), item);
    }) 
})

describe('dequeue', () => {
    it('shift the first item out of the queue', () => {
        let queue = new Queue();
        let item = {"email": "test@email.com", "name": "test"};
        queue.enqueue(item);
        queue.dequeue();
        assert.notInclude(queue.getallitem(), item);
    }) 
})

describe('front', () => {
    it('get the first item of the queue', () => {
        let queue = new Queue();
        let item = {"email": "test@email.com", "name": "test"};
        queue.enqueue(item);
        assert.equal(queue.front(), item);
    }) 
})

describe('isEmpty', () => {
    it('check if the queue is empty', () => {
        let queue = new Queue();
        assert.isEmpty(queue.getallitem());
    }) 
})

describe('addLimit', () => {
    it('add the limit amount of queue based on number of agent', () => {
        let queue = new Queue();
        let number_of_agent = 2;
        let expected = 20;
        queue.addLimit(number_of_agent);
        assert.equal(expected, queue.currentLimit());
    }) 
})

describe('currentLimit', () => {
    it('return the current limit', () => {
        let queue = new Queue();
        assert.equal(0, queue.currentLimit());
    }) 
})

describe('emptyslots', () => {
    it('return the current number of available slot for the queue', () => {
        let queue = new Queue();
        queue.addLimit(2);
        queue.enqueue({"email": "test@email.com", "name": "test"});
        queue.enqueue({"email": "test2@email.com", "name": "test2"});
        queue.enqueue({"email": "test3@email.com", "name": "test3"});
        queue.enqueue({"email": "test4@email.com", "name": "test4"});
        queue.enqueue({"email": "test5@email.com", "name": "test5"});
        assert.equal(15, queue.emptyslots());

        /* what happen if we set limit after we have an amount of items in the queue */
        let queue1 = new Queue();
        queue.enqueue({"email": "test@email.com", "name": "test"});
        queue.enqueue({"email": "test2@email.com", "name": "test2"});
        queue.enqueue({"email": "test3@email.com", "name": "test3"});
        queue.enqueue({"email": "test4@email.com", "name": "test4"});
        queue.enqueue({"email": "test5@email.com", "name": "test5"});
        queue.addLimit(2);
        assert.notEqual(15, queue.emptyslots());
    }) 
})

describe('getallitem', () => {
    it('return the queue', () => {
        let queue = new Queue();
        queue.addLimit(1);
        queue.enqueue({"email": "test@email.com", "name": "test"});
        queue.enqueue({"email": "test2@email.com", "name": "test2"});
        let expected = [{"email": "test@email.com", "name": "test"}, {"email": "test2@email.com", "name": "test2"}];
        let actual = queue.getallitem();
        assert.deepEqual(actual[0], {"email": "test@email.com", "name": "test"});
        assert.deepEqual(actual[1], {"email": "test2@email.com", "name": "test2"});
        assert.equal(expected.length, actual.length);
    }) 
})

describe('removeItem', () => {
    it('remove a particular item from the queue', () => {
        let queue = new Queue();
        queue.addLimit(1);
        queue.enqueue({"email": "test@email.com", "name": "test"});
        queue.enqueue({"email": "test2@email.com", "name": "test2"});
        let expected = [{"email": "test@email.com", "name": "test"}, {"email": "test2@email.com", "name": "test2"}];
        let actual = queue.getallitem();
        assert.deepEqual(actual[0], {"email": "test@email.com", "name": "test"});
        assert.deepEqual(actual[1], {"email": "test2@email.com", "name": "test2"});
        queue.removeItem({"email": "test2@email.com", "name": "test2"});
        assert.notDeepEqual(actual[1], {"email": "test2@email.com", "name": "test2"});
        assert.notEqual(expected.length, actual.length);
    }) 
})