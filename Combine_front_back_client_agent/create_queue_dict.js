const Queue = require("./Queue.js");

let all_queues = {};

let all_specialities = ["finance", "technical", "management", "HR"];
let agent = {}

for (let i = 0; i < all_specialities.length; i++) {
    let current_speciality = all_specialities[i];
    let queue = new Queue();
    all_queues[current_speciality] = queue;
    agent[all_specialities[i]]=[]
}

module.exports = {
    all_queues, agent
}