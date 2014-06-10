# Backbone Todo Exercise

The goal of this exercise is to familiarize yourself with some of the javascript libraries we use. You will be recreating [This todo list app](http://backbonejs.org/examples/todos/index.html). You may look at [the source](http://backbonejs.org/examples/todos/todos.js) but you may not copy & paste any code.

To get started:

1. In a terminal, navigate to the directory where this README.md file is located and run this command: python -m SimpleHTTPServer 8000
2. In a web browser, visit this link: http://localhost:8000 

What you are seeing is the contents of index.html. You’re now ready to start editing index.html and adding more files as needed. Any changes you make will be reflected when you refresh your browser.

Complete these goals in order:

1. Re-create the application. Again, looking at the source code is ok, but copy-and-pasting is not ok. The goal is to go through it and understand how everything works. The [Backbone documentation](http://backbonejs.org/) will be your best friend. You might also want to keep the documentation for [jQuery](http://api.jquery.com/) and [Underscore](http://underscorejs.org/) handy too, since they are dependencies of Backbone.
2. If you haven't already, separate your js source code into separate files (one class per file is usually good). Now take a look at [requirejs](http://requirejs.org/) and [Bower](http://bower.io/). Integrate them into your app to load js files and manage packages, respectively. Here’s a [handy requirejs tutorial](http://www.ringabell.org/en/un-simple-guide-pour-debuter-avec-requirejs/). And here is a [decent video](https://www.youtube.com/watch?v=Vs2wduoN9Ws) about how Bower works and why it's cool.
3. Now we're going to expand the application. Instead of having just one list for all items, modify the application to have a "To Do" list and a separate "Done" list. When you check off a "To Do" item, it moves to "Done". When you uncheck a "Done" item, it moves to "To Do". 