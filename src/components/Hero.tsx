import { Eye, FileCheck, TrendingUp } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden text-white py-16 w-full" style={{ background: 'linear-gradient(135deg, #0A1F44 0%, #8B0000 100%)' }}>
      <div className="container mx-auto px-4 relative z-10 max-w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-white mb-4">Portal de Transparência e Monitoramento</h2>
          <p className="text-white/90">
            Bem-vindo ao portal da Controladoria Interna do CBMPA. Aqui você encontra vídeos educativos sobre transparência pública, dicas de monitoramento e boas práticas na gestão de recursos.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <Eye className="w-12 h-12 mx-auto mb-3 text-[#C9A227]" />
            <h3 className="text-white mb-2">Transparência</h3>
            <p className="text-white/80 text-sm">Conteúdos sobre prestação de contas e acesso à informação</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <FileCheck className="w-12 h-12 mx-auto mb-3 text-[#C9A227]" />
            <h3 className="text-white mb-2">Monitoramento</h3>
            <p className="text-white/80 text-sm">Dicas práticas de acompanhamento e fiscalização</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-[#C9A227]" />
            <h3 className="text-white mb-2">Capacitação</h3>
            <p className="text-white/80 text-sm">Material educativo para membros da controladoria</p>
          </div>
        </div>
      </div>
    </section>
  );
}
