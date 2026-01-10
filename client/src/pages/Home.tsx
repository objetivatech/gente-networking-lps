

/**
 * All content in this page are only for example, replace with your own feature implementation
 * When building pages, remember your instructions in Frontend Workflow, Frontend Best Practices, Design Guide and Common Pitfalls
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1E5A96] to-[#2B7BBF]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <img src="/images/logo-gente-networking.png" alt="Gente Networking" className="h-12 brightness-0 invert" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              GeNtE Networking
            </h1>
            <p className="text-2xl text-blue-100 mb-4">
              Grupo de Networking Empresarial
            </p>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Conectando empresários e profissionais para gerar negócios através de relacionamentos estratégicos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card Participe */}
            <a href="/participe" className="block group">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="relative h-64">
                  <img 
                    src="/images/gente-networking-reuniao-online-zoom.png" 
                    alt="Participe de uma Reunião Gratuita" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Participe</h2>
                    <p className="text-white/90">Reunião Gratuita</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Conheça o GeNtE participando de uma reunião quinzenal gratuita. Experimente nossas dinâmicas e veja como o networking estruturado pode transformar seu negócio.
                  </p>
                  <div className="flex items-center text-[#FFA500] font-semibold group-hover:gap-3 transition-all">
                    <span>Quero Participar</span>
                    <span className="ml-2 group-hover:ml-0 transition-all">→</span>
                  </div>
                </div>
              </div>
            </a>

            {/* Card Gente HUB */}
            <a href="/gentehub" className="block group">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                <div className="relative h-64">
                  <img 
                    src="/images/gente-networking-pitch-publico.png" 
                    alt="Gente HUB - Evento Mensal" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Gente HUB</h2>
                    <p className="text-white/90">Evento Mensal</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Participe do evento mensal que combina networking estruturado com uma palestra exclusiva estilo TedX. Duas rodadas de negócios e muito aprendizado.
                  </p>
                  <div className="flex items-center text-[#FFA500] font-semibold group-hover:gap-3 transition-all">
                    <span>Garantir Vaga</span>
                    <span className="ml-2 group-hover:ml-0 transition-all">→</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-blue-100">© 2026 GeNtE - Grupo de Networking Empresarial. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
