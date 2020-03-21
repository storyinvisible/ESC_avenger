class Agent{
    constructor(specialty, status, id){
        this.status= status;
        this.specialty=specialty;
        this.current_user=new Map();
        this.limit=1;
        this.capacity=1;// number of customer he can serve
        this.id =id;
    }
    changestatus(status){
        this.status=status;  
    }
    dequeue(queue, app){
        if(this.status=='available'&&this.capacity!=0){
            var user_detail= queue.dequeue();
            this.current_user.set(user_detail.email, user_detail.name)
            this.capacity=this.limit-this.current_user.size;
        }
        
    }
    end_conversation(email){
        this.current_user.delete(email)
        this.capacity=this.capacity+1;
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