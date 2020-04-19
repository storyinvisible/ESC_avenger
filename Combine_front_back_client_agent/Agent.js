class Agent{
    constructor(specialty){
        this.status= "available";
        this.specialty=specialty;
        this.current_user=new Map();
        this.limit=1;
        this.capacity=1;// number of customer he can serve
        this.id ;
    }
    changestatus(status){
        this.status=status;  
    }
    setid(id){
        this.id =id;
    }
    getid(){
        return this.id;
    }
    dequeue(queue){
        if(this.status=='available'&&this.capacity>0){
            var user_detail= queue.dequeue();
            console.log("ADD user email" +user_detail.email)
            this.current_user.set(user_detail.email, user_detail.FirstName)
            this.capacity=this.limit-this.current_user.size;
            return user_detail
        }
        else{
            return null
        }  
    }
    end_conversation(email){
        if(this.current_user.has(email)){
            this.current_user.delete(email)
            this.capacity=this.capacity+1;
            console.log("Agent "+this.id+"has ended Conversation with "+email)
            return true
        }
        else{
            console.log("The email is not the customer who is serving")
            return false
        }
    }
    check_capacity(){
        if (this.status!="available"){
            return 0;
        }
        return this.capacity;
    }
    getSpeciality(){
        return this.specialty;
    }    
    
}
module.exports= Agent;