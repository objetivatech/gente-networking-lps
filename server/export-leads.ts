import { Lead } from "../drizzle/schema";

/**
 * Convert leads to CSV format
 */
export function leadsToCSV(leads: Lead[]): string {
  if (leads.length === 0) {
    return "Nome,Email,WhatsApp,Empresa,Segmento,Origem,Status,Data de Inscrição\n";
  }

  // CSV Header
  const header = "Nome,Email,WhatsApp,Empresa,Segmento,Origem,Status,Data de Inscrição\n";

  // CSV Rows
  const rows = leads.map((lead) => {
    const name = escapeCSV(lead.name);
    const email = escapeCSV(lead.email);
    const whatsapp = escapeCSV(lead.whatsapp);
    const company = escapeCSV(lead.company);
    const segment = escapeCSV(lead.segment);
    const source = lead.source === "participe" ? "Participe" : "Gente HUB";
    const status = translateStatus(lead.status);
    const createdAt = new Date(lead.createdAt).toLocaleDateString("pt-BR");

    return `${name},${email},${whatsapp},${company},${segment},${source},${status},${createdAt}`;
  });

  return header + rows.join("\n");
}

/**
 * Escape CSV values (handle commas, quotes, newlines)
 */
function escapeCSV(value: string | null): string {
  if (!value) return "";

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

/**
 * Translate status to Portuguese
 */
function translateStatus(status: string): string {
  const statusMap: Record<string, string> = {
    new: "Novo",
    contacted: "Contatado",
    converted: "Convertido",
    archived: "Arquivado",
  };

  return statusMap[status] || status;
}

/**
 * Generate filename for CSV export
 */
export function generateCSVFilename(source?: "participe" | "gentehub"): string {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const sourceName = source === "participe" ? "participe" : source === "gentehub" ? "gentehub" : "todos";
  return `gente-networking-leads-${sourceName}-${date}.csv`;
}
