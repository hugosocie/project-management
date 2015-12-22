helper = {


    UI : {
        metaTitle : '#metatitle'
    },


    click : function() {
        var $doc = $( document );

        $doc.on( 'click' , '[data-action]', function(e){

            e.preventDefault();

            var $elem = $( e.currentTarget ),
                url = $elem.attr( 'href' ) || $elem.attr( 'data-href' ),
                method = $elem.attr( 'data-action' );

            if( method.indexOf( ':' ) >= 0 ) {
                method = method.split( ':' );
            }

            if( typeof method === 'object' && typeof melody[ method[0] ][ method[1] ] !== "undefined"  ) {
                melody[ method[0] ][ method[1] ]( url, $elem );
            } else if( typeof melody[ method ] !== "undefined" ) {
                melody[ method ]( url, $elem );
            } else {
                console.log( 'error : method "' + method + '" not found' );
            }
        });
    },


    ajax : function( _params, callback ) {

        melody.loading();
        $( helper.UI.metaTitle ).remove();

        var params = {
            method    : ( _params !== null && typeof _params.method    === 'string'    ? _params.method    : 'POST' ),
            url       : ( _params !== null && typeof _params.url       === 'string'    ? _params.url       : '#' ),
            dataType  : ( _params !== null && typeof _params.dataType  === 'string'    ? _params.dataType  : 'html' ),
            data      : ( _params !== null && typeof _params.data      !== 'undefined' ? _params.data      : null ),
            updateUrl : ( _params !== null && typeof _params.updateUrl === 'boolean'   ? _params.updateUrl : true )
        };


        if ( params.updateUrl ) {
            helper.ga( params.url );
            helper.pushState( params.url );
        }

        $.ajax({
            url      : params.url,
            method   : params.method,
            dataType : params.datatype,
            data     : params.data,

            headers  : { 'X-Requested-With': 'BAWXMLHttpRequest' },

            complete: function() {  },

            success: function( response ) {
                console.info( 'ajax success : ' + params.url, params.data );
                melody.loading( false );
                callback( null, response );
            },

            error: function( err ) {
                console.error( 'ajax error : ' + params.url, params.data );
                melody.loading( false );
                callback( err, null );
            }
        });
    },


    pushState : function( url ) {
        if ( Modernizr.history ) {
            window.history.pushState( {}, 'melody', url );
        }
    },


    metaTitle : function() {
        var $meta = $( helper.UI.metaTitle ),
            title = $meta.text();

        if( typeof title === 'string' ) {
            document.title = title;
            $meta.remove();
        }
    },


    onPopState : function() {
        var $win = $( window );

        $win.on( 'load', function(){

            // Add setTimeout to avoid Safari to launch onpopstate on load
            setTimeout(function() {
                window.onpopstate = function( event ) {
                    if( document.location.pathname === '/' || document.location.pathname === '' ) {
                        document.location.reload();
                    } else {
                        melody.loadContent( document.location.href, null );
                    }
                };
            }, 300);
        } );
    },


    scrollWidth : function(){
        var outer = document.createElement( "div" );
        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        document.body.appendChild( outer );

        var widthNoScroll = outer.offsetWidth;
        outer.style.overflow = "scroll";

        var inner = document.createElement( "div" );
        inner.style.width = "100%";
        outer.appendChild(inner);        

        var widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    },


    ga : function( params, type ) {

        if( typeof ga !== 'function' ){ return; }

        type   = ( typeof type   !== 'string'    ? 'pageview' : type );
        params = ( typeof params === 'undefined' ? {}         : params );

        ga( 'send', type, params );

    }
};