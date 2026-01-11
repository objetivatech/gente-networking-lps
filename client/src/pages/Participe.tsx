import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle2, Users, Handshake, TrendingUp, Target } from "lucide-react";

export default function Participe() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    company: "",
    segment: "",
  });

  const createLeadMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      toast.success("Inscrição realizada com sucesso! Entraremos em contato em breve.");
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
      source: "participe",
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
          <img src="https://pub-9fc7caa2a9e54e9cb220bd10c8da8f2f.r2.dev/images/logo_gente_retangulo.png" alt="Gente Networking" className="h-24" />
          <Button onClick={scrollToForm} size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white">
            Quero Participar!
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E5A96] to-[#2B7BBF] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Participe de uma Reunião <span className="text-[#FFC107]">Gratuita</span> e Descubra o Poder do Networking Estruturado
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Conheça empresários e profissionais que estão expandindo seus negócios através de conexões estratégicas e indicações qualificadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={scrollToForm} size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white text-lg px-8">
                  Participar Gratuitamente
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/images/gente-networking-reuniao-online-zoom.png" 
                alt="Reunião Online Gente Networking" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E5A96]">
              Como Vamos Ajudar Seu Negócio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No GeNtE, oferecemos um programa estruturado de networking que gera resultados reais para sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-t-4 border-t-[#1E5A96] hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="bg-[#1E5A96] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1E5A96]">Contatos</h3>
                <p className="text-gray-600">
                  Amplie sua rede de contatos em diferentes segmentos, abrindo possibilidades para desenvolver relacionamentos e parcerias estratégicas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#FFA500] hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="bg-[#FFA500] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1E5A96]">Relacionamentos</h3>
                <p className="text-gray-600">
                  Relacione-se em ambiente colaborativo, compartilhando informações e oportunidades de negócios com pessoas de confiança.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#FFC107] hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="bg-[#FFC107] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1E5A96]">Parcerias</h3>
                <p className="text-gray-600">
                  Forme parcerias com empresas não concorrentes, com o mesmo perfil de cliente, para desenvolver estratégias conjuntas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#1E5A96] hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="bg-[#1E5A96] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1E5A96]">Resultado</h3>
                <p className="text-gray-600">
                  Impulsione o faturamento do seu negócio recebendo indicações frequentes de novos clientes prontos para comprar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dinâmicas Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E5A96]">
              Nossas Dinâmicas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No GeNtE ajudamos seu negócio se tornar conhecido, formar parcerias, receber indicações e se desenvolver
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img 
                    src="/images/gente-networking-pitch-1-minuto.png" 
                    alt="Apresentação de 1 Minuto" 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#1E5A96]">Apresentação de 1 Minuto</h3>
                    <p className="text-gray-600">
                      Aprenda e desenvolva uma técnica de apresentação rápida do seu negócio. Cause impacto e interesse dos demais membros.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img 
                    src="/images/gente-networking-negocio-em-foco.png" 
                    alt="Negócio em Foco" 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#1E5A96]">Negócio em Foco</h3>
                    <p className="text-gray-600">
                      20 minutos para apresentar sua empresa com detalhes, educando os membros sobre seus produtos e serviços.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img 
                    src="/images/gente-networking-conselho-administracao.png" 
                    alt="Conselho de Administração" 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#1E5A96]">Conselho de Administração</h3>
                    <p className="text-gray-600">
                      Compartilhe desafios da sua empresa e conte com aconselhamento de pessoas experientes e bem-sucedidas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img 
                    src="/images/gente-networking-reuniao-1-a-1.png" 
                    alt="GeNtE em Ação" 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#1E5A96]">GeNtE em Ação</h3>
                    <p className="text-gray-600">
                      Reuniões 1 a 1 para aprofundar conhecimento dos negócios e encontrar maneiras de colaborar e crescer juntos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E5A96]">
              O Que Nossos Membros Dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "Sabendo que o conhecimento só perpetua quando é compartilhado, participar deste grupo nos faz perceber o quanto podemos crescer com o GeNtE."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1E5A96] rounded-full flex items-center justify-center text-white font-bold">
                    JS
                  </div>
                  <div>
                    <p className="font-bold text-[#1E5A96]">Jairo de Souza</p>
                    <p className="text-sm text-gray-500">Diretor Alquimis Química Industrial</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "Participar do GeNtE tem trazido muitos insights para os negócios e um networking fantástico. Uma experiência muito agregadora!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FFA500] rounded-full flex items-center justify-center text-white font-bold">
                    DD
                  </div>
                  <div>
                    <p className="font-bold text-[#1E5A96]">Deise Dornelles</p>
                    <p className="text-sm text-gray-500">Allure Experiences</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 italic">
                  "O GeNtE é um grupo de RESULTADO EFETIVO. Tem propósitos bem definidos e metodologias inteligentes que agregam valor ao Grupo."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FFC107] rounded-full flex items-center justify-center text-white font-bold">
                    LM
                  </div>
                  <div>
                    <p className="font-bold text-[#1E5A96]">Lusi Milhão</p>
                    <p className="text-sm text-gray-500">KL Pessoas e Negócios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Urgência Section */}
      <section className="py-16 bg-[#FFA500]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Vagas Limitadas para Visitantes
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Garantimos qualidade nas reuniões limitando o número de visitantes. Não perca a oportunidade de conhecer o GeNtE!
          </p>
          <Button onClick={scrollToForm} size="lg" className="bg-white text-[#FFA500] hover:bg-gray-100 text-lg px-8">
            Garantir Minha Vaga Gratuita
          </Button>
        </div>
      </section>

      {/* Form Section */}
      <section id="form-section" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1E5A96]">
                Participe e Gere Negócios!
              </h2>
              <p className="text-xl text-gray-600">
                Preencha o formulário abaixo e participe de uma de nossas reuniões quinzenais gratuitamente
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
                    {createLeadMutation.isPending ? "Enviando..." : "Quero Participar!"}
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
                  Como funcionam as reuniões do GeNtE?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  As reuniões são quinzenais, realizadas online via Zoom, das 7h30 às 9h da manhã. Durante os encontros, realizamos dinâmicas estruturadas de networking, apresentações de negócios e troca de indicações.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white px-6 rounded-lg">
                <AccordionTrigger className="text-left font-semibold">
                  A participação como visitante é realmente gratuita?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Sim! Você pode participar de uma reunião gratuitamente para conhecer nossa metodologia, os membros e as dinâmicas. Não há nenhum custo ou compromisso.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white px-6 rounded-lg">
                <AccordionTrigger className="text-left font-semibold">
                  Qual o investimento para se tornar membro?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Após participar como visitante, você receberá informações detalhadas sobre o investimento e os planos de adesão. O período mínimo é de 3 meses com valores acessíveis para o seu negócio.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white px-6 rounded-lg">
                <AccordionTrigger className="text-left font-semibold">
                  Quem pode participar do GeNtE?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Empresários e profissionais de mercado que buscam ampliar sua base de clientes e impulsionar suas vendas através de networking estruturado e indicações qualificadas.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Fundador Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#FFA500] font-semibold mb-2">Desde 2019 Facilitando Conexões</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1E5A96]">
                O Facilitador do Processo
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="/images/eduardo-mendonca.jpg" 
                  alt="Eduardo Mendonça" 
                  className="rounded-lg shadow-xl"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-[#1E5A96]">Eduardo Mendonça</h3>
                <p className="text-gray-600 mb-6">
                  Com 20 anos de experiência executiva na Coca-Cola, atua desde 2013 como Mentor Empresarial e desde 2019 facilita o GeNtE Grupo de Networking Empresarial.
                </p>
                <div className="bg-[#1E5A96] p-6 rounded-lg text-white">
                  <p className="italic">
                    "O networking de negócios é uma atividade com alto retorno de investimento se feito da forma correta. No GeNtE procuramos estimular a construção de relacionamentos e formação de parcerias estratégicas. As indicações de negócios são uma consequência natural."
                  </p>
                  <p className="mt-4 font-semibold">- Eduardo Mendonça</p>
                  <p className="text-sm text-blue-200">Mentor Empresarial e Criador do GeNtE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-[#1E5A96] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Expandir Seus Negócios?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Participe de uma reunião gratuita e descubra como o networking estruturado pode transformar seus resultados
          </p>
          <Button onClick={scrollToForm} size="lg" className="bg-[#FFA500] hover:bg-[#FF8C00] text-white text-lg px-8">
            Participar Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <img src="https://pub-9fc7caa2a9e54e9cb220bd10c8da8f2f.r2.dev/images/logo-gente-networking-branco.png" alt="Gente Networking" className="h-24 mx-auto mb-4" />
          <p className="text-gray-400">© 2026 GeNtE - Grupo de Networking Empresarial. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
