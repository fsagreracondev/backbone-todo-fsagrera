define(['jQuery','backbone', 'localStorage', 'Models/todo'], function($, Backbone, LocalStorage, Todo) {

    var TodoList = Backbone.Collection.extend({
        model: Todo,

        initialize: function(models, options) {
            this.localStorage = new LocalStorage(options.storage);
        },

        doneItems: function(){
            return this.where({done:true}); //checks all items for the 'done' property
        },

        remainingItems: function(){
            return this.where({done:false});
        },

        comparator: 'title'
    });

    return TodoList;
});