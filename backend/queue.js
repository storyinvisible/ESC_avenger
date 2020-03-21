class Queue {
    constructor() {
        this.accounts = [];
        this.limit = 0;
    }

    enqueue(account) {
        if(this.accounts.size < this.limit){
            this.accounts.push(element);
            return true;
        }
        else{
            return false
        }
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

    addLimit(number_of_agent){
        this.limit = this.limit + (number_of_agent * 10)
    }
    emptyslots(){
        return this.limit - this.accounts.size;
    }
}

module.exports  = Queue;
