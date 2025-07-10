import { useState } from "react";
import { Plus, FileText, Receipt } from "lucide-react";
import { ServiceItem, EstimateData, generateDocumentNumber, formatCurrency } from "@/lib/estimate-utils";

interface EstimateFormProps {
  onGenerateEstimate: (data: EstimateData) => void;
}

export default function EstimateForm({ onGenerateEstimate }: EstimateFormProps) {
  const [documentType, setDocumentType] = useState<'estimate' | 'invoice'>('estimate');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [services, setServices] = useState<ServiceItem[]>([
    { description: '', amount: 0 }
  ]);

  const addService = () => {
    setServices([...services, { description: '', amount: 0 }]);
  };

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string | number) => {
    const updatedServices = [...services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setServices(updatedServices);
  };

  const calculateTotal = () => {
    return services.reduce((total, service) => total + (service.amount || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim()) {
      alert('Please enter a client name');
      return;
    }

    const validServices = services.filter(service => 
      service.description.trim() && (service.amount || 0) > 0
    );

    if (validServices.length === 0) {
      alert('Please add at least one service with a description and amount');
      return;
    }

    const estimateData: EstimateData = {
      documentType,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      clientAddress: clientAddress.trim(),
      documentDate,
      services: validServices,
      total: calculateTotal(),
      documentNumber: generateDocumentNumber(documentType, documentDate)
    };

    onGenerateEstimate(estimateData);
  };

  return (
    <div className="jlr-container">
      <div className="jlr-header">
        <div className="jlr-logo-placeholder">🏗️</div>
        <h1 className="text-4xl font-light mb-3">JLR Construction LLC</h1>
        <p className="opacity-90 text-lg">
          {documentType === 'estimate' ? 'Professional Estimate Generator' : 'Professional Invoice Generator'}
        </p>
        
        <div className="document-type-toggle mt-8 mb-0">
          <div className="jlr-toggle-buttons">
            <button 
              className={`jlr-toggle-btn ${documentType === 'estimate' ? 'active' : ''}`}
              onClick={() => setDocumentType('estimate')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Estimate
            </button>
            <button 
              className={`jlr-toggle-btn ${documentType === 'invoice' ? 'active' : ''}`}
              onClick={() => setDocumentType('invoice')}
            >
              <Receipt className="w-4 h-4 mr-2" />
              Invoice
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="jlr-form-section">
        <div className="jlr-form-grid">
          <div className="jlr-form-group">
            <label htmlFor="clientName">Client Name</label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
              required
            />
          </div>
          
          <div className="jlr-form-group">
            <label htmlFor="clientEmail">Client Email</label>
            <input
              type="email"
              id="clientEmail"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Enter client email"
            />
          </div>
          
          <div className="jlr-form-group">
            <label htmlFor="clientPhone">Client Phone</label>
            <input
              type="tel"
              id="clientPhone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="Enter client phone number"
            />
          </div>
          
          <div className="jlr-form-group">
            <label htmlFor="documentDate">
              {documentType === 'estimate' ? 'Estimate Date' : 'Invoice Date'}
            </label>
            <input
              type="date"
              id="documentDate"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              required
            />
          </div>
          
          <div className="jlr-form-group full-width">
            <label htmlFor="clientAddress">Client Address</label>
            <textarea
              id="clientAddress"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Enter client address"
              rows={3}
            />
          </div>
        </div>

        <div className="jlr-services-section">
          <div className="jlr-services-header">
            <h3>Services</h3>
            <button 
              type="button"
              className="jlr-add-service-btn"
              onClick={addService}
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </div>

          <table className="jlr-services-table">
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Description</th>
                <th style={{ width: '25%' }}>Amount ($)</th>
                <th style={{ width: '15%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={service.description}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      placeholder="e.g., Scaffold labor"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={service.amount || ''}
                      onChange={(e) => updateService(index, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="jlr-remove-btn"
                      onClick={() => removeService(index)}
                      disabled={services.length === 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="jlr-total-section">
          <div className="jlr-total-amount">
            {formatCurrency(calculateTotal())}
          </div>
        </div>

        <button type="submit" className="jlr-generate-btn">
          {documentType === 'estimate' ? <FileText className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
          Generate {documentType === 'estimate' ? 'Estimate' : 'Invoice'} PDF
        </button>
      </form>
    </div>
  );
}
