import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Users, FileText, Calendar, MessageSquare, HelpCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Queries
  const { data: leads, isLoading: leadsLoading } = trpc.leads.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: upcomingEvents, isLoading: eventsLoading } = trpc.events.upcoming.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: testimonials, isLoading: testimonialsLoading } = trpc.testimonials.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: faqs, isLoading: faqsLoading } = trpc.faqs.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E5A96]" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Você precisa estar autenticado para acessar o dashboard administrativo.
            </p>
            <Button 
              onClick={() => window.location.href = '/api/auth/google/login'} 
              className="bg-[#1E5A96] hover:bg-[#1E5A96]/90"
            >
              Entrar com Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Você não tem permissão para acessar esta página.
            </p>
            <Button onClick={() => setLocation("/")} variant="outline">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get stats
  const totalLeads = leads?.length || 0;
  const newLeads = leads?.filter(l => l.status === "new").length || 0;
  const participeLead = leads?.filter(l => l.source === "participe").length || 0;
  const gentehubLeads = leads?.filter(l => l.source === "gentehub").length || 0;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "default",
      contacted: "secondary",
      converted: "outline",
      archived: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getSourceBadge = (source: string) => {
    return (
      <Badge variant={source === "participe" ? "default" : "secondary"}>
        {source === "participe" ? "Participe" : "Gente HUB"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="https://pub-9fc7caa2a9e54e9cb220bd10c8da8f2f.r2.dev/images/logo_gente_retangulo.png" alt="Gente Networking" className="h-24" />
              <h1 className="text-2xl font-bold text-[#1E5A96]">Dashboard Administrativo</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Olá, {user?.name}</span>
              <Button onClick={() => setLocation("/")} variant="outline" size="sm">
                Ver Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Leads</p>
                  <p className="text-3xl font-bold text-[#1E5A96]">{totalLeads}</p>
                </div>
                <Users className="w-10 h-10 text-[#1E5A96] opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Novos Leads</p>
                  <p className="text-3xl font-bold text-[#FFA500]">{newLeads}</p>
                </div>
                <Users className="w-10 h-10 text-[#FFA500] opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Participe</p>
                  <p className="text-3xl font-bold text-[#1E5A96]">{participeLead}</p>
                </div>
                <FileText className="w-10 h-10 text-[#1E5A96] opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gente HUB</p>
                  <p className="text-3xl font-bold text-[#FFC107]">{gentehubLeads}</p>
                </div>
                <Calendar className="w-10 h-10 text-[#FFC107] opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="leads">
              <Users className="w-4 h-4 mr-2" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="w-4 h-4 mr-2" />
              Eventos
            </TabsTrigger>
            <TabsTrigger value="testimonials">
              <MessageSquare className="w-4 h-4 mr-2" />
              Depoimentos
            </TabsTrigger>
            <TabsTrigger value="faqs">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="w-4 h-4 mr-2" />
              Conteúdo
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Leads Capturados</CardTitle>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1E5A96]" />
                  </div>
                ) : leads && leads.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Segmento</TableHead>
                        <TableHead>Origem</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>{lead.whatsapp}</TableCell>
                          <TableCell>{lead.company}</TableCell>
                          <TableCell>{lead.segment}</TableCell>
                          <TableCell>{getSourceBadge(lead.source)}</TableCell>
                          <TableCell>{getStatusBadge(lead.status)}</TableCell>
                          <TableCell>{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum lead capturado ainda.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Próximos Eventos</CardTitle>
                  <Button size="sm" className="bg-[#1E5A96]">
                    <Calendar className="w-4 h-4 mr-2" />
                    Novo Evento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1E5A96]" />
                  </div>
                ) : upcomingEvents && upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <Card key={event.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-bold text-[#1E5A96] mb-2">{event.title}</h3>
                              <p className="text-gray-600 mb-4">{event.description}</p>
                              <div className="flex gap-4 text-sm text-gray-500">
                                <span>📅 {new Date(event.eventDate).toLocaleDateString('pt-BR')}</span>
                                <span>🕐 {event.startTime} - {event.endTime}</span>
                                {event.location && <span>📍 {event.location}</span>}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Editar</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum evento cadastrado.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Depoimentos</CardTitle>
                  <Button size="sm" className="bg-[#1E5A96]">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Novo Depoimento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {testimonialsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1E5A96]" />
                  </div>
                ) : testimonials && testimonials.length > 0 ? (
                  <div className="space-y-4">
                    {testimonials.map((testimonial) => (
                      <Card key={testimonial.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-[#1E5A96] rounded-full flex items-center justify-center text-white font-bold">
                                  {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                  <p className="font-bold text-[#1E5A96]">{testimonial.name}</p>
                                  <p className="text-sm text-gray-500">{testimonial.role} - {testimonial.company}</p>
                                </div>
                              </div>
                              <p className="text-gray-600 italic">"{testimonial.content}"</p>
                              <div className="mt-2">
                                <Badge variant="outline">{testimonial.page}</Badge>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Editar</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum depoimento cadastrado.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Perguntas Frequentes</CardTitle>
                  <Button size="sm" className="bg-[#1E5A96]">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Nova FAQ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {faqsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1E5A96]" />
                  </div>
                ) : faqs && faqs.length > 0 ? (
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <Card key={faq.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-bold text-[#1E5A96] mb-2">{faq.question}</h4>
                              <p className="text-gray-600">{faq.answer}</p>
                              <div className="mt-2">
                                <Badge variant="outline">{faq.page}</Badge>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Editar</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma FAQ cadastrada.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Edição de Conteúdo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Editor de conteúdo em desenvolvimento.</p>
                  <p className="text-sm mt-2">Em breve você poderá editar todos os textos das landing pages por aqui.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
