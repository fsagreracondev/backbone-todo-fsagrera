define(['jQuery', 'handlebars', 'marionette', 'Views/todoItemView'], function($, Handlebars, Marionette, TodoItemView) {

    var TodoItemListView = Marionette.CollectionView.extend({
        tagName: 'ul',
        childView: TodoItemView,
        className: 'itemlist'
    });

    return TodoItemListView;
});