const { src, dest } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const exec = require('child_process').exec;

//Compilamos el scss a css
function build_css() {
    return src('sass/styles.scss')
    .pipe(sass())
    .pipe(dest('css/'))
}

//Generamos la documentación de los estilos
function build_sassdoc(cb) {
    exec('sassdoc ./sass/*  -d ./sassdoc/', function (err) {
        cb(err);
    });
}

//Añadir prefijos para la compatibilidad con otros navegadores
function postcss() {
    return gulp.src('styles.css')
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(gulp.dest('dist'))
}

//Despliega la web en amazon web services, creando un contenedor apache y clonando el código dentro de la carpeta que sirve apache
function deploy() {
    return gulp.ssh({
        ignoreErrors: false,
        sshConfig: {
          host: 'ajimpol834.duckdns.org',
          port: 22,
          username: 'ec2-user',
          password: 'clave.pem'
        }
      })
      .pipe(shell([
        'docker run -dit --name apache-container -p 80:80 apache',
        'git clone https://github.com/AgusJP/FastBurger.git /var/www/html'
      ]))
}


exports.build_css = build_css
exports.postcss = postcss
exports.build_sassdoc = build_sassdoc
exports.deploy = deploy

