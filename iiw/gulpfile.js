// generated on 2019-06-18 using generator-webapp 4.0.0-5
const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const { argv } = require('yargs');

const $ = gulpLoadPlugins();
const server = browserSync.create();

const port = argv.port || 9000;

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDev = !isProd && !isTest;

function styles() {
  return src('app/styles/*.less')
    .pipe($.plumber())
    .pipe($.if(!isProd, $.sourcemaps.init()))
    // .pipe($.sass.sync({
    //   outputStyle: 'expanded',
    //   precision: 10,
    //   includePaths: ['.']
    // }).on('error', $.sass.logError))
    .pipe($.less())
    .pipe($.postcss([
      autoprefixer()
    ]))
    .pipe($.if(!isProd, $.sourcemaps.write()))
    .pipe(dest('.tmp/styles'))
    .pipe(server.reload({stream: true}));
};

function js() {
  return src('app/js/**/*.js')
    .pipe($.plumber())
    .pipe($.if(!isProd, $.sourcemaps.init()))
    .pipe($.babel())
    .pipe($.if(!isProd, $.sourcemaps.write('.')))
    .pipe(dest('.tmp/js'))
    .pipe(server.reload({stream: true}));
};


const lintBase = files => {
  return src(files)
    .pipe($.eslint({ fix: true }))
    .pipe(server.reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!server.active, $.eslint.failAfterError()));
}
function lint() {
  return lintBase('app/js/**/*.js')
    .pipe(dest('app/js'));
};
function lintTest() {
  return lintBase('test/spec/**/*.js')
    .pipe(dest('test/spec'));
};

function html() {
  return src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.postcss([cssnano({safe: true, autoprefixer: false})])))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(dest('dist'));
}

function images() {
  return src('app/images/**/*', { since: lastRun(images) })
    .pipe($.imagemin())
    .pipe(dest('dist/images'));
};

function fonts() {
  return src('app/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.if(!isProd, dest('.tmp/fonts'), dest('dist/fonts')));
};

function extras() {
  return src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(dest('dist'));
};

function clean() {
  return del(['.tmp', 'dist'])
}

function measureSize() {
  return src('dist/**/*')
    .pipe($.size({title: 'build', gzip: true}));
}

const build = series(
  clean,
  parallel(
    lint,
    series(parallel(styles, js), html),
    images,
    fonts,
    extras
  ),
  measureSize
);

function startAppServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  watch([
    'app/iiw/*',
    'app/iiw/**/*',
    'app/iiw/**/**/*',
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', server.reload);

  watch('app/styles/**/*.less', styles);
  watch('app/js/**/*.js', js);
  watch('app/fonts/**/*', fonts);
}

function startTestServer() {
  server.init({
    notify: false,
    port,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/js': '.tmp/js',
        '/node_modules': 'node_modules'
      }
    }
  });

  watch('app/js/**/*.js', js);
  watch(['test/spec/**/*.js', 'test/index.html']).on('change', server.reload);
  watch('test/spec/**/*.js', lintTest);
}

function startDistServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: 'dist',
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
}

let serve;
if (isDev) {
  serve = series(clean, parallel(styles, js, fonts), startAppServer);
} else if (isTest) {
  serve = series(clean, js, startTestServer);
} else if (isProd) {
  serve = series(build, startDistServer);
}

exports.serve = serve;
exports.build = build;
exports.default = build;
