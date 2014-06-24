define(['jQuery','backbone', 'localStorage', 'underscore', 'handlebars', 'Collection/todoList', 'Views/todoItemView'], function($, Backbone, LocalStorage, _, Handlebars, todoList, todoView) {

    var Todos = new todoList([], {storage: 'todostorage'});
    var Done =  new todoList([], {storage: 'donestorage'});

    var AppView = Backbone.View.extend({
        el: $("#todobody"),

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

            this.listenTo(Todos, 'add', _.partial(this.refreshList, Todos, 'todoItemViews', "#todolist"));
            this.listenTo(Done, 'add', _.partial(this.refreshList, Done, 'doneItemViews', "#donelist") );
            this.listenTo(Todos, 'remove', this.getRemoveHandler(Done));
            this.listenTo(Done, 'remove', this.getRemoveHandler(Todos));
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

            if(remainingCount > 0 || doneCount > 0){
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

            this.footer.empty();

            if(doneCount > 0) this.setItemCount(doneCount, "done");
            if(remainingCount > 0) this.setItemCount(remainingCount, "remaining");
        },

        setItemCount:function(count, itemType){
            suffix = "";

            if(count > 1)
                suffix = "s";

            this.footer.append(this.itemCountTemplate({count: count, suffix: suffix, itemType: itemType}));
         },

        addListItem:function(todo, viewArray, listElement){
             var view = new todoView({model: todo});
             viewArray.push(view);
             this.$(listElement).append(view.render().el);
        },

        addListItems:function(itemCollection, viewArray, element){
             itemCollection.each(function(todo){this.addListItem(todo, viewArray, element)}, this);
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
        },

        refreshList:function(collection, itemViewsName, element){
            _.each(this[itemViewsName], function(view){view.remove();});
            this[itemViewsName] = [];
            this.addListItems(collection, this[itemViewsName], element);
        }
    });

    return AppView;
});