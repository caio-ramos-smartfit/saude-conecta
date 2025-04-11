"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"
import { useAuth } from "@/app/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface Provider {
  id: string;
  organization_name: string;
  specialty: string;
}

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export default function BookAppointmentPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [service, setService] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('/api/providers')
        if (response.ok) {
          const data = await response.json()
          setProviders(data)
        }
      } catch (error) {
        console.error('Error fetching providers:', error)
      }
    }
    
    fetchProviders()
  }, [])
  
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedProvider || !selectedDate) return
      
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd')
        const response = await fetch(`/api/providers/${selectedProvider}/availability?date=${formattedDate}`)
        
        if (response.ok) {
          const data = await response.json()
          setAvailableTimeSlots(data)
        }
      } catch (error) {
        console.error('Error fetching availability:', error)
      }
    }
    
    fetchAvailability()
  }, [selectedProvider, selectedDate])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Não autenticado",
        description: "Você precisa estar logado para agendar uma consulta.",
        variant: "destructive",
      })
      router.push('/login')
      return
    }
    
    if (!selectedProvider || !selectedDate || !selectedTimeSlot || !service) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const appointmentData = {
        provider_id: selectedProvider,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTimeSlot,
        service,
        notes,
      }
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      })
      
      if (response.ok) {
        toast({
          title: "Consulta agendada com sucesso",
          description: "Sua consulta foi agendada. Você pode visualizá-la no seu painel.",
          variant: "default",
        })
        router.push('/patient/dashboard')
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Falha ao agendar consulta')
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast({
        title: "Erro ao agendar consulta",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao agendar sua consulta. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Agendar Consulta</h1>
        <p className="text-muted-foreground">Preencha os dados abaixo para agendar sua consulta</p>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalhes da Consulta</CardTitle>
          <CardDescription>Escolha o profissional, data e horário para sua consulta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="provider">Profissional</Label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
                disabled={isLoading}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Selecione um profissional" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.organization_name} - {provider.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Select
                value={selectedTimeSlot}
                onValueChange={setSelectedTimeSlot}
                disabled={!selectedDate || !selectedProvider || isLoading}
              >
                <SelectTrigger id="time">
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {slot.start_time}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Nenhum horário disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service">Tipo de Atendimento</Label>
              <Select
                value={service}
                onValueChange={setService}
                disabled={isLoading}
              >
                <SelectTrigger id="service">
                  <SelectValue placeholder="Selecione o tipo de atendimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general_checkup">Consulta Geral</SelectItem>
                  <SelectItem value="vaccination">Vacinação</SelectItem>
                  <SelectItem value="blood_test">Exame de Sangue</SelectItem>
                  <SelectItem value="dental">Atendimento Odontológico</SelectItem>
                  <SelectItem value="mental_health">Saúde Mental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Input
                id="notes"
                placeholder="Informe detalhes adicionais sobre sua consulta"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Agendando..." : "Agendar Consulta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Voltar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
