define(['jQuery','backbone', 'underscore', 'Collection/todoList', 'Views/todoItemView', 'Collection/doneList'], function($, Backbone, _,todoList, todoView, doneList) {
    var Todos = new todoList();
    var Done = new doneList();

    var AppView = Backbone.View.extend({
        el: $("#todobody"),

        countTemplate: _.template($('#count-template').html()),

        events:{
            "keypress #todoadd": "addOnEnter",
            "click #todorefresh": "resetTodo",
            "click #tododone": "setAsDone",
            "click #doneundo": "setAsUndone"
        },

        initialize:function(){
            this.input = this.$("#todoadd");
            this.checkboxDone = this.$("#tododone")[0];
            this.checkboxUndone = this.$("#doneundo")[0];

            this.listenTo(Todos, 'add', this.addListItem);
            this.listenTo(Done, 'add', this.addDoneItem);
            this.listenTo(Todos, 'remove', this.removedItem);
            this.listenTo(Done, 'remove', this.undoneItem);
            this.listenTo(Todos,'reset', this.addListItems);
            this.listenTo(Todos, 'all', this.render);
            this.listenTo(Done, 'all', this.render);

            this.footer = this.$("#todofooter");
            this.refresh = this.$("#todorefresh");
            this.content = this.$("#todocontent");
            this.doneContent = this.$("#donecontent");

            Todos.fetch();
            Done.fetch();
        },

        render:function(){
            var doneCount = Done.remainingItems().length;
            var remainingCount = Todos.remainingItems().length;

            if( remainingCount > 0 || doneCount > 0){
                this.footer.show();
                this.refresh.show();
            }
            else{
                this.footer.hide();
                this.refresh.hide();
            }

            if(remainingCount > 0)
                this.content.show();
            else
                this.content.hide();

            if(doneCount > 0)
                this.doneContent.show();
             else
                this.doneContent.hide();

            this.checkboxDone.checked = (remainingCount == 0);
            this.checkboxUndone.checked = (doneCount == 0);

            this.footer.html(this.countTemplate({ remainingCount: remainingCount ,doneCount: doneCount}));
        },

        addListItem:function(todo){
             var view = new todoView({model: todo});
             this.$("#todolist").append(view.render().el);
        },

        addDoneItem:function(todo){
             var view = new todoView({model: todo});
             this.$("#donelist").append(view.render().el);
        },

        addListItems:function(){
             Todos.each(this.addOne, this);
        },

        removedItem: function(todo){
            if(todo.get('done')){
                 Done.create({title: todo.get('title')});
            }
        },

        undoneItem: function(todo){
            if(todo.get('done')){
                 Todos.create({title: todo.get('title')});
            }
        },

        addOnEnter:function(e){
            if(e.keyCode == 13){
                if(this.input.val().trim().length < 1) return;

               Todos.create({ title: this.input.val()}); //creates the item

               this.input.val('');
            }
        },

        resetTodo:function(){
            _.invoke(Todos.toArray(), 'destroy');
            _.invoke(Done.toArray(), 'destroy');
            return false;
        },

        setAsDone:function(){
            var done = this.checkboxDone.checked;
            if(done){
                var todo;
                while (todo = Todos.first()) {
                    todo.save({'done': done});
                    todo.destroy();
                }
            }
        },

        setAsUndone:function(){
            var done = this.checkboxUndone.checked;
            if(done){
                var todo;
                while (todo = Done.first()) {
                    todo.save({'done': done});
                    todo.destroy();
                }
            }
        }
    });

    return AppView;
});