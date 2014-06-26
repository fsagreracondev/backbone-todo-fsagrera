define(['jQuery', 'handlebars', 'marionette'], function($, Handlebars, Marionette) {
    var TodoView = Marionette.ItemView.extend({
        tagName: "li",

        template: Handlebars.compile($('#item-template').html()),

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
            window.v = this;
        },

        onRender:function(){
            this.input = this.$('.edit');
        },

        toggleCheckbox : function(){
            this.model.toggle();

           if(this.model.get('done')){
                this.removeItem();
            }
        },

        edit: function(){
            this.$el.addClass("editing");
            this.input.focus();
        },

        removeItem: function(){
            this.model.destroy();
        },

        updateOnEnter: function(e){
            if(e.keyCode == 13){
                var value = this.input.val();

                if(value.trim().length < 1){
                    this.removeItem();
                    return;
                }

                this.$el.removeClass("editing");
                this.model.save({title:value});
            }
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