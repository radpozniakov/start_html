//Imports
var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var browserSync  = require('browser-sync');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var svgmin = require('gulp-svgmin');
var svgSprite = require('gulp-svg-sprite');
var cheerio = require('gulp-cheerio');
var replace = require('gulp-replace');


//Tasks
gulp.task('pug', function () {
    return gulp.src('./dev/pug/pages/*.pug')
        .pipe(pug({
            locals: "./dev/pug/data.json",
            pretty: true
        }))
        .on('error', notify.onError(function (error) {
            return {
                title: "Pug",
                message: error.message
            };
        }))
        .pipe(gulp.dest('./build'))
        .on('end', browserSync.reload);
});
gulp.task('sass', function () {
    return gulp.src('./dev/sass/style.sass')
        .pipe(sourcemaps.init())
        .pipe(sass({}))
        .on('error', notify.onError(function (error) {
            return {
                title: "Sass",
                message: error.message
            };
        }))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['last 15 versions', '>1%', 'ie 11'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(cssnano({zindex: false}))
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.reload({stream: true}));

});
gulp.task('browser-sync', function() {
    browserSync({
        server:{
            baseDir: 'build'
        },
        notify: false
    });
});
gulp.task('svg', function () {
    return gulp.src('./dev/img/svg/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
                run: function($) {
                    $('[fill]').removeAttr('fill');
                    $('[stroke]').removeAttr('stroke');
                    $('[style]').removeAttr('style');
                },
                parserOptions: { xmlMode: true }
            }))
            .pipe(replace('&gt;', '>'))
            .pipe(svgSprite({
                mode: {
                    symbol: {
                        sprite: "sprite.svg"
                    }
                }
            }))
            .pipe(gulp.dest('./build/img/svg/'));
});
gulp.task('clean', function () {
    return del(['./build']);
});

gulp.task('watch', ['browser-sync', 'sass', 'pug', 'svg'], function(){
    gulp.watch('./dev/pug/**/*.pug',  ['pug']);
    gulp.watch('./dev/sass/**/*.sass', ['sass']);
});