import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Blog.css';

const posts = [
  {
    title: 'Los libros mas prestados del semestre',
    excerpt:
      'Descubre los titulos que mas circularon entre estudiantes y curiosos lectores durante esta temporada.',
    category: 'Tendencias',
    accent: 'mint',
  },
  {
    title: 'Libros que todo universitario deberia leer',
    excerpt:
      'Una seleccion para crecer academicamente y tambien como persona, sin importar la carrera que estudies.',
    category: 'Guias',
    accent: 'coral',
  },
  {
    title: 'Como leer entre parciales y tareas',
    excerpt:
      'Estrategias sencillas para mantener un ritmo de lectura realista aun en semanas exigentes.',
    category: 'Habitos',
    accent: 'gold',
  },
  {
    title: 'Lecturas cortas para mentes ocupadas',
    excerpt:
      'Historias breves, intensas y memorables para aprovechar pausas entre clases o trayectos cortos.',
    category: 'Recomendados',
    accent: 'mint',
  },
  {
    title: 'Por que el libro fisico sigue ayudando a estudiar',
    excerpt:
      'Subrayar, anotar y recordar mejor siguen siendo ventajas muy valiosas en el aprendizaje.',
    category: 'Estudio',
    accent: 'coral',
  },
  {
    title: 'Testimonios de estudiantes lectores',
    excerpt:
      'Relatos de quienes encontraron motivacion, calma e ideas nuevas gracias a la biblioteca.',
    category: 'Comunidad',
    accent: 'gold',
  },
];

const Blog = () => {
  return (
    <main className="blog-page" id="inicio">
      <Navbar />

      <section className="blog-hero" id="blog">
        <div className="blog-hero__content">
          <p className="blog-hero__eyebrow">Nuestro blog literario</p>
          <h1>Todas nuestras historias</h1>
          <h2>Voces que inspiran, relatos que transforman</h2>
          <p className="blog-hero__description">
            Explora recomendaciones, experiencias y consejos pensados para una
            comunidad que encuentra en la lectura una forma de crecer.
          </p>
        </div>
      </section>

      <section className="blog-highlights">
        <article className="blog-featured">
          <span className="blog-chip">Edicion destacada</span>
          <h3>La biblioteca tambien cuenta historias fuera de los libros</h3>
          <p>
            Este espacio reune ideas, testimonios y selecciones pensadas para
            que cada visita a la biblioteca se sienta mas cercana, util e
            inspiradora.
          </p>
        </article>

        <article className="blog-quote">
          <p>
            “Cada lectura deja una huella distinta: unas enseñan, otras
            acompanan y algunas cambian el rumbo.”
          </p>
        </article>
      </section>

      <section className="blog-grid-section">
        <div className="blog-grid__header">
          <div>
            <p className="blog-grid__label">Ultimas publicaciones</p>
            <h3>Lecturas pensadas para estudiantes curiosos</h3>
          </div>
          <p className="blog-grid__intro">
            Conservamos tu idea original, pero con una presentacion mas moderna
            y clara para Vite y React.
          </p>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.title} className={`blog-card blog-card--${post.accent}`}>
              <div className="blog-card__media">
                <span>{post.category}</span>
              </div>
              <div className="blog-card__body">
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
                <a href="#post" className="blog-card__link">
                  Leer articulo
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blog;
