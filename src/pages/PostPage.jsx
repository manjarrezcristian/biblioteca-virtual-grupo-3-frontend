import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { deleteCustomPost, getPostBySlug } from '../helpers/blogStorage';
import './Post.css';

const PostPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);
  const { user } = useAuth();

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const backTo =
    typeof location.state?.from === 'string'
      ? location.state.from
      : location.state?.from?.pathname || '/blog';

  const canDelete = Boolean(post.isCustom && user && post.authorId === user.id);

  const handleDelete = () => {
    deleteCustomPost(post.slug, user.id);
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <main className="post-page">
      <Navbar />

      <section className="post-shell">
        <div className="post-header">
          <Link to={backTo} className="post-back">
            Regresar
          </Link>

          <div className="post-meta">
            <p className="post-kicker">{post.kicker}</p>
            <h1>{post.title}</h1>
            <p className="post-subtitle">{post.subtitle}</p>
            <p className="post-author">
              {post.authorName ? `Autor: ${post.authorName}` : 'Autor: Biblioteca Virtual'}
            </p>
          </div>
        </div>

        <article className="post-article">
          <div
            className={`post-hero-image${post.image ? ' post-hero-image--custom' : ''}`}
            aria-hidden="true"
            style={post.image ? { backgroundImage: `linear-gradient(180deg, rgba(17, 17, 17, 0.15), rgba(17, 17, 17, 0.62)), url(${post.image})` } : undefined}
          >
            <span>{post.category}</span>
          </div>

          <p className="post-lead">{post.intro}</p>

          {post.books?.map((book) => (
            <div key={book.title} className="post-book">
              <div className={`post-book__cover ${book.coverClass || 'post-book__cover--emerald'}`}>
                <span></span>
              </div>

              <div className="post-book__content">
                <h2>{book.title}</h2>
                <p>{book.text}</p>
              </div>
            </div>
          ))}

          {(post.contentBlocks || post.paragraphs || []).map((block, index) => {
            if (block?.type === 'image' && block.image) {
              return (
                <div key={`block-image-${index}`} className="post-content-image">
                  <img src={block.image} alt={`Imagen del artículo ${index + 1}`} />
                </div>
              );
            }

            const text = block?.type === 'paragraph' ? block.text : block;
            return <p key={`block-text-${index}`}>{text}</p>;
          })}

          <p className="post-closing">{post.closing}</p>

          {canDelete ? (
            <div className="post-owner-actions">
              <button type="button" className="post-delete" onClick={handleDelete}>
                Eliminar mi articulo
              </button>
            </div>
          ) : null}
        </article>
      </section>

      <Footer />
    </main>
  );
};

export default PostPage;
