var gulp        = require( 'gulp' ),
    clean       = require( 'gulp-clean' ),
    sequence    = require( 'gulp-sequence' ),
    plumber     = require( 'gulp-plumber' ),
    sass        = require( 'gulp-sass' ),
    notify      = require( 'gulp-notify' ),
    iconfont    = require( 'gulp-iconfont' ),
    consolidate = require( 'gulp-consolidate' ),
    bless       = require( 'gulp-bless' )
    bulkSass    = require( 'gulp-sass-bulk-import' ),
    browserSync = require( 'browser-sync' ),
    bowerMain   = require( 'main-bower-files' ),
    uglify      = require( 'gulp-uglify' ),
    concat      = require( 'gulp-concat' ),
    gulpFilter  = require( 'gulp-filter' ),
    jshint      = require( 'gulp-jshint' )
    twig        = require( 'gulp-twig' );


var options = {

    dev   : 'assets/',

    dist : 'dist/',

    build : 'dist/build/',

    datas : {
        settings : 'settings.json',
        calendar : 'data.json'
    },

    folders : {
        html  : 'html',
        sass  : 'sass',
        css   : 'css',
        js    : 'js',
        svg   : 'svg',
        img   : 'img',
        fonts : 'fonts',
        icons : 'icons',
        app   : 'app'
    },

    iconfont : {
        name     : 'icons',
        class    : 'icon',
        template : '_tpl/_icons.scss'
    },

    browserSync : {
        logPrefix : 'BrowserSync',
        port      : 1337,
        open      : false,
        server : {
            baseDir : './dist'
        }
    }

};

options.files = {

    html  : [ options.dev + options.folders.html + '/**/*.html' ],
    sass  : [ options.dev + options.folders.sass + '/**/*.scss' ],
    css   : [ options.dev + options.folders.css + '/**/*.css' ],
    js    : [ options.dev + options.folders.js + '/**/*.js' ],
    svg   : [ options.dev + options.folders.svg + '/**/*.svg' ],
    img   : [
        options.dev + options.folders.img + '/**/*.png',
        options.dev + options.folders.img + '/**/*.jpg',
        options.dev + options.folders.img + '/**/*.gif'
    ],
    fonts : [
        options.dev + options.folders.fonts + '/**/*.eot',
        options.dev + options.folders.fonts + '/**/*.svg',
        options.dev + options.folders.fonts + '/**/*.ttf',
        options.dev + options.folders.fonts + '/**/*.woff'
    ]

};


gulp.task( 'clean', function() {

    var src = [
        options.build,
        options.dist,
        options.dev + options.folders.sass + '/_build',
        options.dev + options.folders.fonts + '/' + options.iconfont.name
    ];

    return gulp.src( src, { read: false } )
        .pipe( clean() )
        .pipe( notify( 'Clean complete' ) );

});


gulp.task( 'sass', function() {

    return gulp.src( options.files.sass )
        .pipe( plumber() )
        .pipe( bulkSass() )
        .pipe( sass( { errLogToConsole: true } ) )
        .pipe( gulp.dest( options.build + options.folders.css ) )
        .pipe( browserSync.stream() );

});


gulp.task( 'js', function() {

    return gulp.src( options.files.js )
        .pipe( plumber() )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default' ) )
        .pipe( concat( 'main.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( options.build + options.folders.js ) );

});


gulp.task( 'svg', function() {

    return gulp.src( options.files.svg )
        .pipe( gulp.dest( options.build + options.folders.svg ) );

});


gulp.task( 'fonts', function() {

    return gulp.src( options.files.fonts )
        .pipe( gulp.dest( options.build + options.folders.fonts ) );

});


gulp.task( 'img', function() {

    return gulp.src( options.files.img )
        .pipe( gulp.dest( options.build + options.folders.img ) );

});


gulp.task( 'browsersync', function() {

    browserSync( options.browserSync );

});


gulp.task( 'iconfont', function () {

    return gulp.src( options.files.svg )
        .pipe( iconfont({
            fontName           : options.iconfont.name,
            centerHorizontally : true,
            normalize          : true
        }))
        .on( 'codepoints', function( codepoints ) {
            gulp.src( options.dev + options.iconfont.template )
                .pipe( consolidate( 'lodash', {
                    glyphs    : codepoints,
                    fontName  : options.iconfont.name,
                    fontPath  : options.folders.fonts + '/' + options.iconfont.name,
                    className : options.iconfont.class
                }))
                .pipe( gulp.dest( options.dev + options.folders.sass + '/_build' ) );
        })
        .pipe( gulp.dest( options.dev + options.folders.fonts + '/' + options.iconfont.name ));

});


gulp.task( 'templating', function(){

    var settings = require( options.datas.settings ),
        calendar = require( options.datas.calendar );

    for( var p in settings.projects ) {

        gulp.src( [
            options.dev + options.folders.app + '/colors.css',
            options.dev + options.folders.app + '/index.html',
            options.dev + options.folders.app + '/.htaccess',
            options.dev + options.folders.app + '/.htpasswd'
        ] )
            .pipe( twig( {
                data : {
                    calendar : calendar.calendar,
                    project  : settings.projects[ p ],
                    projects : settings.projects,
                    baseurl  : settings.baseurl
                },
                cache : false,
                changeExt : false
            } ) )
            .pipe( gulp.dest( options.dist + settings.projects[ p ].slug ) );

    }

});


gulp.task( 'bower', function() {

    return gulp.src( bowerMain() )
        .pipe( gulpFilter( '*.js' ) )
        .pipe( concat( 'libs.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( options.build + options.folders.js ) );

});


gulp.task( 'update', function() {

    var access = require( 'ftp.json' ),
        globs = [
            'build/**',
            'index.html',
        ];

    var conn = ftp.create( {
        host     :     access.host,
        user     :     access.user,
        password : access.password,
        parallel : 10,
        log      : gutil.log
    } );

    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.dest( access.root ) );

});


gulp.task( 'watch', function(){

    gulp.watch( options.files.sass, [ 'sass' ] );
    gulp.watch( options.files.img, [ 'img', browserSync.reload ] );
    gulp.watch( options.files.js, [ 'js', browserSync.reload ] );

    gulp.watch( options.files.fonts, [ 'build', browserSync.reload ] );
    gulp.watch( options.files.svg, [ 'build', browserSync.reload ] );
    gulp.watch( options.files.html, [ 'templating', browserSync.reload ] );
    gulp.watch( options.dev + '_tpl/**/*.html', [ 'templating', browserSync.reload ] );

});


gulp.task( 'build', function( e ){

    return sequence( 'bower', 'templating', 'iconfont', 'fonts', 'sass', [ 'svg', 'js', 'img' ], e );

});


gulp.task( 'default', function( e ){

    return sequence( 'build', [ 'browsersync', 'watch' ], e );

});