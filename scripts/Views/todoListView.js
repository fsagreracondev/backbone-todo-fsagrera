define(['jQuery','backbone', 'localStorage', 'underscore', 'handlebars', 'marionette', 'Collection/todoList', 'Views/todoItemListView'],
    function($, Backbone, LocalStorage, _, Handlebars, Marionette, todoList, TodoItemListView) {

    var Todos = new todoList([], {storage: 'todostorage'});
    var Done =  new todoList([], {storage: 'donestorage'});

    var AppView = Backbone.View.extend({
        el: $("#todobody"),
        className:'view',

        itemCountTemplate: Handlebars.compile($('#itemcount-template').html()),

        events:{
            "keypress #todoadd": "addOnEnter",
            "click #todorefresh": "resetTodo",
            "click #tododone": function (event) {
                this.setAsDone(event.target, Todos);
            },
            "click #doneundo": function (event) {
                this.setAsDone(event.target, Done);
            }
        },

        initialize:function(){
            this.input = this.$("#todoadd");
            this.checkboxDone = this.$("#tododone")[0];
            this.checkboxUndone = this.$("#doneundo")[0];

            this.listenTo(Todos, 'remove', this.getRemoveHandler(Done));
            this.listenTo(Done, 'remove', this.getRemoveHandler(Todos));
            this.listenTo(Todos, 'all', this.render);
            this.listenTo(Done, 'all', this.render);

            this.footer = this.$("#todofooter");
            this.refresh = this.$("#todorefresh");
            this.content = this.$("#todocontent");
            this.doneContent = this.$("#donecontent");

            this.doneListRegion = new Marionette.Region({el:'#doneList'});
            this.todoListRegion = new Marionette.Region({el:'#todoList'});

            Todos.fetch(); //gets the models from localstorage
            Done.fetch();
        },

        render:function(){
            var doneCount = Done.remainingItems().length;
            var remainingCount = Todos.remainingItems().length;

            if(remainingCount > 0 || doneCount > 0){
                this.footer.show();
                this.refresh.show();
            }
            else{
                this.footer.hide();
                this.refresh.hide();
            }

            this.doneListRegion.show(new TodoItemListView({collection: Done}));
            this.todoListRegion.show(new TodoItemListView({collection: Todos}));

            this.toggleList(remainingCount, this.content);
            this.toggleList(doneCount, this.doneContent);

            this.checkboxDone.checked = (remainingCount == 0);
            this.checkboxUndone.checked = (doneCount == 0);

            this.footer.empty();

            if(doneCount > 0) this.setItemCount(doneCount, "done");
            if(remainingCount > 0) this.setItemCount(remainingCount, "remaining");
        },

        toggleList:function(count, content){
            if(count > 0)
                content.show();
            else
                content.hide();
        },

        setItemCount:function(count, itemType){
            suffix = "";

            if(count > 1)
                suffix = "s";

            this.footer.append(this.itemCountTemplate({count: count, suffix: suffix, itemType: itemType}));
         },

        getRemoveHandler: function (collectionToAddTo) {
            return function(todo){
                if(todo.get('done')){
                    collectionToAddTo.create({title: todo.get('title')});
                }
            };
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

        setAsDone:function(element, collection){
            var done = this.$(element).prop('checked');
            if(done){
                var todo;
                while (todo = collection.first()) {
                    todo.save({'done': done});
                    todo.destroy();
                }
            }
        }
    });

    return AppView;
});