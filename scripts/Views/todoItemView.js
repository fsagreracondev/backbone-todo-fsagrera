var TodoView = Backbone.View.extend({
    tagName: "li",

    events: {
        "click .check" : "toggleCheckbox",
        "dblclick .view": "edit",
        "click .remove": "removeItem",
        "keydown .edit": "updateOnEnter",
        "blur .edit": "endEdit"
    },

    initialize:function(){
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },

    render:function(){
        this.$el.toggleClass('done', this.model.get('done'));
        this.input = this.$('.edit');
        return this;
    },

    toggleCheckbox : function(){
        this.model.toggle();
    },

    edit: function(){
        this.$el.addClass("editing");
        this.input.focus();
    },

    removeItem: function(){
        this.model.destroy();
    },

    updateOnEnter: function(e){
        if(e.keyCode == 13) endEdit();
    },

    endEdit:function(){
        var value = this.input.val();

        if(value.trim().length < 1){
            this.removeItem();
            return;
        }

         this.model.save({title:value});
         this.$el.addClass("editing");
    }
});