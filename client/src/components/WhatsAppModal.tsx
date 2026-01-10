import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle } from "lucide-react";

interface WhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  whatsappGroupLink: string;
  leadName: string;
}

export function WhatsAppModal({ open, onOpenChange, whatsappGroupLink, leadName }: WhatsAppModalProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (open && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (open && countdown === 0 && whatsappGroupLink) {
      // Redirecionar automaticamente após 5 segundos
      window.open(whatsappGroupLink, "_blank");
    }
  }, [open, countdown, whatsappGroupLink]);

  const handleJoinGroup = () => {
    if (whatsappGroupLink) {
      window.open(whatsappGroupLink, "_blank");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Inscrição Confirmada, {leadName.split(' ')[0]}! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Sua vaga está garantida no Gente HUB!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-6 h-6 text-[#1E5A96] mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-[#1E5A96] mb-2">
                  Junte-se ao Grupo do WhatsApp
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Criamos um grupo exclusivo para os participantes do evento. Lá você poderá:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• Receber lembretes e atualizações do evento</li>
                  <li>• Conhecer outros participantes antecipadamente</li>
                  <li>• Tirar dúvidas sobre o evento</li>
                  <li>• Receber o link da reunião online</li>
                </ul>
              </div>
            </div>
          </div>

          {whatsappGroupLink ? (
            <>
              <Button 
                onClick={handleJoinGroup}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white h-12 text-base"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Entrar no Grupo do WhatsApp
              </Button>

              <p className="text-center text-sm text-gray-500">
                Redirecionando automaticamente em {countdown} segundos...
              </p>
            </>
          ) : (
            <div className="text-center text-sm text-gray-500 py-4">
              O link do grupo será enviado por email em breve.
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-gray-600 text-center">
              <strong>Importante:</strong> Você também receberá um email de confirmação com todos os detalhes do evento.
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="text-sm"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
