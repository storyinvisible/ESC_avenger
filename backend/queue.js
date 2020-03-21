class Queue {
    constructor() {
        this.accounts = [];
    }

    enqueue(account) {
        this.accounts.push(account);
    }

    dequeue() {
        if (this.emptyQueue()) {
            return "Empty queue";
        }
        return this.accounts.shift();
    }
    
    getFront() {
        return this.accounts[0];
    }

    emptyQueue() {
        return this.accounts.length == 0;
    }

    checkQueueStatus() {
        return this.accounts.length < 1;
    }

    getAllItem() {
        return this.accounts;
    }
}

module.exports  = Queue;
