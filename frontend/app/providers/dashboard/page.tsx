"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Plus, Users } from 'lucide-react'
import { useAuth } from "@/app/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function ProviderDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [availabilities, setAvailabilities] = useState([])
  const [newAvailability, setNewAvailability] = useState({
    date: "",
    start_time: "",
    end_time: "",
    duration: "30",
    cost: "",
    is_available: true,
    notes: "",
  })

  useEffect(() => {
    if (user?.provider?.id) {
      fetchAvailabilities()
    }
  }, [user])

  const fetchAvailabilities = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/availabilities?providerId=${user.provider.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setAvailabilities(data.data || [])
      } else {
        console.error("Erro ao buscar disponibilidades:", data.error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas disponibilidades.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar disponibilidades:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas disponibilidades.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAvailability((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      let availabilityData = { ...newAvailability }
      if (!availabilityData.end_time && availabilityData.start_time) {
        const [hours, minutes] = availabilityData.start_time.split(':').map(Number)
        const startDate = new Date()
        startDate.setHours(hours, minutes, 0)
        
        const endDate = new Date(startDate)
        endDate.setMinutes(endDate.getMinutes() + parseInt(availabilityData.duration))
        
        const endHours = endDate.getHours().toString().padStart(2, '0')
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0')
        availabilityData.end_time = `${endHours}:${endMinutes}`
      }
      
      const response = await fetch('/api/availabilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: user.provider.id,
          date: availabilityData.date,
          start_time: availabilityData.start_time,
          end_time: availabilityData.end_time,
          is_available: true,
          cost: availabilityData.cost
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Disponibilidade adicionada com sucesso!",
        })
        
        setNewAvailability({
          date: "",
          start_time: "",
          end_time: "",
          duration: "30",
          cost: "",
          is_available: true,
          notes: "",
        })
        
        fetchAvailabilities()
      } else {
        console.error("Erro ao adicionar disponibilidade:", data.error)
        toast({
          title: "Erro",
          description: data.error || "Não foi possível adicionar a disponibilidade.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao adicionar disponibilidade:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a disponibilidade.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Dados de exemplo para consultas
  const upcomingAppointments = [
    {
      id: 1,
      patientName: "João Silva",
      date: "Hoje",
      time: "14:30",
      service: "Consulta Geral",
    },
    {
      id: 2,
      patientName: "Maria Oliveira",
      date: "Amanhã",
      time: "10:15",
      service: "Vacinação",
    },
    {
      id: 3,
      patientName: "Roberto Santos",
      date: "15/05/2023",
      time: "15:45",
      service: "Exame de Sangue",
    },
  ]

  const availableSlots = [
    {
      id: 1,
      date: "Hoje",
      time: "16:30",
      duration: "30 min",
      cost: "Gratuito",
    },
    {
      id: 2,
      date: "Amanhã",
      time: "09:00",
      duration: "45 min",
      cost: "R$15",
    },
    {
      id: 3,
      date: "Amanhã",
      time: "11:30",
      duration: "30 min",
      cost: "Gratuito",
    },
    {
      id: 4,
      date: "15/05/2023",
      time: "14:00",
      duration: "60 min",
      cost: "R$25",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Painel do Profissional</h1>
          <p className="text-muted-foreground">Gerencie suas consultas e disponibilidade</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Disponibilidade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Disponibilidade</DialogTitle>
              <DialogDescription>Crie um novo horário de consulta para pacientes agendarem.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAvailability}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      required
                      value={newAvailability.date}
                      onChange={handleAvailabilityChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Horário de Início</Label>
                    <Input
                      id="start_time"
                      name="start_time"
                      type="time"
                      required
                      value={newAvailability.start_time}
                      onChange={handleAvailabilityChange}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Select 
                      defaultValue={newAvailability.duration}
                      onValueChange={(value) => 
                        setNewAvailability(prev => ({ ...prev, duration: value }))
                      }
                      disabled={loading}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Selecione a duração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="45">45 minutos</SelectItem>
                        <SelectItem value="60">60 minutos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Custo</Label>
                    <Input
                      id="cost"
                      name="cost"
                      placeholder="Gratuito ou valor em R$"
                      required
                      value={newAvailability.cost}
                      onChange={handleAvailabilityChange}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações (Opcional)</Label>
                  <Input
                    id="notes"
                    name="notes"
                    placeholder="Instruções especiais ou requisitos"
                    value={newAvailability.notes}
                    onChange={handleAvailabilityChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Adicionando..." : "Adicionar Horário"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
            <CardDescription>Este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">24</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Atendidos</CardTitle>
            <CardDescription>Este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">18</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Horários Disponíveis</CardTitle>
            <CardDescription>Próximos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">12</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Consultas Agendadas</TabsTrigger>
          <TabsTrigger value="available">Horários Disponíveis</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="rounded-md border">
            <div className="p-4 grid grid-cols-5 font-medium">
              <div>Paciente</div>
              <div>Data</div>
              <div>Horário</div>
              <div>Serviço</div>
              <div>Ações</div>
            </div>
            <div className="divide-y">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 grid grid-cols-5 items-center">
                  <div>{appointment.patientName}</div>
                  <div>{appointment.date}</div>
                  <div>{appointment.time}</div>
                  <div>{appointment.service}</div>
                  <div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="available">
          <div className="rounded-md border">
            <div className="p-4 grid grid-cols-5 font-medium">
              <div>Data</div>
              <div>Horário</div>
              <div>Duração</div>
              <div>Custo</div>
              <div>Ações</div>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <p>Carregando disponibilidades...</p>
              </div>
            ) : availabilities.length === 0 ? (
              <div className="p-8 text-center">
                <p>Nenhuma disponibilidade encontrada.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Adicione novos horários usando o botão "Adicionar Disponibilidade".
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {availabilities.map((slot) => {
                  const startTime = new Date(`2000-01-01T${slot.start_time}`);
                  const endTime = new Date(`2000-01-01T${slot.end_time}`);
                  const durationMinutes = Math.round((endTime - startTime) / 60000);
                  
                  return (
                    <div key={slot.id} className="p-4 grid grid-cols-5 items-center">
                      <div>{new Date(slot.date).toLocaleDateString('pt-BR')}</div>
                      <div>{slot.start_time}</div>
                      <div>{durationMinutes} min</div>
                      <div>{slot.cost ? `R$${slot.cost}` : 'Gratuito'}</div>
                      <div className="flex gap-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={async () => {
                            try {
                              setLoading(true);
                              const response = await fetch(`/api/availabilities?providerId=${user.provider.id}&id=${slot.id}`, {
                                method: 'DELETE',
                              });
                              
                              if (response.ok) {
                                toast({
                                  title: "Sucesso",
                                  description: "Disponibilidade removida com sucesso!",
                                });
                                fetchAvailabilities();
                              } else {
                                const data = await response.json();
                                toast({
                                  title: "Erro",
                                  description: data.error || "Não foi possível remover a disponibilidade.",
                                  variant: "destructive",
                                });
                              }
                            } catch (error) {
                              console.error("Erro ao remover disponibilidade:", error);
                              toast({
                                title: "Erro",
                                description: "Não foi possível remover a disponibilidade.",
                                variant: "destructive",
                              });
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
