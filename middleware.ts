import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isLoginRoute = req.nextUrl.pathname === '/admin/login'

    // Ne pas rediriger si on est déjà sur la page de login
    if (isLoginRoute) {
      return NextResponse.next()
    }

    // Rediriger vers login si on n'est pas authentifié sur une route admin
    if (isAdminRoute && (!token || token.role !== 'admin')) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
        const isLoginRoute = req.nextUrl.pathname === '/admin/login'

        // Toujours autoriser l'accès à la page de login
        if (isLoginRoute) {
          return true
        }

        // Pour les autres routes admin, vérifier l'authentification
        if (isAdminRoute) {
          return token?.role === 'admin'
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}

