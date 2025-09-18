import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeftIcon, DownloadIcon, ShareIcon, BookmarkIcon, PanelLeftIcon, PanelRightIcon, SearchIcon, ChevronDownIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
// Mock document data
const mockDocument = {
  id: '1',
  name: 'Employment_Contract_2023.pdf',
  type: 'Contract',
  uploadDate: '2023-06-15',
  pages: 24,
  content: `
    <h2>EMPLOYMENT AGREEMENT</h2>
    <p>THIS EMPLOYMENT AGREEMENT (the "Agreement") is made and entered into as of January 15, 2023 (the "Effective Date"), by and between ACME CORPORATION, a Delaware corporation (the "Company"), and JOHN DOE, an individual (the "Employee").</p>
    <p>WHEREAS, the Company desires to employ the Employee on the terms and conditions set forth herein; and</p>
    <p>WHEREAS, the Employee desires to be employed by the Company on such terms and conditions.</p>
    <h3>1. TERM OF EMPLOYMENT</h3>
    <p>1.1 The term of employment under this Agreement (the "Employment Term") shall commence on the Effective Date and continue thereafter for a period of three (3) years, unless earlier terminated in accordance with Section 4 hereof. The Employment Term shall automatically renew for successive one (1) year periods unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current Employment Term.</p>
    <h3>2. POSITION AND DUTIES</h3>
    <p>2.1 Position. During the Employment Term, the Employee shall serve as the Chief Technology Officer of the Company, reporting directly to the Chief Executive Officer. The Employee shall have such duties, authority, and responsibility as are commensurate with such position and as may be assigned to the Employee by the Chief Executive Officer or the Board of Directors of the Company (the "Board").</p>
    <p>2.2 Duties. During the Employment Term, the Employee shall devote substantially all of his business time and attention to the performance of the Employee's duties hereunder and will not engage in any other business, profession, or occupation for compensation or otherwise which would conflict or interfere with the performance of such services either directly or indirectly without the prior written consent of the Board.</p>
    <h3>3. COMPENSATION AND BENEFITS</h3>
    <p>3.1 Base Salary. During the Employment Term, the Company shall pay the Employee a base salary at the annual rate of $225,000, payable in accordance with the Company's customary payroll practices. The Employee's base salary shall be reviewed annually by the Board and may be increased, but not decreased, at the discretion of the Board (the annual base salary, as in effect from time to time, the "Base Salary").</p>
    <p>3.2 Annual Bonus. For each calendar year of the Employment Term, the Employee shall be eligible to earn an annual bonus (the "Annual Bonus") with a target amount equal to 25% of the Employee's Base Salary (the "Target Bonus"), based upon the achievement of performance goals established by the Board. The Annual Bonus, if any, shall be paid to the Employee within two and one-half (2.5) months after the end of the applicable calendar year.</p>
  `,
  summary: [{
    title: 'Employment Term',
    content: 'The employment is for 3 years and automatically renews for 1-year periods unless either party gives 60 days notice before the term ends.',
    importance: 'high',
    section: '1.1'
  }, {
    title: 'Position & Reporting Structure',
    content: 'Position is Chief Technology Officer reporting to the CEO with duties assigned by CEO or Board.',
    importance: 'medium',
    section: '2.1'
  }, {
    title: 'Exclusivity Requirement',
    content: 'Employee must devote substantially all business time to this role and cannot engage in other paid work without Board approval.',
    importance: 'high',
    section: '2.2'
  }, {
    title: 'Compensation',
    content: 'Base salary of $225,000 per year, reviewed annually, can be increased but not decreased. Annual bonus target of 25% of base salary based on performance goals.',
    importance: 'medium',
    section: '3.1-3.2'
  }]
};
export const DocumentViewer: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // In a real app, you would fetch the document based on the id
  const document = mockDocument;
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  const highlightSection = (section: string) => {
    setActiveSection(section === activeSection ? null : section);
    // In a real app, you would scroll to the section in the document
  };
  return <div className="bg-neutral-50 min-h-screen pb-12">
      {/* Document header */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <button onClick={() => window.history.back()} className="mr-4 p-2 rounded-full hover:bg-neutral-100">
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
                  {document.pages} pages • Uploaded {document.uploadDate}
                </p>
              </div>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <button className="btn btn-outline btn-sm flex items-center">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </button>
              <button className="btn btn-outline btn-sm flex items-center">
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </button>
              <button className="btn btn-primary btn-sm flex items-center">
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
                  Original Document
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input type="text" className="input py-1 px-3 text-sm" placeholder="Search in document..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
              <button className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white border border-neutral-200 rounded-full shadow-sm flex items-center justify-center" onClick={togglePanel}>
                {isPanelOpen ? <PanelRightIcon className="h-4 w-4" /> : <PanelLeftIcon className="h-4 w-4" />}
              </button>
            </Card>
          </div>
          {/* Summary panel */}
          {isPanelOpen && <div className="w-full lg:w-5/12 lg:pl-6 mt-6 lg:mt-0">
              <Card>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-neutral-900">
                    Document Summary
                  </h2>
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Export
                  </button>
                </div>
                <div className="space-y-6">
                  {document.summary.map((item, index) => <div key={index} className={`p-4 rounded-lg border ${activeSection === item.section ? 'bg-primary-50 border-primary-200' : 'bg-neutral-50 border-neutral-200'}`} onClick={() => highlightSection(item.section)}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-medium text-neutral-900">
                          {item.title}
                        </h3>
                        <Tag label={item.importance === 'high' ? 'Important' : 'Note'} color={item.importance === 'high' ? 'red' : 'gray'} className="text-xs" />
                      </div>
                      <p className="text-sm text-neutral-700">{item.content}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-neutral-500">
                          Section {item.section}
                        </span>
                        <button className="text-xs text-primary-600 hover:text-primary-700">
                          Go to section
                        </button>
                      </div>
                    </div>)}
                </div>
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <h3 className="text-base font-medium text-neutral-900 mb-4">
                    Key Takeaways
                  </h3>
                  <ul className="space-y-2 text-sm text-neutral-700">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                      <span>
                        60-day notice required for non-renewal (longer than
                        standard 30 days)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></div>
                      <span>
                        Exclusivity clause prohibits outside work without board
                        approval
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2"></div>
                      <span>
                        Base salary cannot be decreased during employment term
                      </span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>}
        </div>
      </div>
    </div>;
};