app = {

    UI : {
        root : $( 'html, body' ),
        html : $( 'html' ),
        body : $( 'body' )
    },


    init : function() {
        var $win = $( window );

        $win.on( 'resize', function(){ app.onResize(); } );

        helper.click();
        helper.onPopState();
    },


    onResize : function() {
        
    },


    loading : function( status ) {

        if( typeof status === 'undefined' || status === true ) {
            app.UI.body.addClass( 'loading' );
        } else {
            app.UI.body.removeClass( 'loading' );
        }

    },


    loadContent: function( url, elem ) {

        if( !Modernizr.history ) {
            document.location.href = url;
        }

        var params = {
            url : url
        };

        helper.ajax( params, function( err, data ){
            console.log( err, data );
            app.UI.body.html( data );
            helper.metaTitle();
        });

    }

};


$(function() { app.init(); });