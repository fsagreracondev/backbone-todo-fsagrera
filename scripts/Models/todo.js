define(['jQuery','backbone'], function($, Backbone) {
    var Todo = Backbone.Model.extend({
        defaults:function(){
            return {
                title: "empty todo item",
                done: false
            };
        },

        toggle:function(){
            this.save({done: !this.get("done")});
       }
    });

   return Todo;
});