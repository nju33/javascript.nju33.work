import gulp from 'gulp';
import Diz from 'diz';
import gif from 'gulp-if';
import htmlmin from 'gulp-htmlmin';
import imageResize from 'gulp-image-resize';
import assetCache from 'gulp-asset-cache';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import less from 'gulp-less';
import NpmImportPlugin from 'less-plugin-npm-import';
import browserSync from 'browser-sync';
import bsConfig from './bs-config';

const bs = browserSync.create();

gulp.task('blog', ['style'], () => {
  Diz.load({base: './blogs'})
  .then(roots => {
    const renderer = new Diz({roots});
    renderer.render()
      .pipe(gulp.dest('dist'));
    renderer.bundle().then(stream => {
      stream.pipe(gulp.dest('dist'));
    });
  })
  .catch(err => {
    console.log(err);
  });
});

gulp.task('image', () => {
  gulp.src('images/**/*.+(png|jpg|gif)')
    .pipe(assetCache.filter('./images/.cache'))
    .pipe(imageResize({
      width: 660
    }))
    .pipe(imagemin({
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/javascript/'))
});

gulp.task('style', () => {
  gulp.src('src/styles/index.less')
    .pipe(less({
      plugins: [new NpmImportPlugin()]
    }))
    .pipe(gulp.dest('dist/javascript/styles'));
});

gulp.task('copy', () => {
  gulp.src('src/*.html').pipe(gulp.dest('dist/javascript'))
});

gulp.task('watch', ['blog', 'image'], () => {
  bs.init(bsConfig, () => {
    gulp.watch('blogs/**/*', ['blog']);
    gulp.watch('src/styles/**/*', ['style'])
  });
});
