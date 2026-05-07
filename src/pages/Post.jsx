import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Post.css';

const featuredBooks = [
  {
    title: 'Cien anos de soledad',
    coverClass: 'post-book__cover--emerald',
    text: 'De Gabriel Garcia Marquez lidero el listado, siendo prestado en mas de 30 ocasiones. Esta obra sigue siendo una de las mas influyentes en el ambito academico y personal.',
  },
  {
    title: 'El Principito',
    coverClass: 'post-book__cover--gold',
    text: 'Una fabula poetica que no pierde vigencia y que continua encantando tanto a jovenes como adultos. Su mensaje universal lo convirtio en una lectura obligada este semestre.',
  },
  {
    title: '1984',
    coverClass: 'post-book__cover--coral',
    text: 'De George Orwell completa el top tres con una novela distopica que invita a reflexionar sobre vigilancia, control y libertad individual. Su relevancia actual sigue atrayendo lectores.',
  },
];

const Post = () => {
  return (
    <main className="post-page">
      <Navbar />

      <section className="post-shell">
        <div className="post-header">
          <button
            type="button"
            className="post-back"
            onClick={() => {
              window.location.hash = '#blog';
            }}
          >
            Regresar
          </button>

          <div className="post-meta">
            <p className="post-kicker">Articulo destacado</p>
            <h1>Los libros mas prestados del semestre</h1>
            <p className="post-subtitle">
              Descubre cuales fueron los titulos mas populares entre los
              estudiantes este semestre y por que siguen dejando huella.
            </p>
          </div>
        </div>

        <article className="post-article">
          <div className="post-hero-image" aria-hidden="true">
            <span>Biblioteca Virtual</span>
          </div>

          <p className="post-lead">
            Durante este semestre, los estudiantes demostraron un gran interes
            por la literatura clasica, el pensamiento critico y las historias
            que inspiran. Entre los titulos mas solicitados se destacaron obras
            capaces de abrir conversaciones dentro y fuera del aula.
          </p>

          {featuredBooks.map((book) => (
            <div key={book.title} className="post-book">
              <div className={`post-book__cover ${book.coverClass}`}>
                <span>{book.title}</span>
              </div>

              <div className="post-book__content">
                <h2>{book.title}</h2>
                <p>{book.text}</p>
              </div>
            </div>
          ))}

          <p>
            Estos libros no solo fueron los mas prestados, sino que tambien
            generaron discusiones enriquecedoras en las aulas y grupos de
            lectura. La literatura sigue siendo un puente entre generaciones,
            ofreciendo perspectivas unicas y fomentando el amor por leer.
          </p>

          <p>
            Mas alla del numero de prestamos, lo valioso esta en el impacto que
            dejan en quienes los descubren. Cada libro abre una puerta distinta:
            a la imaginacion, al conocimiento o al cuestionamiento critico.
          </p>

          <p className="post-closing">
            ¿Y tu? ¿Ya leiste alguno de estos libros?
          </p>
        </article>
      </section>

      <Footer />
    </main>
  );
};

export default Post;
