class Agent{
    constructor(specialty, id = 0, status = "available", limit = 1, capacity = 1){
        this.status = status;
        this.specialty = specialty;
        this.current_user = new Map();
        this.id = id;
        this.limit = limit;
        this.capacity = capacity;// number of customer he can serve
    }
    changestatus(status){
        this.status = status;  
    }
    agentDequeue(targeted_queue){
        if(this.status == 'available' && this.capacity != 0 && targeted_queue.length !== 0){
            let user_detail = targeted_queue[0];
            targeted_queue.shift();
            this.current_user.set(user_detail["email"], user_detail["name"])
            this.capacity = this.limit - this.current_user.size;
            return user_detail;
        }
        else{
            return NaN;
        }
        
    }
    end_conversation(email){
        this.current_user.delete(email)
        this.capacity = this.capacity + 1;
    }
    check_capacity(){
        if (this.status != "available"){
            return 0;
        }
        return this.capacity;
    }
    getSpeciality(){
        return this.specialty;
    }

    setId(id) {
        this.id = id;
    }
}

module.exports = Agent;