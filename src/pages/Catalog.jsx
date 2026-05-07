import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import './Catalog.css';

const googleBooksApiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY?.trim();
const bookApiUrl = import.meta.env.VITE_BOOK_API_URL?.trim();

const normalizeSearchTerm = (text) => {
  if (!text) return '';
  return decodeURIComponent(text).replace(/\+/g, ' ').trim();
};

const defaultQuery = normalizeSearchTerm(import.meta.env.VITE_GOOGLE_BOOKS_QUERY) || 'best seller';
const defaultDisplayLabel = 'libros populares';

const Catalog = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('all');
  const [genre, setGenre] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const languageLabels = {
    all: 'Todos',
    es: 'Español',
    en: 'Inglés',
    pt: 'Portugués',
    fr: 'Francés',
    it: 'Italiano',
    de: 'Alemán',
  };

  const genreOptions = [
    { value: 'all', label: 'Todos los géneros' },
    { value: 'fiction', label: 'Ficción' },
    { value: 'history', label: 'Historia' },
    { value: 'science', label: 'Ciencia' },
    { value: 'mystery', label: 'Misterio' },
    { value: 'fantasy', label: 'Fantasía' },
    { value: 'biography', label: 'Biografía' },
    { value: 'children', label: 'Infantil' },
  ];

  const openLibraryLanguageCodes = {
    es: 'spa',
    en: 'eng',
    pt: 'por',
    fr: 'fre',
    it: 'ita',
    de: 'ger',
  };

  const addGenreToQuery = (searchTerm) => {
    if (!searchTerm) {
      return genre !== 'all' ? `subject:${genre}` : '';
    }
    return genre !== 'all' ? `${searchTerm} subject:${genre}` : searchTerm;
  };

  const getFilterLabels = () => {
    const filters = [];
    if (language !== 'all') filters.push(languageLabels[language]);
    if (genre !== 'all') {
      const genreLabel = genreOptions.find((option) => option.value === genre)?.label;
      if (genreLabel) filters.push(genreLabel);
    }
    return filters.length ? ` (${filters.join(', ')})` : '';
  };

  const buildUrl = (searchTerm) => {
    const searchWithGenre = addGenreToQuery(searchTerm);
    const langParam = language !== 'all' ? `&langRestrict=${language}` : '';

    if (bookApiUrl) {
      const separator = bookApiUrl.includes('?') ? '&' : '?';
      return `${bookApiUrl}${separator}q=${encodeURIComponent(searchWithGenre)}&maxResults=40${langParam}`;
    }

    const keyParam = googleBooksApiKey ? `&key=${googleBooksApiKey}` : '';
    return `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchWithGenre)}&maxResults=40${langParam}${keyParam}`;
  };

  const buildOpenLibraryUrl = (searchTerm) => {
    const searchWithGenre = addGenreToQuery(searchTerm);
    const languageParam =
      language !== 'all' && openLibraryLanguageCodes[language]
        ? `&language=${openLibraryLanguageCodes[language]}`
        : '';
    return `https://openlibrary.org/search.json?q=${encodeURIComponent(searchWithGenre)}&limit=100${languageParam}`;
  };

  const normalizeOpenLibraryId = (value) => {
    if (!value) return null;
    return value.replace(/^\//, '').replace(/\//g, '-');
  };

  const mapOpenLibraryResults = (data) => {
    return (data.docs || []).map((doc) => {
      const rawId = doc.key || doc.cover_edition_key || `${doc.title}-${doc.first_publish_year || ''}`;
      return {
        id: normalizeOpenLibraryId(rawId),
        volumeInfo: {
          title: doc.title || 'Título no disponible',
          authors: doc.author_name,
          imageLinks: {
            thumbnail: doc.cover_i
              ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
              : null,
          },
          publishedDate: doc.first_publish_year?.toString(),
          pageCount: doc.number_of_pages_median,
          language: doc.language?.[0],
          description: doc.subject ? doc.subject.slice(0, 3).join(', ') : 'Descripción no disponible',
        },
      };
    });
  };

  const fetchOpenLibrary = async (searchTerm, displayLabel = null) => {
    const url = buildOpenLibraryUrl(searchTerm);
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Open Library HTTP ${response.status} ${response.statusText}: ${errorBody}`);
    }

    const data = await response.json();
    const items = mapOpenLibraryResults(data);

    if (!items.length) {
      setBooks([]);
      const displayTerm = displayLabel || normalizeSearchTerm(searchTerm);
      setStatus(`No se encontraron resultados para "${displayTerm}"${getFilterLabels()}`);
      return;
    }

    const displayTerm = displayLabel || normalizeSearchTerm(searchTerm);
    setBooks(items);
    setStatus(`Mostrando ${items.length} resultados para "${displayTerm}"${getFilterLabels()}`);
  };

  const fetchBooks = async (searchTerm) => {
    const isDefaultSearch = !searchTerm?.trim();
    const effectiveQuery = isDefaultSearch ? defaultQuery : searchTerm;
    const displayTerm = isDefaultSearch ? defaultDisplayLabel : normalizeSearchTerm(effectiveQuery);

    setLoading(true);
    setError(null);
    setStatus('');

    try {
      const url = buildUrl(effectiveQuery);
      const response = await fetch(url);

      if (!response.ok) {
        const errorBody = await response.text();
        const message = `HTTP ${response.status} ${response.statusText}: ${errorBody}`;
        if (response.status === 429 || message.includes('rateLimitExceeded')) {
          console.warn('Google Books cuota excedida, usando Open Library como respaldo');
          await fetchOpenLibrary(effectiveQuery, displayTerm);
          return;
        }
        throw new Error(message);
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        setBooks([]);
        setStatus(`No se encontraron resultados para "${displayTerm}"${getFilterLabels()}`);
        return;
      }

      setBooks(data.items);
      setStatus(`Mostrando ${data.items.length} resultados para "${displayTerm}"${getFilterLabels()}`);
    } catch (err) {
      console.error('Error fetching books:', err);
      if (err.message.includes('rateLimitExceeded') || err.message.includes('429')) {
        try {
          await fetchOpenLibrary(effectiveQuery, displayTerm);
          return;
        } catch (fallbackErr) {
          console.error('Fallback open library error:', fallbackErr);
        }
      }
      setError(`Error al consultar la API de libros: ${err.message}`);
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, genre]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchBooks(query);
  };

  return (
    <main className="catalog-page">
      <Navbar />
      <section className="catalog-hero">
        <div className="catalog-hero-body container text-center">
          <h1>Catálogo de libros</h1>
          <p>Explora nuestra colección y descubre títulos que te inspiren.</p>
          <form className="search-form" onSubmit={handleSubmit}>
            <div className="row justify-content-center align-items-center gap-2">
              <div className="col-12 col-md-6 col-lg-5 mb-3 mb-md-0">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Busca por reseña, autores o palabras clave"
                  className="form-control"
                  aria-label="Buscar libros"
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-outline-success" type="submit" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>

            <div className="filters-toggle row justify-content-center mt-3">
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-filter-toggle"
                  onClick={() => setShowFilters((current) => !current)}
                >
                  {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                </button>
              </div>
            </div>

            <div className={`filters-row row justify-content-center mt-3 g-2 ${showFilters ? 'visible' : 'collapsed'}`}>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="form-select form-select-sm"
                  aria-label="Filtrar por idioma"
                >
                  <option value="all">Idioma: Todos</option>
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                  <option value="pt">Portugués</option>
                  <option value="fr">Francés</option>
                  <option value="it">Italiano</option>
                  <option value="de">Alemán</option>
                </select>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                <select
                  value={genre}
                  onChange={(event) => setGenre(event.target.value)}
                  className="form-select form-select-sm"
                  aria-label="Filtrar por género"
                >
                  {genreOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
          <p className="status-text mt-3">{error || status}</p>
        </div>
      </section>

      <section className="container book-list mt-5">
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
          {books.map((item) => {
            const volume = item.volumeInfo || {};
            const thumbnail =
              volume.imageLinks?.thumbnail?.replace('http://', 'https://') ||
              'https://via.placeholder.com/200x300?text=Portada';
            const authors = (volume.authors || ['Autor no disponible']).join(', ');

            return (
              <div className="col" key={item.id}>
                <article className="card h-100 catalog-card">
                  <Link to={`/detalle/${item.id}`} state={{ book: item }} className="text-decoration-none">
                    <img
                      src={thumbnail}
                      className="card-img-top"
                      alt={volume.title || 'Libro'}
                      onError={(event) => {
                        event.currentTarget.src = 'https://via.placeholder.com/200x300?text=Portada';
                      }}
                    />
                  </Link>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{volume.title || 'Título no disponible'}</h5>
                    <p className="card-text text-muted mb-3">{authors}</p>
                    <Link to={`/detalle/${item.id}`} state={{ book: item }} className="btn btn-outline-primary mt-auto">
                      Ver detalle
                    </Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Catalog;
