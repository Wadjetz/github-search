var gulp       = require('gulp'),
	plumber    = require('gulp-plumber'),
	path       = require('path'),
	compass    = require('gulp-compass')
;

var paths = {
	compass: {
		src: './sass/*.scss',
		dest: './css',
		project: {
			project: path.join(__dirname, appPath),
			css: 'css',
			sass: 'sass'
		}
	}
};

gulp.task('compass', function () {
	return gulp.src(paths.compass.src)
		.pipe(plumber())
		.pipe(compass(paths.compass.project))
		.pipe(gulp.dest(paths.compass.dest))
	;
});


gulp.task('default', ['compass'], function () {});

gulp.task('watch', function () {
	gulp.watch('./sass/**/*.scss', ['compass']);
});

