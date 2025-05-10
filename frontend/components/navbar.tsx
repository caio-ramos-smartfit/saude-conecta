"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/app/context/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, Menu, X } from "lucide-react"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path
  const isHomePage = pathname === "/"

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">SaúdeConecta</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Início
          </Link>
          
          {isHomePage && (
            <>
              <Link
                href="#features"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("#features") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Recursos
              </Link>
              <Link
                href="#how-it-works"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("#how-it-works") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Como Funciona
              </Link>
              <Link
                href="#providers"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("#providers") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Para Profissionais
              </Link>
            </>
          )}
          
          <Link
            href="/search"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/search") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Buscar Profissionais
          </Link>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.firstName ? getInitials(user.firstName) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.firstName || "Usuário"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={user.user_type === "provider" ? "/providers/dashboard" : "/patient/dashboard"}>
                    Meu Painel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Cadastrar-se
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="container py-4 space-y-4">
            <Link
              href="/"
              className={`block py-2 text-base font-medium ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            
            {isHomePage && (
              <>
                <Link
                  href="#features"
                  className={`block py-2 text-base font-medium ${
                    isActive("#features") ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recursos
                </Link>
                <Link
                  href="#how-it-works"
                  className={`block py-2 text-base font-medium ${
                    isActive("#how-it-works") ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Como Funciona
                </Link>
                <Link
                  href="#providers"
                  className={`block py-2 text-base font-medium ${
                    isActive("#providers") ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Para Profissionais
                </Link>
              </>
            )}
            
            <Link
              href="/search"
              className={`block py-2 text-base font-medium ${
                isActive("/search") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Buscar Profissionais
            </Link>
            
            {user ? (
              <>
                <div className="py-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {user.firstName ? getInitials(user.firstName) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.firstName || "Usuário"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
                <Link
                  href={user.user_type === "provider" ? "/providers/dashboard" : "/patient/dashboard"}
                  className="block py-2 text-base font-medium text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Meu Painel
                </Link>
                <Link
                  href="/profile"
                  className="block py-2 text-base font-medium text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-2 text-base font-medium text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Cadastrar-se
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
