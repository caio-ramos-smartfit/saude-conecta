"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "lucide-react"
import { useAuth } from "@/app/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [providerData, setProviderData] = useState({
    organizationName: "",
    contactName: "",
    specialty: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })
  
  const { register } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleProviderChange = (e: any) => {
    const { name, value } = e.target
    setProviderData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleProviderSubmit = async (e: any) => {
    e.preventDefault()
    
    if (providerData.password !== providerData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const userData = {
        email: providerData.email,
        password: providerData.password,
        passwordConfirmation: providerData.confirmPassword,
        organizationName: providerData.organizationName,
        contactName: providerData.contactName,
        specialty: providerData.specialty,
        phone: providerData.phone,
        address: providerData.address,
      }
      
      await register(userData, 'provider')
      
      toast({
        title: "Registro realizado com sucesso",
        description: "Sua conta foi criada. Você será redirecionado para o painel do profissional.",
        variant: "default",
      })
    } catch (error) {
      console.error("Erro no registro:", error)
      toast({
        title: "Falha no registro",
        description: "Não foi possível criar sua conta. Verifique os dados e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Criar uma conta</CardTitle>
          <CardDescription className="text-center">
            Cadastre-se para encontrar ou oferecer serviços de saúde acessíveis
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="w-full">
            <h3 className="text-lg font-medium mb-4">Cadastro de Profissional</h3>
            <form onSubmit={handleProviderSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Nome da Organização</Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    required
                    value={providerData.organizationName}
                    onChange={handleProviderChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Nome do Contato</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    required
                    value={providerData.contactName}
                    onChange={handleProviderChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    required
                    value={providerData.specialty}
                    onChange={handleProviderChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-email">Email</Label>
                  <Input
                    id="provider-email"
                    name="email"
                    type="email"
                    required
                    value={providerData.email}
                    onChange={handleProviderChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-phone">Telefone</Label>
                  <Input
                    id="provider-phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    required
                    value={providerData.phone}
                    onChange={handleProviderChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-address">Endereço</Label>
                  <Input
                    id="provider-address"
                    name="address"
                    required
                    value={providerData.address}
                    onChange={handleProviderChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-password">Senha</Label>
                  <Input
                    id="provider-password"
                    name="password"
                    type="password"
                    required
                    value={providerData.password}
                    onChange={handleProviderChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider-confirm-password">Confirmar Senha</Label>
                  <Input
                    id="provider-confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={providerData.confirmPassword}
                    onChange={handleProviderChange}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Criar Conta de Profissional"}
                </Button>
              </form>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
