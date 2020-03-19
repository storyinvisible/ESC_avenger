class Queue{
    constructor(){
        this.item=[]
        this.limit=0
    }
    enqueue(element){
        if(this.item.size<this.limit){
            this.items.push(element);
            return true;
        }
        else{
            return false
        }
    }
    dequeue(){
        if(this.isEmpty()) {
            return null; 
        }
        return this.items.shift();
    }
    front() {  
    if(this.isEmpty()) 
        return "No elements in Queue"; 
    return this.items[0]; 
    }
    isEmpty(){
        return this.items.length == 0; 
    }
    addLimiti(number_of_agent){
        this.limit=this.limit+(number_of_agent*10)
    }
    emptyslots(){
        return this.limit-this.item.size;
    }
    getallitem(){
        return this.item
    }
    removeItem(useremail){
        this.item= this.item.filter(userdetail.email!=useremail)    
    }
    
    
}
export.module(Queue)