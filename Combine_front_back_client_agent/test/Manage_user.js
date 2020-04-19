const Queue= require("../Queue.js")
const agent = require("../Agent")
const chai = require("chai");
const list_of_queues = require("../create_queue_dict");
const all_agent= require("../AllAgents.js")

const assert = chai.assert;

let all_specialities_queues = list_of_queues.all_queues;
let finance_queue= all_specialities_queues['finance']
let HR_queue = all_specialities_queues["HR"]
let Agent_pool = new all_agent()

let user_1={ email: "Some1@email",
            name: "Some One",}
let user_2= { email: "Some2@email",
                name: "some two"}
let user_3= { email: "Some3@email",
                name:"some3 three"}
let user_4= { email: "Some4@email",
                name:"some4 three"}
let user_5= { email: "Some4@email",
                name:"some5 three"}
let user_6= { email: "Some4@email",
                name:"some6 three"}

let Agent1= new agent("finance")
let Agent2= new agent("finance")
let Agent3= new agent("finance")

//Test with one speciality , finance 
describe('Empty Queue test', () => {
    it('Test an queue with 0 capacity ', () => {  

        assert.equal(finance_queue.emptyslots(), 0);// it is empty , but no slot available
        assert.isFalse(finance_queue.enqueue(user_1)) // cannot be enqueued 
        
    }) 
    it("Test all speciality ", function(){
        for(var queues in all_specialities_queues){
            
        assert.equal(all_specialities_queues[queues].emptyslots(), 0);// it is empty , but no slot available
        assert.isFalse(all_specialities_queues[queues].enqueue(user_1)) // cannot be enqueued 
        }    
    })
})
describe("Agent Pool Test ", function(){
    it("Add Agent",  function(){
        let agent1_id= Agent_pool.addAgent(Agent1)
        assert.equal(agent1_id,1);

        assert.equal(Agent_pool.availableAgent('finance'), 1)
        let agent2_id= Agent_pool.addAgent(Agent2)
        let agent3_id= Agent_pool.addAgent(Agent3)
        assert.equal(Agent_pool.availableAgent('finance'),3)// since  no agent is busy 

    })
    it("Expand the queue ",function(){
        finance_queue.addLimit(3)
        assert.equal(finance_queue.emptyslots(),30);
    })

    
})
describe("Agent Pool Test ", function(){
    it("Add user to the queue",function(){
        finance_queue.enqueue(user_1)
        finance_queue.enqueue(user_2)
        finance_queue.enqueue(user_3)
        finance_queue.enqueue(user_4)
        finance_queue.enqueue(user_5)
        finance_queue.enqueue(user_6)
        assert(finance_queue.emptyslots(),24)
   
    })
    it("Agent dequeue", function(){
        let agent = Agent_pool.getTheMostAvailableAgent('finance')
        console.log("Agent id : "+agent.getid() )
        agent.dequeue(finance_queue)
        assert.equal(finance_queue.emptyslots(),25)
        let agent2= Agent_pool.getTheMostAvailableAgent('finance')
        agent2.dequeue(finance_queue)
        assert.equal(finance_queue.emptyslots(),26)
        assert.equal(Agent_pool.availableAgent('finance'),1)
        let agent3 = Agent_pool.getTheMostAvailableAgent("finance")
        agent3.dequeue(finance_queue)
        assert.equal(finance_queue.emptyslots(),27)
        assert.equal(Agent_pool.getTheMostAvailableAgent("finance"),null)
    })
    it("Agent end conversation", function(){
        Agent1.end_conversation(user_1.email)
        assert.equal(Agent_pool.availableAgent("finance"),1)
        assert.isFalse(Agent2.end_conversation(user_1.email))// stress test, what if the current email is not the same as the agent serving one 
        Agent2.end_conversation(user_2.email)
        assert.equal(Agent_pool.availableAgent("finance"),2 )
    })
})
describe("Edge cases for Queue",function(){
    it("increase the queue amount then decrease the capacity", function(){
        finance_queue.enqueue(user_1)
        finance_queue.enqueue(user_2)
        finance_queue.enqueue(user_3)
        finance_queue.enqueue(user_4)
        finance_queue.enqueue(user_5)
        finance_queue.enqueue(user_6)
        finance_queue.enqueue(user_1)
        finance_queue.enqueue(user_2)
        finance_queue.enqueue(user_3)
        finance_queue.enqueue(user_4)
        finance_queue.enqueue(user_5)
        finance_queue.enqueue(user_6)
        assert.equal(finance_queue.emptyslots(),15)
        finance_queue.addLimit(-2)
        assert.equal(finance_queue.emptyslots(),-5)

    })
    it("Try to enqueue beyond capacity",  function(){
        assert.isFalse(finance_queue.enqueue(user_1))// try dequeue again 
        assert.equal(finance_queue.emptyslots(),-5)// check emptyslots . 
    })
})

// queue.enqueue(user_1)
// console.log("Empty slot "+queue.emptyslots())
// describe('enqueue1', () => {
//     it('check limit if it is reduced again', () => {

        
//         assert.equal(queue.emptyslots(), 9);
//     }) 
//     it('check size again ', () => {

       
//         assert.equal(queue.size(), 1);
//     }) 
//     it('check item inclusion   ', () => {

//         assert.include(queue.getallitem(), user_1);
//     })
    
// })

//  queue.enqueue(user_2)
//  console.log("Empty slot "+queue.emptyslots())
//  describe('enqueue2', () => {
//     it('check limit if it is reduced again ', () => {
//         assert.equal(queue.emptyslots(), 8);
//     }) 
//     it('check size again 3 ', () => {

       
//         assert.equal(queue.size(), 2);
//     }) 
//     it('check item inclusion of user2 ', () => {

//         assert.include(queue.getallitem(), user_2);
//     })
    
// })
// // console.log("Queue Empty slot before deque "+queue.emptyslots())
// // console.log("Queue Size" +queue.size())
// // console.log("Agent Capacity" +Agent2.check_capacity())
// Agent2.dequeue(queue)
// describe('dequeue ', () => {
//     it('check limit if it is increases again ', () => {

        
//         assert.equal(queue.emptyslots(), 9);
//     }) 
//     it('check size again ', () => {

       
//         assert.equal(queue.size(), 1);
//     }) 
//     it('Check agent Capacity  ', () => {

//         assert.equal(Agent2.check_capacity(),0)
//     })
    
// })
// // console.log("Agent Capacity" +Agent2.check_capacity())

// // console.log("Queue Empty slot after deque "+queue.emptyslots())
// // console.log("Queue Size" +queue.size())
// // console.log("Agent class Test")
//  Agent_pool.addAgent(Agent1)
//  Agent_pool.addAgent(Agent2)
//  describe('getMostavailable agent   ', () => {
//     it('get the most available agent   ', () => {

//     assert.equal(Agent_pool.getTheMostAvailableAgent("finance"), Agent1)
//     })
    
// })
// let available= Agent_pool.getTheMostAvailableAgent("finance")//get most available 
// console.log("The available capacity" + available.check_capacity())
// agent_repeat = Agent_pool.getOneAgent("finance", 1)
