export interface ServiceItem {
  description: string;
  amount: number;
}

export interface EstimateData {
  documentType: 'estimate' | 'invoice';
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  documentDate: string;
  services: ServiceItem[];
  total: number;
  documentNumber: string;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function generateDocumentNumber(type: 'estimate' | 'invoice', dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const prefix = type === 'estimate' ? 'EST' : 'INV';
  return `${prefix}-${year}${month}${day}-001`;
}
