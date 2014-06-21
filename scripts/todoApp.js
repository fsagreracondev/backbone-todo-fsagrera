require.config({
    paths: {
        'jQuery': 'bower_components/jquery/dist/jquery',
        'json2': 'bower_components/json2/json2',
        'underscore': 'bower_components/underscore/underscore',
        'backbone': 'bower_components/backbone/backbone',
        'localStorage': 'bower_components/backbone.localstorage/backbone.localStorage'
    },
    shim: {
        'jQuery': {
            exports: '$'
        },
        'json2': {
            exports: 'JSON'
        },
        'underscore': {
            exports: '_'
        },
        'backbone':{
            deps: ['jquery', 'underscore'],
            exports:'Backbone'
        },
        'localStorage':{
            deps: ['backbone'],
            exports:'LocalStorage'
        }
    }
});

require(["Models/todo", "jQuery", "underscore", "backbone", "Views/todoItemView", "Views/todoListView",
"Collection/todoList", "Collection/doneList"], function(todo, $, _, Backbone, todoItemView, todoListView, todoList, doneList){
    var App = new todoListView();
});
