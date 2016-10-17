backupApp.service('DialogService', function() {
    var state = this.state = {
        CurrentItem: null,
        Queue: []
    };

    var self = this;

    this.watch = function(scope, m) {
        scope.$on('dialogservicechanged', function() {
            if (m) m();

            $timeout(function() {
                scope.$digest();
            });
        });

        if (m) $timeout(m);
        return state;
    };


    this.enqueueDialog = function(config) {
        if (config == null || (config.message == null && config.htmltemplate == null))
            return;

        config.title = config.title || 'Information';
        config.buttons = config.buttons || ['OK'];        

        state.Queue.push(config);
        if (state.CurrentItem == null)
            this.dismissCurrent();

        config.dismiss = function() {
            if (state.CurrentItem == this)
                self.dismissCurrent();
        };

        return config;
    };

    this.alert = function(message) {
        return this.enqueueDialog({'message': message});
    };

    this.confirm = function(message, callback) {
        return this.enqueueDialog({
            'message': message, 
            'callback': callback, 
            'buttons': ['Cancel', 'OK']
        });
    };

    this.accept = function(message, callback) {
        return this.enqueueDialog({
            'message': message, 
            'callback': callback, 
            'buttons': ['OK']
        });
    };

    this.dialog = function(title, message, buttons, callback, onshow) {
        return this.enqueueDialog({
            'message': message, 
            'title': title,
            'callback': callback, 
            'buttons': buttons,
            'onshow': onshow
        });
    };

    this.htmlDialog = function(title, htmltemplate, buttons, callback, onshow) {
        return this.enqueueDialog({
            'htmltemplate': htmltemplate,
            'title': title,
            'callback': callback, 
            'buttons': buttons,
            'onshow': onshow
        });
    };

    this.dismissCurrent = function() {
        if (state.CurrentItem != null) {
            if (state.CurrentItem.ondismiss)
                state.CurrentItem.ondismiss();

            state.CurrentItem = null;
        }

        if (state.Queue.length > 0) {
            state.CurrentItem = state.Queue[0];
            state.Queue.shift();

            if (state.CurrentItem.onshow)
                state.CurrentItem.onshow();
        }
    };

    this.dismissAll = function() {
        while (state.CurrentItem != null){
            this.dismissCurrent();
        }
    };

});
