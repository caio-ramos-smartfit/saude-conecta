"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Plus } from "lucide-react"
import { useAuth } from "@/app/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface Appointment {
  id: string;
  provider: {
    id: string;
    organization_name: string;
    address: string;
  };
  date: string;
  time: string;
  service: string;
  status: string;
}

export default function AppointmentsPage() {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  const { user } = useAuth()
  const { toast } = useToast()
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return
      
      try {
        const response = await fetch('/api/appointments')
        
        if (response.ok) {
          const appointments = await response.json()
          
          const now = new Date()
          const upcoming: Appointment[] = []
          const past: Appointment[] = []
          
          appointments.forEach((appointment: Appointment) => {
            const appointmentDate = new Date(`${appointment.date}T${appointment.time}`)
            
            if (appointmentDate > now) {
              upcoming.push(appointment)
            } else {
              past.push(appointment)
            }
          })
          
          setUpcomingAppointments(upcoming)
          setPastAppointments(past)
        } else {
          throw new Error('Falha ao carregar consultas')
        }
      } catch (error) {
        console.error('Error fetching appointments:', error)
        toast({
          title: "Erro ao carregar consultas",
          description: "Não foi possível carregar suas consultas. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAppointments()
  }, [user, toast])
  
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setUpcomingAppointments(upcomingAppointments.filter(app => app.id !== appointmentId))
        
        toast({
          title: "Consulta cancelada",
          description: "Sua consulta foi cancelada com sucesso.",
          variant: "default",
        })
      } else {
        throw new Error('Falha ao cancelar consulta')
      }
    } catch (error) {
      console.error('Error canceling appointment:', error)
      toast({
        title: "Erro ao cancelar consulta",
        description: "Não foi possível cancelar sua consulta. Tente novamente mais tarde.",
        variant: "destructive",
      })
    }
  }
  
  const formatService = (service: string) => {
    const serviceMap: Record<string, string> = {
      general_checkup: "Consulta Geral",
      vaccination: "Vacinação",
      blood_test: "Exame de Sangue",
      dental: "Atendimento Odontológico",
      mental_health: "Saúde Mental",
    }
    
    return serviceMap[service] || service
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Minhas Consultas</h1>
          <p className="text-muted-foreground">Gerencie suas consultas médicas</p>
        </div>
        <Link href="/patient/appointments/book">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Agendar Nova Consulta
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Consultas</CardTitle>
          <CardDescription>Visualize e gerencie suas consultas</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <p>Carregando consultas...</p>
            </div>
          ) : (
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                <TabsTrigger value="past">Anteriores</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="rounded-lg border p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{appointment.provider.organization_name}</h3>
                          <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {formatService(appointment.service)}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                            <span>{appointment.provider.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link href={`/patient/appointments/${appointment.id}/reschedule`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              Reagendar
                            </Button>
                          </Link>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Você não tem consultas agendadas</p>
                    <Link href="/patient/appointments/book">
                      <Button>Agendar Consulta</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="past">
                {pastAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <div key={appointment.id} className="rounded-lg border p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{appointment.provider.organization_name}</h3>
                          <div className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                            {formatService(appointment.service)}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                            <span>{appointment.provider.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Link href={`/patient/appointments/${appointment.id}`}>
                            <Button variant="outline" size="sm" className="w-full">
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Você não tem consultas anteriores</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/patient/dashboard">
            <Button variant="outline">Voltar ao Painel</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
