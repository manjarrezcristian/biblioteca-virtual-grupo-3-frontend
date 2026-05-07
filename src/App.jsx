import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './router/PrivateRoute'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import BlogPage from './pages/BlogPage'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import UserProfile from './pages/UserProfile'
import BookDetail from './pages/BookDetail'
import PostPage from './pages/PostPage'
import CreatePostPage from './pages/CreatePostPage'
import NotFound from './pages/NotFound'
import AdminDashboardPlaceholder from './pages/placeholders/AdminDashboardPlaceholder'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/usuario/perfil"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboardPlaceholder />
            </PrivateRoute>
          }
        />
        <Route path="/detalle/:id" element={<BookDetail />} />
        <Route
          path="/post/:slug"
          element={
            <PrivateRoute>
              <PostPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/crear-post"
          element={
            <PrivateRoute>
              <CreatePostPage />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <PrivateRoute>
              <NotFound />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
