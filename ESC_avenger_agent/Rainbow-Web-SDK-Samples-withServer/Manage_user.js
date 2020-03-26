const Queue= require("./Queue.js")
var queue = new Queue();
queue.addLimit(3);
var limits = queue.currentLimit()
console.log(limits);
console.log(queue.emptyslots())
const list_of_queues = require("./create_queue_dict");

let user_1={ email: "Some1@email",
            name: "Some One",}
let user_2= { email: "Some2@email",
                name: "some two"}
let user_3= { email: "Some3@email",
                name:"some three"}