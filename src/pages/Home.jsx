import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchBookData } from '../services/bookService'
import { useAuth } from '../contexts/AuthContext'
import './Home.css'

const getBookImage = (book) => {
  return (
    book.image ||
    book.thumbnail ||
    book.cover ||
    book.coverImage ||
    book.imageUrl ||
    book.img ||
    book.picture ||
    book.portada ||
    null
  )
}

const Home = () => {
  const { isLogged } = useAuth()
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [booksError, setBooksError] = useState(null)
  const [loadingBooks, setLoadingBooks] = useState(true)
  const carouselRef = useRef(null)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const books = await fetchBookData()
        setFeaturedBooks(Array.isArray(books) ? books : [])
        setBooksError(null)
      } catch (error) {
        console.error(error)
        setBooksError(error.message || 'No se pudo cargar la base de datos remota.')
      } finally {
        setLoadingBooks(false)
      }
    }

    setLoadingBooks(true)
    loadBooks()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: 260, behavior: 'smooth' })
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const scrollCarousel = (distance) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: distance, behavior: 'smooth' })
    }
  }

  return (
    <main className="home" id="home">
      <Navbar />

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-copy">
            <span className="hero-label">Biblioteca Virtual</span>
            <h1>Lecturas que despiertan tu imaginación</h1>
            <p>
              Explora libros, artículos y recomendaciones en un espacio pensado para lectores como tú.
              Encuentra tu próxima historia favorita con estilo y facilidad.
            </p>
            <div className="hero-actions">
              {!isLogged ? (
                <Link to="/login" className="btn btn-primary btn-hero">
                  Iniciar sesión
                </Link>
              ) : (
                <Link to="/perfil" className="btn btn-primary btn-hero">
                  Ir a perfil
                </Link>
              )}
            </div>
          </div>

          <div className="hero-image-panel">
            <div className="hero-card hero-card--top">
              <p className="hero-card-title">Top recomendado</p>
              <strong>Historias inolvidables</strong>
            </div>
            <div className="hero-card hero-card--middle">
              <p className="hero-card-title">Catálogo</p>
              <strong>+1200 títulos</strong>
            </div>
            <div className="hero-card hero-card--bottom">
              <p className="hero-card-title">Explora</p>
              <strong>Categorías nuevas</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-section" id="catalog">
        <div className="container-inner">
          <div className="section-header">
            <p>Libros más leídos</p>
            <h2>Descubre lecturas populares</h2>
          </div>
          <div className="carousel-header">
            <div className="carousel-controls">
              <button type="button" onClick={() => scrollCarousel(-300)} aria-label="Anterior">
                ‹
              </button>
              <button type="button" onClick={() => scrollCarousel(300)} aria-label="Siguiente">
                ›
              </button>
            </div>
          </div>
          <div className="book-carousel" ref={carouselRef}>
            {loadingBooks ? (
              <p>Cargando libros...</p>
            ) : booksError ? (
              <p className="book-error">{booksError}</p>
            ) : (
              featuredBooks.map((book, index) => {
                const imageUrl = getBookImage(book)
                return (
                  <article className="book-card" key={`${book.title}-${book.category}-${index}`}>
                    <div className="book-thumb">
                      {imageUrl ? (
                        <img src={imageUrl} alt={book.title} />
                      ) : (
                        <span>{book.category}</span>
                      )}
                    </div>
                    <div className="book-info">
                      <h3>{book.title}</h3>
                    </div>
                  </article>
                )
              })
            )}
          </div>
          <div className="center-row">
            <Link to="/catalog" className="btn btn-primary btn-hero">
              Ver catálogo completo
            </Link>
          </div>
        </div>
      </section>

      <section className="story-section" id="blog">
        <div className="container-inner story-grid">
          <div className="story-copy">
            <p className="section-subtitle">Descubre las voces que inspiran cada página</p>
            <h2>Notas, reseñas y novedades</h2>
            <p>
              Conoce las voces detrás de cada libro y descubre recomendaciones que te acompañarán en cada lectura.
            </p>
            <Link to="/blog" className="btn btn-primary">
              Leer más
            </Link>
          </div>
          <div className="story-artwork"></div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Home
