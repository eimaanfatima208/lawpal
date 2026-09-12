import React, { useState } from "react";
import { FileText, Download, Eye, X } from "lucide-react";
import './LegalTemplates.css';

export default function LegalTemplates() {
  const [previewDoc, setPreviewDoc] = useState(null);

  // Template data with file paths
  const templates = [
    {
      id: 1,
      title: "Rental Agreement",
      description: "A comprehensive rental agreement template for property rental between landlord and tenant, covering all necessary terms and conditions.",
      file: "/Documents/Rental-Agreement-in-English-1.pdf",
      format: "PDF",
      category: "Property"
    },
    {
      id: 2,
      title: "Property Sale Agreement",
      description: "A detailed property sale agreement template for buying and selling real estate properties with all legal terms and conditions.",
      file: "/Documents/Property Sale agreement.pdf",
      format: "PDF",
      category: "Property"
    },
    {
      id: 3,
      title: "Marriage Affidavit",
      description: "A legally binding affidavit template for marriage/Nikah documentation, commonly used for official purposes and legal proceedings.",
      file: "/Documents/Marriage.pdf",
      format: "PDF",
      category: "Personal"
    },
    {
      id: 4,
      title: "Last Will and Testament",
      description: "A legally enforceable declaration template for how a person's property and assets will be distributed after their death.",
      file: "/Documents/Last will.pdf",
      format: "PDF",
      category: "Estate"
    },
    {
      id: 5,
      title: "Affidavit of Loss Documents",
      description: "A comprehensive template for filing an affidavit when important documents are lost, covering all necessary legal declarations.",
      file: "/Documents/affidavit-of-loss-documents-english.pdf",
      format: "PDF",
      category: "Personal"
    },
    {
      id: 6,
      title: "Criminal Complaint",
      description: "A standard template for filing a criminal complaint with law enforcement, covering all necessary sections and legal requirements.",
      file: "/Documents/criminal complaint.pdf",
      format: "PDF",
      category: "Legal"
    }
  ];

  // Handle download
  const handleDownload = (template) => {
    // Encode the file path to handle spaces and special characters
    const encodedPath = encodeURI(template.file);
    const link = document.createElement('a');
    link.href = encodedPath;
    link.download = `${template.title.replace(/\s+/g, '-')}.${template.format.toLowerCase()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle preview
  const handlePreview = (template) => {
    setPreviewDoc(template);
  };

  // Close preview
  const closePreview = () => {
    setPreviewDoc(null);
  };

  return (
    <div className="legal-templates-container">
      <div className="templates-header">
        <h1 className="templates-title">Legal Document Templates</h1>
        <p className="templates-description">
          Access a comprehensive collection of legal document templates for various needs. 
          Easily preview and download the necessary forms to streamline your legal processes.
        </p>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-icon">
              <FileText className="icon" />
            </div>
            <h3 className="template-title">{template.title}</h3>
            <p className="template-description">{template.description}</p>
            <div className="template-footer">
              <button
                onClick={() => handlePreview(template)}
                className="btn-preview"
              >
                <Eye className="btn-icon" />
                Preview
              </button>
              <button
                onClick={() => handleDownload(template)}
                className="btn-download"
              >
                <Download className="btn-icon" />
                Download ({template.format})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="preview-modal-overlay" onClick={closePreview}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h2 className="preview-modal-title">{previewDoc.title}</h2>
              <button onClick={closePreview} className="preview-close-btn">
                <X className="close-icon" />
              </button>
            </div>
            <div className="preview-modal-body">
              {previewDoc.format === "PDF" ? (
                <iframe
                  src={encodeURI(previewDoc.file)}
                  className="preview-iframe"
                  title={previewDoc.title}
                  type="application/pdf"
                />
              ) : (
                <div className="preview-doc-message">
                  <FileText className="doc-icon" />
                  <p>Document preview is available for PDF files only.</p>
                  <p>Please download the document to view it.</p>
                  <button
                    onClick={() => {
                      handleDownload(previewDoc);
                      closePreview();
                    }}
                    className="btn-download-inline"
                  >
                    <Download className="btn-icon" />
                    Download Document
                  </button>
                </div>
              )}
            </div>
            <div className="preview-modal-footer">
              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  closePreview();
                }}
                className="btn-download-modal"
              >
                <Download className="btn-icon" />
                Download ({previewDoc.format})
              </button>
              <button onClick={closePreview} className="btn-close-modal">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

