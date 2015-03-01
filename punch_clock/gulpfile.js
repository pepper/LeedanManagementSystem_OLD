var gulp = require("gulp");
var source = require("vinyl-source-stream");
var browserify = require("browserify");
var watchify = require("watchify");
var reactify = require("reactify"); 
var concat = require("gulp-concat");

// var del = require("del");
// var uglify = require("gulp-uglify");
// var react = require("gulp-react");
// var htmlreplace = require("gulp-html-replace");
var stylus = require("gulp-stylus");
var nib = require("nib"); 

// Define some paths
var paths = {
	HTML_ENTRIES: "src/html/index.html",
	HTML_DEST_DIRECTORY: "public/html",

	STYLUS_SOURCE_DIRECTORY: "src/stylus/",
	STYLUS_ENTRIES: "style.styl",
	STYLUS_DEST_DIRECTORY: "public/css/",
	
	// ALL: ["src/javascript/*.js", "src/javascript/**/*.js", "src/javascript/*.jsx", "src/javascript/**/*.jsx", "src/html/index.html"],
	JAVASCRIPT: ["src/javascript/*.js", "src/javascript/**/*.js", "src/javascript/*.jsx", "src/javascript/**/*.jsx"],
	JAVASCIPT_SOURCE_DIRECTORY: "./src/javascript/",
	SOURCE_ENTRIES_SCRIPT: "app.jsx",


	// Development
	DEST_ENTRIES_SCRIPT: "app.js",
	DEST_JAVASCRIPT_DIRECTORY: "public/javascript",
	
	// Production
	MINIFIED_OUT: "build.min.js",
	DEST_BUILD_DIRECTORY: "public/javascript"
};

gulp.task("dev_build", function(){
	var bundler = browserify({
		entries: [paths.JAVASCIPT_SOURCE_DIRECTORY + paths.SOURCE_ENTRIES_SCRIPT],
		transform: [reactify],
		debug: true,
		cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
	});
	var watcher = watchify(bundler);
	return watcher.on("update", function(){
		var updateStartDate = Date.now();
		console.log("Start update");
		watcher.bundle()
			.on("error", function(err) {
				console.log("Browserify error:", err);
			})
			.pipe(source(paths.DEST_ENTRIES_SCRIPT))
			.pipe(gulp.dest(paths.DEST_JAVASCRIPT_DIRECTORY));
		console.log("Updated finish!", (Date.now() - updateStartDate) + "ms");
	}).bundle()
		.on("error", function(err) {
			console.log("Browserify error:", err);
		})
		.pipe(source(paths.DEST_ENTRIES_SCRIPT))
		.pipe(gulp.dest(paths.DEST_JAVASCRIPT_DIRECTORY));
});

gulp.task("stylus", function(){
	gulp.src(paths.STYLUS_SOURCE_DIRECTORY + paths.STYLUS_ENTRIES)
		.pipe(stylus({use: [nib()]}))
		.pipe(gulp.dest(paths.STYLUS_DEST_DIRECTORY));
});

gulp.task("watch_stylus", function(){
	gulp.watch([
		paths.STYLUS_SOURCE_DIRECTORY + "**/*.styl",
		paths.STYLUS_SOURCE_DIRECTORY + "*.styl",
	], ["stylus"]);
});

gulp.task("copy_html", function(){
	gulp.src(paths.HTML_ENTRIES)
		.pipe(gulp.dest(paths.HTML_DEST_DIRECTORY));
});

gulp.task("watch_html", function(){
	gulp.watch([
		paths.HTML_ENTRIES
	], ["copy_html"]);
});

gulp.task("default", ["dev_build", "watch_stylus", "watch_html"]);

// Production
gulp.task("build", function(){
	gulp.src(paths.JAVASCRIPT)
		.pipe(react())
		.pipe(concat(paths.MINIFIED_OUT))
		.pipe(uglify(paths.MINIFIED_OUT))
		.pipe(gulp.dest(paths.DEST_BUILD));
});

gulp.task("replaceHTML", function(){
	gulp.src(paths.HTML)
		.pipe(htmlreplace({
			"js": paths.DEST_BUILD_DIRECTORY + "/" + paths.MINIFIED_OUT
		}))
		.pipe(gulp.dest(paths.DEST_HTML));
});

gulp.task("production", ["replaceHTML", "build"]);
