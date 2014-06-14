define(['jQuery','backbone', 'underscore'], function($, Backbone, _) {
    var TodoView = Backbone.View.extend({
        tagName: "li",

        template: _.template($('#item-template').html()),

        events: {
            "click .check" : "toggleCheckbox",
            "dblclick .view": "edit",
            "keydown .edit": "updateOnEnter",
            "blur .edit": "endEdit",
            "click .todoremove": "removeItem",
            "mouseover .view": "displayRemoveBtn",
            "mouseout .view": "hideRemoveBtn"
        },

        initialize:function(){
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render:function(){
            this.$el.html(this.template(this.model.toJSON()));
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

            this.$el.removeClass("editing");
            this.model.save({title:value});
        },

        displayRemoveBtn:function(){
            if(this.$el.find('.todoremove').length > 0) return;
            this.$el.find('.view').append("<div class='todoremove'></div>");
        },

        hideRemoveBtn: function(e){
            if($('.todoremove:hover').length > 0) return;
            $('.todoremove').remove();
        }
    });

    return TodoView;
});