import nodemailer from "nodemailer";

// Email configuration
const EMAIL_CONFIG = {
  from: "Gente Networking <gentenetworking@gmail.com>",
  to: "gentenetworking@gmail.com",
};

// Create transporter (will be configured with Gmail SMTP)
// Note: In production, use environment variables for credentials
let transporter: nodemailer.Transporter | null = null;

export function initializeEmailService(config?: {
  user?: string;
  pass?: string;
}) {
  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config?.user || process.env.GMAIL_USER || "gentenetworking@gmail.com",
        pass: config?.pass || process.env.GMAIL_APP_PASSWORD || "",
      },
    });
    console.log("[Email Service] Initialized successfully");
  } catch (error) {
    console.error("[Email Service] Failed to initialize:", error);
  }
}

// Initialize on module load
initializeEmailService();

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  cc?: string;
  bcc?: string;
}

export async function sendEmail({ to, subject, html, cc, bcc }: SendEmailParams) {
  if (!transporter) {
    throw new Error("Email service not initialized");
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_CONFIG.from,
      to,
      cc,
      bcc,
      subject,
      html,
    });

    console.log("[Email Service] Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Email Service] Failed to send email:", error);
    throw error;
  }
}

// Email Templates

export function getEmailTemplate(content: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gente Networking</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #1E5A96 0%, #2B7BBF 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      max-width: 200px;
      height: auto;
    }
    .content {
      padding: 40px 30px;
      color: #333333;
      line-height: 1.6;
    }
    .content h1 {
      color: #1E5A96;
      font-size: 24px;
      margin-bottom: 20px;
    }
    .content h2 {
      color: #1E5A96;
      font-size: 20px;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    .content p {
      margin-bottom: 15px;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      padding: 15px 40px;
      background-color: #FFA500;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .info-box {
      background-color: #f8f9fa;
      border-left: 4px solid #1E5A96;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      background-color: #1E5A96;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #FFA500;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://gentenetworking.com.br/images/logo-gente-networking.png" alt="Gente Networking" class="logo" style="filter: brightness(0) invert(1);">
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>GeNtE - Grupo de Networking Empresarial</strong></p>
      <p>Conectando empresários e profissionais para gerar negócios através de relacionamentos estratégicos</p>
      <div class="divider" style="background-color: rgba(255,255,255,0.2);"></div>
      <p>
        <a href="https://gentenetworking.com.br">gentenetworking.com.br</a><br>
        gentenetworking@gmail.com
      </p>
      <p style="font-size: 12px; margin-top: 20px; opacity: 0.8;">
        © 2026 Gente Networking. Todos os direitos reservados.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Template: New Lead Notification (to owner)
export function getNewLeadNotificationEmail(lead: {
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  segment: string;
  source: string;
}) {
  const content = `
    <h1>🎉 Novo Lead Capturado!</h1>
    <p>Um novo lead se inscreveu através da landing page <strong>${lead.source === "participe" ? "Participe" : "Gente HUB"}</strong>.</p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>Nome:</strong> ${lead.name}</p>
      <p style="margin: 10px 0 0 0;"><strong>Email:</strong> ${lead.email}</p>
      <p style="margin: 10px 0 0 0;"><strong>WhatsApp:</strong> ${lead.whatsapp}</p>
      <p style="margin: 10px 0 0 0;"><strong>Empresa:</strong> ${lead.company}</p>
      <p style="margin: 10px 0 0 0;"><strong>Segmento:</strong> ${lead.segment}</p>
    </div>

    <p>Entre em contato o quanto antes para converter este lead!</p>
  `;

  return getEmailTemplate(content);
}

// Template: Confirmation Email (to lead - Participe)
export function getParticipeConfirmationEmail(lead: {
  name: string;
}) {
  const firstName = lead.name.split(" ")[0];
  const content = `
    <h1>Bem-vindo ao GeNtE, ${firstName}! 🎉</h1>
    <p>Ficamos muito felizes com sua inscrição para participar de uma reunião gratuita do Gente Networking!</p>
    
    <h2>O que acontece agora?</h2>
    <p>Nossa equipe entrará em contato com você em breve para:</p>
    <ul>
      <li>Confirmar sua participação</li>
      <li>Enviar o link da reunião online</li>
      <li>Tirar qualquer dúvida que você tenha</li>
      <li>Explicar como funciona nossa metodologia</li>
    </ul>

    <div class="info-box">
      <p style="margin: 0;"><strong>💡 Dica:</strong> Prepare um pitch de 1 minuto sobre seu negócio para apresentar na reunião!</p>
    </div>

    <h2>Sobre o GeNtE</h2>
    <p>O GeNtE é um grupo de networking estruturado que se reúne quinzenalmente online. Nossa missão é conectar empresários e profissionais para gerar negócios através de relacionamentos estratégicos genuínos.</p>

    <p>Estamos ansiosos para conhecê-lo!</p>
    <p><strong>Equipe Gente Networking</strong></p>
  `;

  return getEmailTemplate(content);
}

// Template: Confirmation Email (to lead - Gente HUB)
export function getGenteHubConfirmationEmail(lead: {
  name: string;
  eventDate: string;
  eventTime: string;
  whatsappGroupLink?: string;
}) {
  const firstName = lead.name.split(" ")[0];
  const content = `
    <h1>Sua vaga está garantida, ${firstName}! 🎉</h1>
    <p>Confirmamos sua inscrição no <strong>Gente HUB</strong>, nosso evento mensal de networking!</p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>📅 Data:</strong> ${lead.eventDate}</p>
      <p style="margin: 10px 0 0 0;"><strong>🕐 Horário:</strong> ${lead.eventTime}</p>
      <p style="margin: 10px 0 0 0;"><strong>📍 Local:</strong> Online via Zoom</p>
    </div>

    <h2>O que você vai ter no Gente HUB?</h2>
    <ul>
      <li><strong>Palestra TedX Style (18min)</strong> - Conteúdo relevante para seu negócio</li>
      <li><strong>2 Rodadas de Negócios</strong> - Networking estruturado e eficiente</li>
      <li><strong>Conexões Estratégicas</strong> - Conheça empresários e profissionais da sua região</li>
      <li><strong>Oportunidades Reais</strong> - Gere negócios através de relacionamentos</li>
    </ul>

    ${
      lead.whatsappGroupLink
        ? `
    <h2>📱 Grupo do WhatsApp</h2>
    <p>Criamos um grupo exclusivo para os participantes do evento. Entre agora e comece a se conectar!</p>
    <a href="${lead.whatsappGroupLink}" class="button">Entrar no Grupo do WhatsApp</a>
    `
        : ""
    }

    <h2>Importante</h2>
    <p>Você receberá lembretes antes do evento com o link de acesso à reunião online.</p>

    <p>Nos vemos em breve!</p>
    <p><strong>Equipe Gente Networking</strong></p>
  `;

  return getEmailTemplate(content);
}

// Template: Reminder Email (5 days before)
export function getReminder5DaysEmail(lead: {
  name: string;
  eventDate: string;
  eventTime: string;
}) {
  const firstName = lead.name.split(" ")[0];
  const content = `
    <h1>Faltam 5 dias para o Gente HUB, ${firstName}! 📅</h1>
    <p>Estamos nos aproximando do nosso evento mensal de networking!</p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>📅 Data:</strong> ${lead.eventDate}</p>
      <p style="margin: 10px 0 0 0;"><strong>🕐 Horário:</strong> ${lead.eventTime}</p>
      <p style="margin: 10px 0 0 0;"><strong>📍 Local:</strong> Online via Zoom</p>
    </div>

    <h2>Prepare-se para o evento!</h2>
    <ul>
      <li>Tenha seu pitch de 1 minuto preparado</li>
      <li>Pense em quais conexões você busca</li>
      <li>Separe cartões de visita digitais</li>
      <li>Reserve o horário na sua agenda</li>
    </ul>

    <p>O link de acesso será enviado mais próximo ao evento.</p>
    <p>Até lá!</p>
    <p><strong>Equipe Gente Networking</strong></p>
  `;

  return getEmailTemplate(content);
}

// Template: Reminder Email (2 days before)
export function getReminder2DaysEmail(lead: {
  name: string;
  eventDate: string;
  eventTime: string;
}) {
  const firstName = lead.name.split(" ")[0];
  const content = `
    <h1>Faltam apenas 2 dias, ${firstName}! ⏰</h1>
    <p>O Gente HUB está chegando e estamos ansiosos para vê-lo!</p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>📅 Data:</strong> ${lead.eventDate}</p>
      <p style="margin: 10px 0 0 0;"><strong>🕐 Horário:</strong> ${lead.eventTime}</p>
      <p style="margin: 10px 0 0 0;"><strong>📍 Local:</strong> Online via Zoom</p>
    </div>

    <h2>Últimos preparativos:</h2>
    <ul>
      <li>✅ Teste sua câmera e microfone</li>
      <li>✅ Tenha seu pitch pronto</li>
      <li>✅ Prepare perguntas para fazer aos outros participantes</li>
      <li>✅ Esteja em um ambiente tranquilo</li>
    </ul>

    <p><strong>Importante:</strong> O link de acesso será enviado 2 horas antes do evento.</p>
    <p>Nos vemos em breve!</p>
    <p><strong>Equipe Gente Networking</strong></p>
  `;

  return getEmailTemplate(content);
}

// Template: Reminder Email (2 hours before with Zoom link)
export function getReminder2HoursEmail(lead: {
  name: string;
  eventDate: string;
  eventTime: string;
  zoomLink: string;
}) {
  const firstName = lead.name.split(" ")[0];
  const content = `
    <h1>É hoje, ${firstName}! 🚀</h1>
    <p>O Gente HUB começa em 2 horas! Aqui está seu link de acesso:</p>
    
    <div class="info-box">
      <p style="margin: 0;"><strong>📅 Data:</strong> ${lead.eventDate}</p>
      <p style="margin: 10px 0 0 0;"><strong>🕐 Horário:</strong> ${lead.eventTime}</p>
      <p style="margin: 10px 0 0 0;"><strong>📍 Link:</strong> <a href="${lead.zoomLink}" style="color: #1E5A96;">${lead.zoomLink}</a></p>
    </div>

    <a href="${lead.zoomLink}" class="button">Entrar na Reunião</a>

    <h2>Checklist final:</h2>
    <ul>
      <li>✅ Câmera e microfone funcionando</li>
      <li>✅ Ambiente tranquilo</li>
      <li>✅ Pitch de 1 minuto pronto</li>
      <li>✅ Cartões de visita digitais à mão</li>
    </ul>

    <p><strong>Dica:</strong> Entre 5 minutos antes para garantir que tudo está funcionando!</p>
    <p>Nos vemos já já!</p>
    <p><strong>Equipe Gente Networking</strong></p>
  `;

  return getEmailTemplate(content);
}

// Helper function to send new lead notification
export async function sendNewLeadNotification(lead: {
  name: string;
  email: string;
  whatsapp: string;
  company: string;
  segment: string;
  source: string;
}) {
  const html = getNewLeadNotificationEmail(lead);
  return sendEmail({
    to: EMAIL_CONFIG.to,
    subject: `🎉 Novo Lead: ${lead.name} (${lead.source === "participe" ? "Participe" : "Gente HUB"})`,
    html,
  });
}

// Helper function to send confirmation email to lead
export async function sendLeadConfirmationEmail(
  lead: {
    name: string;
    email: string;
    source: string;
  },
  eventDetails?: {
    eventDate: string;
    eventTime: string;
    whatsappGroupLink?: string;
  }
) {
  let html: string;
  let subject: string;

  if (lead.source === "participe") {
    html = getParticipeConfirmationEmail(lead);
    subject = "Bem-vindo ao Gente Networking! 🎉";
  } else {
    if (!eventDetails) {
      throw new Error("Event details required for Gente HUB confirmation");
    }
    html = getGenteHubConfirmationEmail({
      name: lead.name,
      ...eventDetails,
    });
    subject = "Sua vaga está garantida no Gente HUB! 🎉";
  }

  return sendEmail({
    to: lead.email,
    subject,
    html,
  });
}
