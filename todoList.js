var AppView= Backbone.View.extend({
    element: $("#todobody"),
    events:{
        "keydown #todoadd": "addOnEnter",
        "click #todorefresh": "resetTodo"
        "click #tododone": "setAsDone"
    },

    initialize:function(){
        this.input = this.$("#todoadd");


    },

    addOnEnter:function(e){
        if(e.keyCode == 13){
            if(this.input.val().trim().length < 1) return;

            //create undo item

            this.input.val('');
        }
    },

    todorefresh:function(){

        //refresh the to do list
    },

    tododone:function(){

        //send all items to done list
    },
});