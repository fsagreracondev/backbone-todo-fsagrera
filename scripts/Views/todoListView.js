define(['jQuery','backbone', 'Collection/todoList', 'Views/todoItemView'], function($, Backbone, todoList, todoView) {
    var Todos = new todoList();

    var AppView = Backbone.View.extend({
        el: $("#todobody"),

        events:{
            "keypress #todoadd": "addOnEnter",
            "click #todorefresh": "resetTodo",
            "click #tododone": "setAsDone"
        },

        initialize:function(){
            this.input = this.$("#todoadd");
            this.checkboxDone = this.$("#tododone");

            this.listenTo(Todos, 'add', this.addListItem);
            this.listenTo(Todos,'reset', this.addListItems);
            this.listenTo(Todos, 'all', this.render);

            this.footer = this.$("#todofooter");
            this.content = this.$("#todocontent");

            Todos.fetch();
        },

        render:function(){
            var doneCount = Todos.doneItems().length;
            var remainingCount = Todos.remainingItems().length;

            if(remainingCount > 0){
                this.content.show();
                this.footer.show();
                //set footer information
            } else{
                this.content.hide();
                this.footer.hide();
            }

            this.checkboxDone.checked = (remainingCount == 0); //set to true if all completed
        },

        addListItem:function(todo){
             var view = new todoView({model: todo});
             this.$("#todolist").append(view.render().el);
        },

        addListItems:function(){
             Todos.each(this.addOne, this);
        },

        addOnEnter:function(e){
            if(e.keyCode == 13){
                if(this.input.val().trim().length < 1) return;

               Todos.create({ title: this.input.val()}); //creates the item

               this.input.val('');
            }
        },

        resetTodo:function(){
            _.invoke(Todos.doneItems(), 'destroy');
            return false;
        },

        setAsDone:function(){
            var done = this.checkboxDone.checked;
            Todos.each(function (todo){todo.save({'done': done});});
            //send all items to done list
        },
    });

    return AppView;
});