const Queue = require("../backend/model/Queue");
const chai = require("chai");
const assert = chai.assert;

describe('enqueue', () => {
    it('push a new item into the queue', () => {
        let queue = new Queue();
        let item = "test@email.com";
        queue.enqueue(item);
        assert.include(queue.getallitem(), item);
    }) 
})

describe('dequeue', () => {
    it('shift the first item out of the queue', () => {
        let queue = new Queue();
        let item = "test@email.com";
        queue.enqueue(item);
        queue.dequeue();
        assert.notInclude(queue.getallitem(), item);
    }) 
})

describe('front', () => {
    it('get the first item of the queue', () => {
        let queue = new Queue();
        let item = "test@email.com";
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
        queue.enqueue("test@email.com");
        queue.enqueue("test2@email.com");
        queue.enqueue("test3@email.com");
        queue.enqueue("test4@email.com");
        queue.enqueue("test5@email.com");
        assert.equal(15, queue.emptyslots());

        /* what happen if we set limit after we have an amount of items in the queue */
        let queue1 = new Queue();
        queue.enqueue("test@email.com");
        queue.enqueue("test2@email.com");
        queue.enqueue("test3@email.com");
        queue.enqueue("test4@email.com");
        queue.enqueue("test5@email.com");
        queue.addLimit(2);
        assert.notEqual(15, queue.emptyslots());
    }) 
})

describe('getallitem', () => {
    it('return the queue', () => {
        let queue = new Queue();
        queue.addLimit(1);
        queue.enqueue("test@email.com");
        queue.enqueue("test2@email.com");
        let expected = ["test@email.com", "test2@email.com"];
        let actual = queue.getallitem();
        assert.include(actual, "test@email.com");
        assert.include(actual, "test2@email.com");
        assert.equal(expected.length, actual.length);
    }) 
})

describe('removeItem', () => {
    it('remove a particular item from the queue', () => {
        let queue = new Queue();
        queue.addLimit(1);
        queue.enqueue("test@email.com");
        queue.enqueue("test2@email.com");
        let expected = ["test@email.com", "test2@email.com"];
        let actual = queue.getallitem();
        assert.include(actual, "test@email.com");
        assert.include(actual, "test2@email.com");
        queue.removeItem("test2@email.com");
        assert.notInclude(actual, "test2@email.com");
        assert.notEqual(expected.length, actual.length);
    }) 
})