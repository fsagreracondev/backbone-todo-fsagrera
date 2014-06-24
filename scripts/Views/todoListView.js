define(['jQuery','backbone', 'localStorage', 'underscore', 'handlebars', 'Collection/todoList', 'Views/todoItemView'], function($, Backbone, LocalStorage, _, Handlebars, todoList, todoView) {

    var Todos = new todoList([], {storage: 'todostorage'});
    var Done =  new todoList([], {storage: 'donestorage'});

    var AppView = Backbone.View.extend({
        el: $("#todobody"),

        undoneTemplate: Handlebars.compile($('#undone-template').html()),

        doneTemplate: Handlebars.compile($('#done-template').html()),

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

            this.listenTo(Todos, 'add', this.refreshTodo);
            this.listenTo(Done, 'add', this.refreshDone);
            this.listenTo(Todos, 'remove', this.removedItem);
            this.listenTo(Done, 'remove', this.undoneItem);
            this.listenTo(Todos,'reset', this.addListItems);
            this.listenTo(Todos, 'all', this.render);
            this.listenTo(Done, 'all', this.render);

            this.footer = this.$("#todofooter");
            this.refresh = this.$("#todorefresh");
            this.content = this.$("#todocontent");
            this.doneContent = this.$("#donecontent");

            this.todoItemViews = [];
            this.doneItemViews = [];

            Todos.fetch(); //gets the models from localstorage
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

            var doneSuffix = "";
            var remainingSuffix="";

            this.footer.empty();

            if(doneCount > 0){
                if (doneCount > 1)
                    doneSuffix = "s";
                this.footer.append(this.doneTemplate({doneCount: doneCount, doneSuffix: doneSuffix}));
            }

            if(remainingCount > 0){
                if (remainingCount > 1)
                    remainingSuffix = "s";
                this.footer.append(this.undoneTemplate({remainingCount: remainingCount, remainingSuffix: remainingSuffix}));
            }
        },

        addListItem:function(todo){
             var view = new todoView({model: todo});
             this.todoItemViews.push(view);
             this.$("#todolist").append(view.render().el);
        },

        addDoneItem:function(todo){
             var view = new todoView({model: todo});
             this.doneItemViews.push(view);
             this.$("#donelist").append(view.render().el);
        },

        addListItems:function(){
             Todos.each(this.addListItem, this);
        },

        addDoneItems:function(){
            Done.each(this.addDoneItem, this);
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
        },

        refreshTodo:function(){
            _.each(this.todoItemViews, function(view){view.remove();});
            this.todoItemViews = [];
            this.addListItems();
        },

        refreshDone:function(){
            _.each(this.doneItemViews, function(view){view.remove();});
            this.doneItemViews = [];
            this.addDoneItems();
        }
    });

    return AppView;
});