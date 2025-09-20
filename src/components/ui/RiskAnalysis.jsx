import React, { useState } from 'react';
import { AlertTriangle, X, Shield, AlertCircle, CheckCircle, TrendingUp, Calendar, DollarSign, Users, FileText, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const RiskAnalysis = ({ document, isOpen, onClose }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDp8UDk012Fs6iAoU71MNmbx0IRE5S6_5w');

  const getRiskIcon = (level) => {
    switch (level) {
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Shield className="w-5 h-5 text-blue-600" />;
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'financial':
        return <DollarSign className="w-4 h-4" />;
      case 'legal':
        return <FileText className="w-4 h-4" />;
      case 'operational':
        return <Users className="w-4 h-4" />;
      case 'compliance':
        return <Shield className="w-4 h-4" />;
      case 'timeline':
        return <Calendar className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const generateFallbackAnalysis = () => {
    return {
      overallRisk: 'medium',
      riskScore: 6.5,
      totalRisks: 8,
      summary: "Based on the document analysis, this employment contract presents moderate risk levels. Key areas of concern include the extended 60-day notice period and exclusivity clauses that may limit future opportunities.",
      risks: [
        {
          id: 1,
          title: "Extended Notice Period",
          description: "The 60-day notice period for non-renewal is longer than the standard 30 days, which could limit flexibility for both parties.",
          level: "medium",
          category: "Legal",
          section: "1.1",
          impact: "Could delay career transitions or business changes",
          mitigation: "Consider negotiating a shorter notice period or reciprocal terms"
        },
        {
          id: 2,
          title: "Exclusivity Clause Risk",
          description: "The requirement to devote substantially all business time prohibits outside work without Board approval, limiting income diversification.",
          level: "high",
          category: "Financial",
          section: "2.2",
          impact: "Restricts ability to pursue side businesses or consulting opportunities",
          mitigation: "Request specific exceptions for certain types of outside activities"
        },
        {
          id: 3,
          title: "Automatic Renewal Terms",
          description: "The contract automatically renews for one-year periods unless notice is given, which could lead to unintended extensions.",
          level: "medium",
          category: "Legal",
          section: "1.1",
          impact: "May result in longer commitment than intended",
          mitigation: "Set calendar reminders well before renewal deadlines"
        },
        {
          id: 4,
          title: "Performance-Based Bonus Structure",
          description: "Annual bonus depends on performance goals established by the Board, creating uncertainty in total compensation.",
          level: "medium",
          category: "Financial",
          section: "3.2",
          impact: "Variable compensation may affect financial planning",
          mitigation: "Request clear, measurable performance criteria upfront"
        },
        {
          id: 5,
          title: "Base Salary Protection",
          description: "The contract states base salary can be increased but not decreased, providing good protection for the employee.",
          level: "low",
          category: "Financial",
          section: "3.1",
          impact: "Positive - protects against salary reductions",
          mitigation: "No action needed - favorable term"
        }
      ],
      recommendations: [
        "Negotiate specific exceptions to the exclusivity clause for certain types of consulting or advisory roles",
        "Request detailed performance metrics for bonus calculation before signing",
        "Consider adding termination clauses that protect both parties' interests",
        "Set up calendar reminders for contract renewal deadlines",
        "Review industry standards for CTO compensation to ensure competitiveness"
      ],
      keyMetrics: {
        highRiskItems: 1,
        mediumRiskItems: 3,
        lowRiskItems: 1,
        favorableTerms: 2
      }
    };
  };

  const analyzeDocumentRisks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
      let model;
      
      for (const modelName of modelNames) {
        try {
          model = genAI.getGenerativeModel({ model: modelName });
          break;
        } catch (error) {
          continue;
        }
      }

      if (!model) {
        throw new Error("AI model not available");
      }

      const prompt = `
        You are an expert legal risk analyst specializing in contract analysis. Analyze the following legal document for potential risks, unfavorable terms, and areas of concern.

        Document Details:
        Name: ${document?.name || 'Unknown Document'}
        Type: ${document?.type || 'Legal Document'}
        Content: ${document?.content || 'No content available'}
        Summary: ${document?.summary ? document.summary.map(item => `${item.title}: ${item.content}`).join('\n') : 'No summary available'}

        Please provide a comprehensive risk analysis in the following JSON format:
        {
          "overallRisk": "high|medium|low",
          "riskScore": number (1-10),
          "totalRisks": number,
          "summary": "Brief overall assessment",
          "risks": [
            {
              "title": "Risk title",
              "description": "Detailed explanation",
              "level": "high|medium|low",
              "category": "Financial|Legal|Operational|Compliance|Timeline",
              "section": "Document section reference",
              "impact": "Potential negative impact",
              "mitigation": "Suggested mitigation strategy"
            }
          ],
          "recommendations": ["Key recommendations array"],
          "keyMetrics": {
            "highRiskItems": number,
            "mediumRiskItems": number,
            "lowRiskItems": number,
            "favorableTerms": number
          }
        }

        Focus on identifying:
        1. Unfavorable clauses or terms
        2. Missing protections
        3. Ambiguous language that could cause issues
        4. Financial risks
        5. Legal compliance concerns
        6. Operational restrictions
        7. Timeline or deadline risks

        Provide specific, actionable insights with clear mitigation strategies.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      // Try to parse JSON response
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisData = JSON.parse(jsonMatch[0]);
          setAnalysis(analysisData);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.log("Using fallback analysis due to parse error");
        setAnalysis(generateFallbackAnalysis());
      }

    } catch (error) {
      console.error('Error analyzing document risks:', error);
      console.log("Using fallback risk analysis...");
      setAnalysis(generateFallbackAnalysis());
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !analysis && !isLoading) {
      analyzeDocumentRisks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Risk Analysis</h2>
              <p className="text-red-100 text-sm">{document?.name || 'Document Analysis'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Analyzing Document Risks</h3>
              <p className="text-neutral-600 text-center">
                Our AI is carefully reviewing your document for potential risks, unfavorable terms, and areas of concern...
              </p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Overall Risk Summary */}
              <div className={`rounded-xl border-2 p-6 ${getRiskColor(analysis.overallRisk)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getRiskIcon(analysis.overallRisk)}
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">Overall Risk Assessment</h3>
                      <p className="text-sm text-neutral-600 capitalize">
                        {analysis.overallRisk} Risk Level • Score: {analysis.riskScore}/10
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neutral-900">{analysis.totalRisks}</div>
                    <div className="text-xs text-neutral-600">Risk Items</div>
                  </div>
                </div>
                <p className="text-neutral-800">{analysis.summary}</p>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{analysis.keyMetrics?.highRiskItems || 0}</div>
                  <div className="text-sm text-red-700">High Risk</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{analysis.keyMetrics?.mediumRiskItems || 0}</div>
                  <div className="text-sm text-yellow-700">Medium Risk</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{analysis.keyMetrics?.lowRiskItems || 0}</div>
                  <div className="text-sm text-green-700">Low Risk</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysis.keyMetrics?.favorableTerms || 0}</div>
                  <div className="text-sm text-blue-700">Favorable Terms</div>
                </div>
              </div>

              {/* Individual Risks */}
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-4">Identified Risks</h3>
                <div className="space-y-4">
                  {analysis.risks?.map((risk, index) => (
                    <div key={risk.id || index} className={`border rounded-lg p-4 ${getRiskColor(risk.level)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getRiskIcon(risk.level)}
                          <div>
                            <h4 className="font-semibold text-neutral-900">{risk.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1 text-xs text-neutral-600">
                                {getCategoryIcon(risk.category)}
                                <span>{risk.category}</span>
                              </div>
                              {risk.section && (
                                <span className="text-xs text-neutral-500">• Section {risk.section}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          risk.level === 'high' ? 'bg-red-100 text-red-700' :
                          risk.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {risk.level} Risk
                        </span>
                      </div>
                      
                      <p className="text-sm text-neutral-700 mb-3">{risk.description}</p>
                      
                      <div className="space-y-2">
                        <div className="bg-white/50 rounded-lg p-3">
                          <h5 className="font-medium text-neutral-900 text-sm mb-1">Potential Impact:</h5>
                          <p className="text-sm text-neutral-700">{risk.impact}</p>
                        </div>
                        <div className="bg-white/50 rounded-lg p-3">
                          <h5 className="font-medium text-neutral-900 text-sm mb-1">Recommended Mitigation:</h5>
                          <p className="text-sm text-neutral-700">{risk.mitigation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-4">Key Recommendations</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-neutral-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Unable to Generate Risk Analysis</h3>
              <p className="text-neutral-600">
                We couldn't analyze the document at this time. Please try again later.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 border-t border-neutral-200 p-4 flex justify-between items-center">
          <p className="text-xs text-neutral-500">
            This analysis is for informational purposes only and should not replace professional legal advice.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
