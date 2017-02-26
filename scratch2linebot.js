(function(ext) {
    var receivedMessage;
    var lastUserId;
    var received = false;

    $.ajax({
        async:false,
        type:'GET',
        url:'https://www.gstatic.com/firebasejs/3.6.10/firebase.js',
        data:null,
        success: function(){
            var config = {
                databaseURL: "https://scratch2linebot.firebaseio.com",
            };
            firebase.initializeApp(config);
            firebase.database().ref("last_user_id").on("value", function(snapshot) {
                var value = snapshot.val();
                lastUserId = value;
                console.log("last_user_id:", value);
            });
            firebase.database().ref("message").on("value", function(snapshot) {
                var value = snapshot.val();
                receivedMessage = value;
                received = true;
                console.log("message:", value);
            });
            
        },
        dataType:'script'
    });

    ext._shutdown = function() {};

    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.send = function(user_id, message) {
        $.post('https://scratch2linebot.herokuapp.com/push', {'user_id': user_id, 'message': message}, function() {
            console.log('+ push +')
            console.log('user_id', user_id);
            console.log('message', message);
        });        
    };

    ext.receivedMessage = function() {
        return receivedMessage;
    };
    
    ext.lastUserId = function() {
        return lastUserId;
    }

    ext.received = function() {
        if (received === true) {
            received = false;
            return true;
        } else {
            return false;
        }
    };

    var descriptor = {
        blocks: [
            [' ', '%s に %s を送る', 'send', '', ''],
            ['r', '受け取ったメッセージ', 'receivedMessage'],
            ['r', '最後に受け取ったメッセージの送り主', 'lastUserId'],
            ['h', 'メッセージを受け取ったとき', 'received']
        ]
    };

    ScratchExtensions.register('Scratch2LINEBot', descriptor, ext);

})({});
