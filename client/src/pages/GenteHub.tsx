import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Calendar, Clock, Users, Lightbulb, Handshake, TrendingUp } from "lucide-react";

export default function GenteHub() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    company: "",
    segment: "",
  });

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Event date - próximo evento (exemplo: 15 dias a partir de hoje)
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 15);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const createLeadMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      toast.success("Inscrição realizada com sucesso! Nos vemos no Gente HUB!");
      setFormData({ name: "", email: "", whatsapp: "", company: "", segment: "" });
    },
    onError: (error) => {
      toast.error("Erro ao enviar inscrição. Tente novamente.");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLeadMutation.mutate({
      ...formData,
      source: "gentehub",
    });
  };

  const scrollToForm = () => {
    document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <img src="https://pub-9fc7caa2a9e54e9cb220bd10c8da8f2f.r2.dev/images/logo_gente_retangulo.png" alt="Gente Networking" className="h-16" />
          <Button onClick={scrollToForm} size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white">
            Garantir Vaga
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E5A96] to-[#2B7BBF] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#FFA500] text-white px-4 py-2 rounded-full font-bold mb-4">
                13º GENTE HUB
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Networking de Negócios + Palestra Exclusiva <span className="text-[#FFC107]">TedX Style</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Participe do evento mensal que reúne empresários para rodadas de negócios estruturadas e uma palestra inspiradora de 18 minutos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={scrollToForm} size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white text-lg px-8">
                  Reservar Minha Vaga
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/gente-networking-pitch-publico.png" 
                alt="Gente HUB" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vagas Limitadas
            </h2>
            <p className="text-xl text-gray-300">
              Garanta seu lugar no próximo Gente HUB
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-[#1E5A96] rounded-lg p-6 text-center">
              <div className="text-5xl font-bold mb-2">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-gray-300 uppercase text-sm">Dias</div>
            </div>
            <div className="bg-[#1E5A96] rounded-lg p-6 text-center">
              <div className="text-5xl font-bold mb-2">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-gray-300 uppercase text-sm">Horas</div>
            </div>
            <div className="bg-[#1E5A96] rounded-lg p-6 text-center">
              <div className="text-5xl font-bold mb-2">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-gray-300 uppercase text-sm">Minutos</div>
            </div>
            <div className="bg-[#1E5A96] rounded-lg p-6 text-center">
              <div className="text-5xl font-bold mb-2">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-gray-300 uppercase text-sm">Segundos</div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button onClick={scrollToForm} size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white text-lg px-8">
              Garantir Vaga Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Palestra Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E5A96]">
                Palestra Exclusiva com Demétrios de Souza
              </h2>
              <p className="text-xl text-gray-600">
                Posicionamento PREMIUM: Três passos para existir, se destacar e ser desejado no mercado
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="/images/eduardo-mendonca.jpg" 
                  alt="Demétrios de Souza" 
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div>
                <div className="bg-[#FFA500] text-white px-4 py-2 rounded-lg inline-block mb-4 font-bold">
                  18 MINUTOS • ESTILO TEDX
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#1E5A96]">Sobre a Palestra</h3>
                <p className="text-gray-600 mb-6">
                  Descubra como posicionar seu negócio de forma estratégica no mercado, destacando-se da concorrência e tornando-se a escolha preferida dos seus clientes ideais.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#1E5A96] w-6 h-6 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                      1
                    </div>
                    <p className="text-gray-600">Como fazer sua empresa <strong>existir</strong> na mente do consumidor</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#1E5A96] w-6 h-6 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                      2
                    </div>
                    <p className="text-gray-600">Estratégias para <strong>se destacar</strong> em mercados competitivos</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#1E5A96] w-6 h-6 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                      3
                    </div>
                    <p className="text-gray-600">Como ser <strong>desejado</strong> e criar demanda pelo seu produto/serviço</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E5A96]">
              Agenda do Evento
            </h2>
            <p className="text-xl text-gray-600">
              Uma manhã completa de networking e aprendizado
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-l-4 border-l-[#1E5A96]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1E5A96] text-white px-4 py-2 rounded-lg font-bold min-w-[100px] text-center">
                    07:30
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#1E5A96]">Credenciamento e Welcome Coffee</h3>
                    <p className="text-gray-600">
                      Recepção dos participantes com café e networking informal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#FFA500]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#FFA500] text-white px-4 py-2 rounded-lg font-bold min-w-[100px] text-center">
                    08:00
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#1E5A96]">1ª Rodada de Negócios</h3>
                    <p className="text-gray-600">
                      Apresentações rápidas de 60 segundos para cada participante compartilhar seu negócio e oportunidades
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#FFC107]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#FFC107] text-white px-4 py-2 rounded-lg font-bold min-w-[100px] text-center">
                    08:30
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#1E5A96]">Palestra TedX Style</h3>
                    <p className="text-gray-600">
                      18 minutos de conteúdo premium com Demétrios de Souza sobre Posicionamento Estratégico
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#1E5A96]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#1E5A96] text-white px-4 py-2 rounded-lg font-bold min-w-[100px] text-center">
                    09:00
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#1E5A96]">2ª Rodada de Negócios</h3>
                    <p className="text-gray-600">
                      Networking direcionado com troca de contatos e agendamento de reuniões 1 a 1
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* O que você vai ter Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E5A96]">
              Networking É Aprendizado
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No Gente HUB você terá acesso a conteúdo de alta qualidade e oportunidades reais de negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-t-4 border-t-[#1E5A96] hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="bg-[#1E5A96] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1E5A96]">Aprendizado</h3>
                <p className="text-gray-600">
                  Conteúdo estratégico com especialistas que vão impulsionar seu negócio para o próximo nível
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#FFA500] hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="bg-[#FFA500] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1E5A96]">Rodadas de Negócios</h3>
                <p className="text-gray-600">
                  Duas rodadas estruturadas para você conhecer empresários e gerar oportunidades concretas
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#FFC107] hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="bg-[#FFC107] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1E5A96]">Conexões</h3>
                <p className="text-gray-600">
                  Amplie sua rede com empresários de diversos segmentos em um ambiente colaborativo
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testemunhos Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E5A96]">
              Quem Participou, Recomenda
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "O Gente HUB é uma experiência diferenciada. A palestra foi excelente e as rodadas de negócios geraram várias oportunidades concretas para minha empresa."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1E5A96] rounded-full flex items-center justify-center text-white font-bold">
                    AL
                  </div>
                  <div>
                    <p className="font-bold text-[#1E5A96]">Aline Lorscheitter</p>
                    <p className="text-sm text-gray-500">Diretora Virtua Gestão Comercial</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "Participar do Gente HUB foi transformador. Conheci empresários que se tornaram parceiros estratégicos do meu negócio."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center text-white font-bold">
                    AM
                  </div>
                  <div>
                    <p className="font-bold text-[#1E5A96]">André Mendes</p>
                    <p className="text-sm text-gray-500">Ademicon Consórcios e Investimentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "A combinação de conteúdo de qualidade com networking estruturado faz do Gente HUB um evento único no mercado."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FFC107] rounded-full flex items-center justify-center text-white font-bold">
                    JM
                  </div>
                  <div>
                    <p className="font-bold text-[#1E5A96]">José Carlos Maciel</p>
                    <p className="text-sm text-gray-500">Zacelis Telhas de Aluzinco</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="form-section" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E5A96]">
                Garanta Seu Lugar!
              </h2>
              <p className="text-xl text-gray-600">
                Preencha o formulário abaixo para participar do próximo Gente HUB
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">WhatsApp *</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      required
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Empresa *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      placeholder="Nome da sua empresa"
                    />
                  </div>

                  <div>
                    <Label htmlFor="segment">Segmento de Negócio *</Label>
                    <Input
                      id="segment"
                      value={formData.segment}
                      onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                      required
                      placeholder="Ex: Consultoria, Tecnologia, Saúde..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-[#FFA500] hover:bg-[#FF8C00] text-white text-lg"
                    disabled={createLeadMutation.isPending}
                  >
                    {createLeadMutation.isPending ? "Enviando..." : "Garantir Minha Vaga"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E5A96]">
                Perguntas Frequentes
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white px-6 rounded-lg">
                <AccordionTrigger className="text-left font-semibold">
                  O que é o Gente HUB?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  O Gente HUB é um evento mensal que combina networking estruturado com conteúdo de alta qualidade. Realizamos duas rodadas de negócios e uma palestra estilo TedX de 18 minutos com temas relevantes para empresários.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white px-6 rounded-lg">
                <AccordionTrigger className="text-left font-semibold">
                  Qual o formato das rodadas de negócios?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Na primeira rodada, cada participante tem 60 segundos para apresentar seu negócio. Na segunda rodada, após a palestra, há networking direcionado para troca de contatos e agendamento de reuniões 1 a 1.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white px-6 rounded-lg">
                <AccordionTrigger className="text-left font-semibold">
                  Há custo para participar?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  O Gente HUB é um evento gratuito para membros do Gente Networking. Para não-membros, há um investimento acessível que será informado após o preenchimento do formulário.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white px-6 rounded-lg">
                <AccordionTrigger className="text-left font-semibold">
                  Onde e quando acontece?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  O Gente HUB acontece mensalmente, das 7h30 às 9h30. O local e formato (presencial ou online) são informados com antecedência aos inscritos.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-[#1E5A96] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Venha Participar do Gente HUB e Faça Conexões de Valor para Seu Negócio!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Não perca a oportunidade de participar do evento de networking mais completo da região
          </p>
          <Button onClick={scrollToForm} size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white text-lg px-8">
            Garantir Vaga Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <img src="https://pub-9fc7caa2a9e54e9cb220bd10c8da8f2f.r2.dev/images/logo-gente-networking-branco.png" alt="Gente Networking" className="h-16 mx-auto mb-4" />
          <p className="text-gray-400">© 2026 GeNtE - Grupo de Networking Empresarial. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
