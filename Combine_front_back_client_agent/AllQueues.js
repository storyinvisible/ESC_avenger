const Queue = require("./Queue");

class AllQueues {
    constructor() {
        this.all_specialities = ["finance", "technical", "management", "HR"];
        this.all_queues = {};
    }

    formAllQueues() {
        for (let i = 0; i < this.all_specialities.length; i++) {
            let current_speciality = this.all_specialities[i];
            let queue = new Queue();
            this.all_queues[current_speciality] = queue;
        }
    }

    getAllSpecialities() {
        return this.all_specialities;
    }

    getAllQueues() {
        return this.all_queues;
    }

    getOneQueue(speciality) {
        return this.all_queues[speciality.toString()];
    }
}

module.exports = AllQueues;