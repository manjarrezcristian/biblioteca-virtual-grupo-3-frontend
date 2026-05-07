const GOOGLE_BOOKS_QUERY = import.meta.env.VITE_GOOGLE_BOOKS_QUERY || ''
const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || ''
const DIVERSE_QUERIES = [
  'subject:fiction',
  'subject:history',
  'subject:science',
  'subject:fantasy',
  'subject:biography',
  'subject:poetry',
]

function buildGoogleBooksUrl(query) {
  const params = new URLSearchParams({
    q: query,
    maxResults: '8',
    printType: 'books',
    projection: 'lite',
  })

  if (GOOGLE_BOOKS_API_KEY) {
    params.set('key', GOOGLE_BOOKS_API_KEY)
  }

  return `https://www.googleapis.com/books/v1/volumes?${params.toString()}`
}

function buildOpenLibraryUrl(query) {
  return `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`
}

function mapGoogleBooksResponse(data) {
  if (!data?.items || !Array.isArray(data.items) || data.items.length === 0) return null

  return data.items.map((item) => {
    const info = item.volumeInfo || {}
    const imageUrl =
      info.imageLinks?.thumbnail ||
      info.imageLinks?.smallThumbnail ||
      info.imageLinks?.small ||
      info.imageLinks?.medium ||
      info.imageLinks?.large ||
      info.imageLinks?.extraLarge ||
      ''

    return {
      title: info.title || 'Sin título',
      category: Array.isArray(info.categories) ? info.categories[0] : info.categories || 'General',
      image: imageUrl ? imageUrl.replace(/^http:/, 'https:') : '',
    }
  })
}

function mapOpenLibraryResponse(data) {
  if (!data?.docs || !Array.isArray(data.docs) || data.docs.length === 0) return null

  return data.docs.map((doc) => ({
    title: doc.title || 'Sin título',
    category: Array.isArray(doc.subject) ? doc.subject[0] : 'General',
    image: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : '',
  }))
}

function shuffleItems(items) {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]]
  }

  return copy
}

function dedupeBooks(items) {
  const seen = new Set()

  return items.filter((item) => {
    const key = `${item.title || ''}-${item.category || ''}-${item.image || ''}`

    if (!key || seen.has(key)) return false

    seen.add(key)
    return true
  })
}

async function fetchJson(url, errorLabel) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${errorLabel}: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

export async function fetchBookData(query) {
  const searchQuery = query || GOOGLE_BOOKS_QUERY
  const customUrl = import.meta.env.VITE_BOOK_API_URL?.trim()

  if (customUrl) {
    const data = await fetchJson(customUrl, 'Error al cargar libros')
    return Array.isArray(data.books) ? data.books : []
  }

  if (!searchQuery) {
    try {
      const googleResults = await Promise.all(
        DIVERSE_QUERIES.map(async (seedQuery) => {
          const data = await fetchJson(buildGoogleBooksUrl(seedQuery), 'Error al cargar libros')
          return mapGoogleBooksResponse(data) || []
        })
      )

      const mergedGoogleBooks = dedupeBooks(shuffleItems(googleResults.flat())).slice(0, 8)
      if (mergedGoogleBooks.length > 0) return mergedGoogleBooks
    } catch (error) {
      console.warn('Google Books no estuvo disponible para la carga diversa, usando Open Library.', error)
    }

    const openLibraryResults = await Promise.all(
      DIVERSE_QUERIES.map(async (seedQuery) => {
        const data = await fetchJson(buildOpenLibraryUrl(seedQuery), 'Error al cargar libros desde Open Library')
        return mapOpenLibraryResponse(data) || []
      })
    )

    return dedupeBooks(shuffleItems(openLibraryResults.flat())).slice(0, 8)
  }

  try {
    const googleData = await fetchJson(buildGoogleBooksUrl(searchQuery), 'Error al cargar libros')
    const googleBooks = mapGoogleBooksResponse(googleData)
    if (googleBooks && googleBooks.length > 0) return googleBooks
  } catch (error) {
    console.warn('Google Books no estuvo disponible, usando Open Library como respaldo.', error)
  }

  const openLibraryData = await fetchJson(buildOpenLibraryUrl(searchQuery), 'Error al cargar libros desde Open Library')
  const openLibraryBooks = mapOpenLibraryResponse(openLibraryData)
  return openLibraryBooks && openLibraryBooks.length > 0 ? openLibraryBooks : []
}
