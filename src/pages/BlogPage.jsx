import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getAllPosts } from '../helpers/blogStorage';
import './Blog.css';

const BlogPage = () => {
  const [posts, setPosts] = useState(() => getAllPosts());
  const location = useLocation();
  const { isLogged } = useAuth();

  useEffect(() => {
    const syncPosts = () => setPosts(getAllPosts());
    window.addEventListener('storage', syncPosts);
    return () => window.removeEventListener('storage', syncPosts);
  }, []);

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
            "Cada lectura deja una huella distinta: unas ensenan, otras
            acompanan y algunas cambian el rumbo."
          </p>
        </article>
      </section>

      <section className="blog-grid-section">
        <div className="blog-grid__header">
          <div>
            <p className="blog-grid__label">Ultimas publicaciones</p>
            <h3>Lecturas pensadas para estudiantes curiosos</h3>
          </div>
          <div className="blog-grid__actions">
            <p className="blog-grid__intro">
              Conservamos tu idea original, pero con una presentacion mas moderna
              y clara para Vite y React.
            </p>
            <Link
              to={isLogged ? '/crear-post' : '/login'}
              state={isLogged ? undefined : { from: location }}
              className="blog-create-link"
            >
              Crear articulo
            </Link>
          </div>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.slug} className={`blog-card blog-card--${post.accent}`}>
              <div
                className={`blog-card__media${post.image ? ' blog-card__media--image' : ''}`}
                style={post.image ? { backgroundImage: `linear-gradient(180deg, rgba(17, 17, 17, 0.15), rgba(17, 17, 17, 0.45)), url(${post.image})` } : undefined}
              >
                <span>{post.category}</span>
              </div>
              <div className="blog-card__body">
                <h4>{post.title}</h4>
                <p>{post.excerpt}</p>
                <p className="blog-card__author">
                  {post.authorName ? `Por ${post.authorName}` : 'Por Biblioteca Virtual'}
                </p>
                <Link
                  to={isLogged ? `/post/${post.slug}` : '/login'}
                  state={isLogged ? { from: '/blog' } : { from: { pathname: `/post/${post.slug}` } }}
                  className="blog-card__link"
                >
                  Leer articulo
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BlogPage;
