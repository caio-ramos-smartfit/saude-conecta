"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "lucide-react"
import { useAuth } from "@/app/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"patient" | "provider">("patient")
  
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })

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

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPatientData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProviderData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (patientData.password !== patientData.confirmPassword) {
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
        email: patientData.email,
        password: patientData.password,
        passwordConfirmation: patientData.confirmPassword,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        phone: patientData.phone,
        address: patientData.address,
      }
      
      await register(userData, 'patient')
      
      toast({
        title: "Registro realizado com sucesso",
        description: "Sua conta foi criada. Você será redirecionado para o painel do paciente.",
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

  const handleProviderSubmit = async (e: React.FormEvent) => {
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
          <Tabs 
            defaultValue="patient" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "patient" | "provider")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="patient">Paciente</TabsTrigger>
              <TabsTrigger value="provider">Profissional</TabsTrigger>
            </TabsList>
            <TabsContent value="patient">
              <form onSubmit={handlePatientSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={patientData.firstName}
                      onChange={handlePatientChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={patientData.lastName}
                      onChange={handlePatientChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-email">Email</Label>
                  <Input
                    id="patient-email"
                    name="email"
                    type="email"
                    required
                    value={patientData.email}
                    onChange={handlePatientChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-phone">Telefone</Label>
                  <Input
                    id="patient-phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    required
                    value={patientData.phone}
                    onChange={handlePatientChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-address">Endereço</Label>
                  <Input
                    id="patient-address"
                    name="address"
                    required
                    value={patientData.address}
                    onChange={handlePatientChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-password">Senha</Label>
                  <Input
                    id="patient-password"
                    name="password"
                    type="password"
                    required
                    value={patientData.password}
                    onChange={handlePatientChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-confirm-password">Confirmar Senha</Label>
                  <Input
                    id="patient-confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={patientData.confirmPassword}
                    onChange={handlePatientChange}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Criar Conta de Paciente"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="provider">
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
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full">
              Google
            </Button>
            <Button variant="outline" className="w-full">
              Facebook
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
