import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon, DownloadIcon, ShareIcon, BookmarkIcon, PanelLeftIcon, PanelRightIcon, SearchIcon, ChevronDownIcon, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import ChatBot from '../components/ui/ChatBot';
import RiskAnalysis from '../components/ui/RiskAnalysis';
// Mock document data
const getDocumentContent = (t) => {
  return `
    <h2>${t.documentContent.employmentAgreementTitle}</h2>
    <p>${t.documentContent.employmentAgreementIntro}</p>
    <p>${t.documentContent.whereasCompany}</p>
    <p>${t.documentContent.whereasEmployee}</p>
    <h3>${t.documentContent.termOfEmploymentTitle}</h3>
    <p>${t.documentContent.termOfEmploymentContent}</p>
    <h3>${t.documentContent.positionAndDutiesTitle}</h3>
    <p><strong>${t.documentContent.positionSubtitle}</strong> ${t.documentContent.positionContent}</p>
    <p><strong>${t.documentContent.dutiesSubtitle}</strong> ${t.documentContent.dutiesContent}</p>
    <h3>${t.documentContent.compensationAndBenefitsTitle}</h3>
    <p><strong>${t.documentContent.baseSalarySubtitle}</strong> ${t.documentContent.baseSalaryContent}</p>
    <p><strong>${t.documentContent.annualBonusSubtitle}</strong> ${t.documentContent.annualBonusContent}</p>
  `;
};

const getDocumentSummary = (t) => {
  return [
    {
      title: t.summaryContent.employmentTerm,
      content: t.summaryContent.employmentTermDesc,
      importance: 'high',
      section: '1.1'
    },
    {
      title: t.summaryContent.positionReporting,
      content: t.summaryContent.positionReportingDesc,
      importance: 'medium',
      section: '2.1'
    },
    {
      title: t.summaryContent.exclusivityReq,
      content: t.summaryContent.exclusivityReqDesc,
      importance: 'high',
      section: '2.2'
    },
    {
      title: t.summaryContent.compensation,
      content: t.summaryContent.compensationDesc,
      importance: 'medium',
      section: '3.1-3.2'
    }
  ];
};

const mockDocument = {
  id: '1',
  name: 'Employment_Contract_2023.pdf',
  type: 'Contract',
  uploadDate: '2023-06-15',
  pages: 24
};

export const DocumentViewer = () => {
  const { id } = useParams();
  const { t, translate } = useLanguage(); // Get translations
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRiskAnalysisOpen, setIsRiskAnalysisOpen] = useState(false);
  
  // In a real app, you would fetch the document based on the id
  const document = {
    ...mockDocument,
    content: getDocumentContent(t),
    summary: getDocumentSummary(t)
  };
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  const highlightSection = section => {
    setActiveSection(section === activeSection ? null : section);
    // In a real app, you would scroll to the section in the document
  };
  return <div className="bg-neutral-50 min-h-screen pb-12">
      {/* Document header */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <button onClick={() => window.history.back()} className="mr-4 p-2 rounded-full hover:bg-neutral-100" title={t.backToDashboard}>
                <ArrowLeftIcon className="h-5 w-5 text-neutral-700" />
              </button>
              <div>
                <div className="flex items-center">
                  <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mr-3">
                    {document.name}
                  </h1>
                  <Tag label={document.type} color="blue" />
                </div>
                <p className="mt-1 text-sm text-neutral-600">
                  {document.pages} pages • uploaded {document.uploadDate}
                </p>
              </div>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              {/* Language Selector */}
              <LanguageSelector showLabel={false} className="mr-2" />
              
              <button 
                onClick={() => setIsRiskAnalysisOpen(true)}
                className="btn btn-outline btn-sm flex items-center hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Risk Analysis
              </button>
              <button className="btn btn-outline btn-sm flex items-center" title={t.downloadDocument}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                {t.downloadDocument}
              </button>
              <button className="btn btn-outline btn-sm flex items-center" title={t.shareDocument}>
                <ShareIcon className="h-4 w-4 mr-2" />
                {t.shareDocument}
              </button>
              <button className="btn btn-primary btn-sm flex items-center" title={t.bookmarkDocument}>
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row">
          {/* Document content */}
          <div className={`w-full ${isPanelOpen ? 'lg:w-7/12' : 'lg:w-full'} transition-all duration-300`}>
            <Card className="mb-6 lg:mb-0 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {t.originalDocument}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input type="text" className="input py-1 px-3 text-sm" placeholder={t.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <SearchIcon className="h-4 w-4 text-neutral-400" />
                    </div>
                  </div>
                  <button className="p-2 rounded-full hover:bg-neutral-100 lg:hidden" onClick={togglePanel}>
                    {isPanelOpen ? <PanelRightIcon className="h-5 w-5" /> : <PanelLeftIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{
              __html: document.content
            }} />
              {/* Toggle panel button (desktop) */}
              <button className="hidden lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white border border-neutral-200 rounded-full shadow-sm items-center justify-center" onClick={togglePanel}>
                {isPanelOpen ? <PanelRightIcon className="h-4 w-4" /> : <PanelLeftIcon className="h-4 w-4" />}
              </button>
            </Card>
          </div>
          {/* Summary panel */}
          {isPanelOpen && <div className="w-full lg:w-5/12 lg:pl-6 mt-6 lg:mt-0">
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {t.summaryContent.documentSummary}
                  </h2>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    {t.summaryContent.exportButton}
                  </button>
                </div>
                <div className="space-y-6">
                  {document.summary.map((item, index) => <div key={index} className={`p-4 rounded-lg border ${activeSection === item.section ? 'bg-primary-50 border-primary-200' : 'bg-neutral-50 border-neutral-200'}`} onClick={() => highlightSection(item.section)}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-medium text-neutral-900">
                          {item.title}
                        </h3>
                        <Tag label={item.importance === 'high' ? t.summaryContent.important : t.summaryContent.note} color={item.importance === 'high' ? 'red' : 'gray'} className="text-xs" />
                      </div>
                      <p className="text-sm text-neutral-700">{item.content}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-neutral-500">
                          {t.summaryContent.section} {item.section}
                        </span>
                        <button className="text-xs text-primary-600 hover:text-primary-700">
                          {t.summaryContent.goToSection}
                        </button>
                      </div>
                    </div>)}
                </div>
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="text-base font-medium text-neutral-900 mb-4">
                    {t.keyPointsTitle}
                  </h3>
                  <ul className="space-y-2 text-sm text-neutral-700">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                      <span>
                        {t.summaryContent.keyPointsNotice60}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                      <span>
                        {t.summaryContent.keyPointsExclusivity}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2"></div>
                      <span>
                        {t.summaryContent.keyPointsSalary}
                      </span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>}
        </div>
      </div>
      
      {/* Risk Analysis Modal */}
      <RiskAnalysis 
        document={document} 
        isOpen={isRiskAnalysisOpen} 
        onClose={() => setIsRiskAnalysisOpen(false)} 
      />
      
      {/* ChatBot Component */}
      <ChatBot document={document} />
    </div>;
};