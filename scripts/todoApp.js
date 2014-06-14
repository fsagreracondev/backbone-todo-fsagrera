require.config({
    paths: {
        'jQuery': 'jquery',
        'json2': 'libraries/json2',
        'underscore': 'libraries/underscore',
        'backbone': 'libraries/backbone',
        'localStorage': 'libraries/backbone.localStorage'
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

require(["Models/todo", "jQuery", "backbone", "Views/todoItemView", "Views/todoListView",
"Collection/todoList"], function(todo, $, Backbone, todoItemView, todoListView, todoList){
    var Todos = new todoList();
    var App = new todoListView();
});
