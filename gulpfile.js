// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),

  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano')


  // development mode?
  //devBuild = (process.env.NODE_ENV !== 'production'), //uncomment this line to take this value form node env
  devBuild = true; //Js is minified and console logs are stripped when its true
  
  // foldersmkd
  folder = {
    src: 'src/',
    build: 'dist/'
  }
;

gulp.task('default', ['js','css','watch']);

//JS processing
gulp.task('js',function() {

  var jsbuild = gulp.src(folder.src + '**/*.js')
    .pipe(deporder())
    .pipe(concat('slidor.min.js'));

    if(!devBuild){

      jsbuild = jsbuild
        .pipe(stripdebug())
        .pipe(uglify());
    }

  return jsbuild.pipe(gulp.dest(folder.build));

});

gulp.task('watch', function() {

   gulp.watch(folder.src + '/**/*.js', ['js']);
	 gulp.watch(folder.src + '/**/*.scss', ['css']);

});

// CSS processing
gulp.task('css', function() {

  var postCssOpts = [
    autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
    mqpacker,
    cssnano
  ];

 
  return gulp.src(folder.src + 'slidor.scss')
    .pipe(sass({
      outputStyle: 'nested',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(folder.build));

});