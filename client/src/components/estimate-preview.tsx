import { Printer, Download, ArrowLeft } from "lucide-react";
import { EstimateData, formatCurrency, formatDate } from "@/lib/estimate-utils";

interface EstimatePreviewProps {
  data: EstimateData;
  onBackToForm: () => void;
}

export default function EstimatePreview({ data, onBackToForm }: EstimatePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // For now, we'll use the browser's print to PDF functionality
    // In a production app, you might want to use a library like html2pdf or jsPDF
    window.print();
  };

  return (
    <div className="jlr-container">
      <div className="jlr-estimate-preview">
        <div className="jlr-estimate-header">
          <div className="jlr-logo-section">
            <div className="jlr-logo">JLR</div>
            <div className="jlr-logo-text">
              JLR<br />
              CONSTRUCTION LLC<br />
              <small style={{ fontSize: '0.8rem', color: '#666' }}>RESIDENTIAL & COMMERCIAL</small>
            </div>
          </div>
          <div className="jlr-company-info">
            <strong>JLR Construction LLC</strong><br />
            125 Jones Rd<br />
            Angleton, TX 77515<br />
            <strong>Phone:</strong> (832) 283-9917<br />
            <strong>Email:</strong> Ricardochirinos329@gmail.com
          </div>
        </div>

        <h1 className="jlr-estimate-title">
          {data.documentType === 'estimate' ? 'WORK ESTIMATE' : 'INVOICE'}
        </h1>

        <div className="jlr-estimate-details">
          <div className="jlr-detail-section">
            <strong>
              {data.documentType === 'estimate' ? 'Estimate' : 'Invoice'} #:
            </strong> {data.documentNumber}<br />
            <strong>Date:</strong> {formatDate(data.documentDate)}
          </div>
          <div className="jlr-detail-section jlr-client-details">
            <strong>To:</strong><br />
            <div>
              <div>{data.clientName}</div>
              {data.clientEmail && <div>{data.clientEmail}</div>}
              {data.clientPhone && <div>{data.clientPhone}</div>}
              {data.clientAddress && <div>{data.clientAddress}</div>}
            </div>
          </div>
        </div>

        <div className="jlr-services-title">Services:</div>
        <table className="jlr-estimate-services-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style={{ width: '150px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.services.map((service, index) => (
              <tr key={index}>
                <td>{service.description}</td>
                <td className="jlr-amount-cell">{formatCurrency(service.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="jlr-estimate-total-section">
          <div>Total: <span className="jlr-estimate-total-amount">{formatCurrency(data.total)}</span></div>
        </div>

        <div className="jlr-actions">
          <button className="jlr-btn" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button className="jlr-btn jlr-btn-secondary" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button className="jlr-btn jlr-btn-secondary" onClick={onBackToForm}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Generator
          </button>
        </div>
      </div>
    </div>
  );
}
