'use client'

import { useState, useEffect } from 'react'
import React from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SimpleTabs from '@/components/ui/SimpleTabs'
import { 
  Scale, 
  FileText, 
  Download, 
  Save, 
  Eye, 
  Edit, 
  Plus, 
  X, 
  Trash2,
  Copy,
  Share2,
  Printer,
  Search as SearchIcon,
  Filter,
  BookOpen,
  BarChart3,
  Shield,
  Users,
  Briefcase,
  FileCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  History,
  FileSpreadsheet,
  Upload,
  Zap,
  Sparkles,
  DollarSign,
  Building2,
  Code,
  ShoppingCart,
  CreditCard,
  FileLock,
  Key,
  Lock,
  Globe,
  Mail,
  Receipt,
  TrendingUp,
  Award,
  Megaphone,
  Network,
  Package,
  FileSignature,
  StickyNote,
  ClipboardList,
  Layers,
  GitBranch,
  Factory,
  Truck,
  Radio,
  Camera,
  Mic,
  Video,
  Gift,
  HeartHandshake,
  Presentation,
  Calendar,
  MapPin,
  UserCheck,
  UserX,
  Coins,
  Wallet,
  PiggyBank,
  Heart
} from 'lucide-react'
import { showToast } from '@/components/ui/ToastContainer'
import Link from 'next/link'

interface DocumentSection {
  id: string
  title: string
  content: string
  order: number
}

interface LegalDocument {
  id: string
  type: string
  title: string
  sections: DocumentSection[]
  metadata: {
    created: string
    modified: string
    version: number
    status: 'draft' | 'final' | 'archived'
  }
  variables: Record<string, string>
}

interface DocumentTemplate {
  id: string
  name: string
  category: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  sections: string[]
  variables: string[]
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'founder-agreement',
    name: 'Founder Agreement',
    category: 'Founder',
    description: 'Agreement between co-founders covering equity, roles, and responsibilities',
    icon: HeartHandshake,
    sections: ['Parties', 'Equity Distribution', 'Roles & Responsibilities', 'Decision Making', 'Exit Clauses'],
    variables: ['founder1', 'founder2', 'equity1', 'equity2', 'companyName', 'vestingPeriod']
  },
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    category: 'Confidentiality',
    description: 'Protect confidential information shared with employees, partners, or investors',
    icon: Shield,
    sections: ['Parties', 'Confidential Information', 'Obligations', 'Term', 'Remedies'],
    variables: ['disclosingParty', 'receivingParty', 'purpose', 'duration', 'jurisdiction']
  },
  {
    id: 'employment-contract',
    name: 'Employment Contract',
    category: 'Employment',
    description: 'Standard employment agreement with terms, compensation, and benefits',
    icon: Briefcase,
    sections: ['Position', 'Compensation', 'Benefits', 'Term', 'Termination', 'Non-Compete'],
    variables: ['employeeName', 'position', 'salary', 'startDate', 'location', 'reportingTo']
  },
  {
    id: 'privacy-policy',
    name: 'Privacy Policy',
    category: 'Compliance',
    description: 'Privacy policy for websites and applications',
    icon: Shield,
    sections: ['Information Collection', 'Data Usage', 'Data Sharing', 'User Rights', 'Cookies', 'Contact'],
    variables: ['companyName', 'website', 'contactEmail', 'jurisdiction', 'dataController']
  },
  {
    id: 'terms-of-service',
    name: 'Terms of Service',
    category: 'Compliance',
    description: 'Terms of service for websites and applications',
    icon: FileCheck,
    sections: ['Acceptance', 'User Obligations', 'Intellectual Property', 'Limitation of Liability', 'Dispute Resolution'],
    variables: ['companyName', 'serviceDescription', 'jurisdiction', 'contactEmail']
  },
  {
    id: 'partnership-agreement',
    name: 'Partnership Agreement',
    category: 'Partnership',
    description: 'Agreement for business partnerships and joint ventures',
    icon: HeartHandshake,
    sections: ['Parties', 'Partnership Structure', 'Contributions', 'Profit Sharing', 'Management', 'Dissolution'],
    variables: ['partner1', 'partner2', 'partnershipType', 'contribution1', 'contribution2']
  },
  {
    id: 'consultant-agreement',
    name: 'Consultant Agreement',
    category: 'Employment',
    description: 'Independent contractor agreement for consultants and freelancers',
    icon: Users,
    sections: ['Services', 'Compensation', 'Term', 'Intellectual Property', 'Confidentiality', 'Termination'],
    variables: ['consultantName', 'companyName', 'services', 'rate', 'paymentTerms']
  },
  {
    id: 'advisor-agreement',
    name: 'Advisor Agreement',
    category: 'Advisory',
    description: 'Agreement for advisory board members and advisors',
    icon: Users,
    sections: ['Advisory Role', 'Compensation', 'Equity', 'Term', 'Confidentiality', 'Non-Compete'],
    variables: ['advisorName', 'companyName', 'advisoryRole', 'equity', 'term']
  },
  {
    id: 'ip-assignment',
    name: 'IP Assignment Agreement',
    category: 'Intellectual Property',
    description: 'Assignment of intellectual property rights to the company',
    icon: FileCheck,
    sections: ['Assignment', 'Consideration', 'Warranties', 'Future Inventions', 'Enforcement'],
    variables: ['assignor', 'assignee', 'ipDescription', 'consideration']
  },
  {
    id: 'vendor-agreement',
    name: 'Vendor Agreement',
    category: 'Business',
    description: 'Agreement with vendors and suppliers',
    icon: HeartHandshake,
    sections: ['Services/Products', 'Pricing', 'Delivery', 'Payment Terms', 'Warranties', 'Termination'],
    variables: ['vendorName', 'companyName', 'services', 'pricing', 'paymentTerms']
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    category: 'Business',
    description: 'Agreement for providing services to clients',
    icon: Briefcase,
    sections: ['Services Description', 'Scope of Work', 'Payment Terms', 'Timeline', 'Deliverables', 'Termination'],
    variables: ['clientName', 'companyName', 'serviceDescription', 'paymentAmount', 'paymentSchedule']
  },
  {
    id: 'software-license',
    name: 'Software License Agreement',
    category: 'Intellectual Property',
    description: 'License agreement for software products and services',
    icon: Code,
    sections: ['Grant of License', 'License Restrictions', 'Intellectual Property', 'Support & Maintenance', 'Termination', 'Limitation of Liability'],
    variables: ['licensee', 'licensor', 'softwareName', 'licenseType', 'term']
  },
  {
    id: 'customer-agreement',
    name: 'Customer Agreement',
    category: 'Business',
    description: 'Agreement with customers for products or services',
    icon: ShoppingCart,
    sections: ['Products/Services', 'Pricing', 'Payment Terms', 'Delivery', 'Warranties', 'Returns & Refunds'],
    variables: ['customerName', 'companyName', 'products', 'pricing', 'paymentTerms']
  },
  {
    id: 'equity-grant',
    name: 'Equity Grant Agreement',
    category: 'Founder',
    description: 'Stock option or equity grant agreement for employees',
    icon: TrendingUp,
    sections: ['Grant Details', 'Vesting Schedule', 'Exercise Terms', 'Termination Provisions', 'Tax Implications', 'Transfer Restrictions'],
    variables: ['employeeName', 'companyName', 'grantAmount', 'vestingPeriod', 'exercisePrice']
  },
  {
    id: 'board-resolution',
    name: 'Board Resolution',
    category: 'Compliance',
    description: 'Formal resolution for corporate board decisions',
    icon: FileCheck,
    sections: ['Resolution Title', 'Background', 'Resolution Text', 'Voting Record', 'Effective Date', 'Signatures'],
    variables: ['resolutionTitle', 'companyName', 'boardDate', 'resolutionNumber']
  },
  {
    id: 'loan-agreement',
    name: 'Loan Agreement',
    category: 'Business',
    description: 'Agreement for business loans and financing',
    icon: DollarSign,
    sections: ['Loan Amount', 'Interest Rate', 'Repayment Terms', 'Collateral', 'Default Provisions', 'Prepayment'],
    variables: ['borrower', 'lender', 'loanAmount', 'interestRate', 'repaymentPeriod']
  },
  {
    id: 'lease-agreement',
    name: 'Lease Agreement',
    category: 'Business',
    description: 'Commercial lease agreement for office or retail space',
    icon: Building2,
    sections: ['Property Description', 'Lease Term', 'Rent & Fees', 'Security Deposit', 'Maintenance', 'Termination'],
    variables: ['tenantName', 'landlordName', 'propertyAddress', 'monthlyRent', 'leaseTerm']
  },
  {
    id: 'marketing-agreement',
    name: 'Marketing Agreement',
    category: 'Business',
    description: 'Agreement for marketing partnerships and collaborations',
    icon: Megaphone,
    sections: ['Marketing Services', 'Compensation', 'Intellectual Property', 'Performance Metrics', 'Term', 'Termination'],
    variables: ['marketingPartner', 'companyName', 'services', 'compensation', 'campaignDuration']
  },
  {
    id: 'reseller-agreement',
    name: 'Reseller Agreement',
    category: 'Business',
    description: 'Agreement for reseller partnerships and distribution',
    icon: Network,
    sections: ['Products', 'Territory', 'Pricing & Discounts', 'Order Process', 'Support', 'Termination'],
    variables: ['resellerName', 'companyName', 'products', 'territory', 'discountRate']
  },
  {
    id: 'data-processing',
    name: 'Data Processing Agreement',
    category: 'Compliance',
    description: 'GDPR-compliant data processing agreement',
    icon: FileLock,
    sections: ['Data Processing Details', 'Data Security', 'Data Subject Rights', 'Breach Notification', 'Data Retention', 'Audit Rights'],
    variables: ['dataController', 'dataProcessor', 'processingPurpose', 'dataCategories', 'jurisdiction']
  },
  {
    id: 'cookie-policy',
    name: 'Cookie Policy',
    category: 'Compliance',
    description: 'Cookie policy for websites and applications',
    icon: Globe,
    sections: ['What Are Cookies', 'Types of Cookies', 'How We Use Cookies', 'Third-Party Cookies', 'Managing Cookies', 'Contact'],
    variables: ['companyName', 'website', 'contactEmail', 'jurisdiction']
  },
  {
    id: 'refund-policy',
    name: 'Refund Policy',
    category: 'Compliance',
    description: 'Refund and return policy for products and services',
    icon: Receipt,
    sections: ['Refund Eligibility', 'Refund Process', 'Time Limits', 'Non-Refundable Items', 'Processing Time', 'Contact'],
    variables: ['companyName', 'refundPeriod', 'contactEmail', 'website']
  },
  {
    id: 'subscription-agreement',
    name: 'Subscription Agreement',
    category: 'Business',
    description: 'Subscription agreement for SaaS and recurring services',
    icon: CreditCard,
    sections: ['Subscription Terms', 'Billing & Payment', 'Auto-Renewal', 'Cancellation', 'Service Level', 'Limitation of Liability'],
    variables: ['subscriberName', 'companyName', 'subscriptionPlan', 'billingCycle', 'subscriptionFee']
  },
  {
    id: 'beta-testing',
    name: 'Beta Testing Agreement',
    category: 'Business',
    description: 'Agreement for beta testing programs and early access',
    icon: Package,
    sections: ['Beta Program Terms', 'Confidentiality', 'Feedback & IP', 'No Warranty', 'Termination', 'Limitation of Liability'],
    variables: ['testerName', 'companyName', 'productName', 'betaDuration', 'testScope']
  },
  {
    id: 'influencer-agreement',
    name: 'Influencer Agreement',
    category: 'Business',
    description: 'Agreement for influencer marketing partnerships',
    icon: Award,
    sections: ['Campaign Details', 'Deliverables', 'Compensation', 'Content Ownership', 'Disclosure Requirements', 'Termination'],
    variables: ['influencerName', 'companyName', 'campaignDescription', 'compensation', 'campaignDuration']
  },
  {
    id: 'stock-purchase',
    name: 'Stock Purchase Agreement',
    category: 'Founder',
    description: 'Agreement for purchasing company stock or equity',
    icon: TrendingUp,
    sections: ['Purchase Terms', 'Purchase Price', 'Payment Terms', 'Representations & Warranties', 'Closing Conditions', 'Transfer Restrictions'],
    variables: ['purchaser', 'seller', 'companyName', 'shares', 'purchasePrice']
  },
  {
    id: 'convertible-note',
    name: 'Convertible Note Agreement',
    category: 'Founder',
    description: 'Convertible note financing agreement for early-stage funding',
    icon: Coins,
    sections: ['Principal Amount', 'Interest Rate', 'Conversion Terms', 'Maturity Date', 'Conversion Events', 'Default Provisions'],
    variables: ['investor', 'companyName', 'principalAmount', 'interestRate', 'maturityDate']
  },
  {
    id: 'safe-agreement',
    name: 'SAFE Agreement',
    category: 'Founder',
    description: 'Simple Agreement for Future Equity (Y Combinator SAFE)',
    icon: Wallet,
    sections: ['Investment Amount', 'Valuation Cap', 'Discount Rate', 'Conversion Events', 'Pro Rata Rights', 'Termination'],
    variables: ['investor', 'companyName', 'investmentAmount', 'valuationCap', 'discountRate']
  },
  {
    id: 'shareholder-agreement',
    name: 'Shareholder Agreement',
    category: 'Founder',
    description: 'Agreement governing rights and obligations of shareholders',
    icon: Users,
    sections: ['Shareholder Rights', 'Voting Rights', 'Transfer Restrictions', 'Tag-Along Rights', 'Drag-Along Rights', 'Dispute Resolution'],
    variables: ['companyName', 'shareholder1', 'shareholder2', 'sharePercentage1', 'sharePercentage2']
  },
  {
    id: 'operating-agreement',
    name: 'Operating Agreement',
    category: 'Compliance',
    description: 'LLC operating agreement governing company operations',
    icon: FileText,
    sections: ['Company Formation', 'Member Contributions', 'Profit & Loss Distribution', 'Management Structure', 'Transfer of Interests', 'Dissolution'],
    variables: ['companyName', 'member1', 'member2', 'contribution1', 'contribution2']
  },
  {
    id: 'bylaws',
    name: 'Corporate Bylaws',
    category: 'Compliance',
    description: 'Corporate bylaws governing company operations and governance',
    icon: FileCheck,
    sections: ['Corporate Structure', 'Board of Directors', 'Shareholder Meetings', 'Officers', 'Stock Issuance', 'Amendments'],
    variables: ['companyName', 'stateOfIncorporation', 'numberOfDirectors']
  },
  {
    id: 'stock-option-plan',
    name: 'Stock Option Plan',
    category: 'Founder',
    description: 'Employee stock option plan and equity incentive program',
    icon: TrendingUp,
    sections: ['Plan Purpose', 'Eligible Participants', 'Option Grants', 'Vesting Schedule', 'Exercise Terms', 'Administration'],
    variables: ['companyName', 'planName', 'totalShares', 'vestingPeriod']
  },
  {
    id: 'invention-assignment',
    name: 'Invention Assignment Agreement',
    category: 'Intellectual Property',
    description: 'Assignment of inventions and intellectual property to company',
    icon: FileCheck,
    sections: ['Assignment of Inventions', 'Prior Inventions', 'Consideration', 'Assistance', 'Moral Rights', 'Enforcement'],
    variables: ['employeeName', 'companyName', 'inventionDescription', 'consideration']
  },
  {
    id: 'work-for-hire',
    name: 'Work for Hire Agreement',
    category: 'Intellectual Property',
    description: 'Agreement for work-for-hire arrangements and IP ownership',
    icon: Code,
    sections: ['Work Description', 'Ownership Rights', 'Payment Terms', 'Deliverables', 'Warranties', 'Termination'],
    variables: ['contractorName', 'companyName', 'workDescription', 'paymentAmount']
  },
  {
    id: 'independent-contractor',
    name: 'Independent Contractor Agreement',
    category: 'Employment',
    description: 'Agreement for independent contractors and freelancers',
    icon: Briefcase,
    sections: ['Services', 'Compensation', 'Term', 'Independent Contractor Status', 'Intellectual Property', 'Confidentiality'],
    variables: ['contractorName', 'companyName', 'services', 'rate', 'paymentTerms']
  },
  {
    id: 'non-compete',
    name: 'Non-Compete Agreement',
    category: 'Employment',
    description: 'Non-compete agreement restricting competitive activities',
    icon: Shield,
    sections: ['Restricted Activities', 'Geographic Scope', 'Duration', 'Consideration', 'Enforcement', 'Remedies'],
    variables: ['employeeName', 'companyName', 'restrictedPeriod', 'geographicArea']
  },
  {
    id: 'non-solicitation',
    name: 'Non-Solicitation Agreement',
    category: 'Employment',
    description: 'Agreement preventing solicitation of employees and customers',
    icon: UserX,
    sections: ['Solicitation Restrictions', 'Restricted Parties', 'Duration', 'Geographic Scope', 'Consideration', 'Enforcement'],
    variables: ['employeeName', 'companyName', 'restrictedPeriod', 'restrictedParties']
  },
  {
    id: 'settlement-agreement',
    name: 'Settlement Agreement',
    category: 'Business',
    description: 'Agreement to settle disputes and legal claims',
    icon: HeartHandshake,
    sections: ['Dispute Description', 'Settlement Terms', 'Payment Terms', 'Release of Claims', 'Confidentiality', 'Enforcement'],
    variables: ['party1', 'party2', 'disputeDescription', 'settlementAmount']
  },
  {
    id: 'license-agreement',
    name: 'License Agreement',
    category: 'Intellectual Property',
    description: 'General license agreement for intellectual property',
    icon: Key,
    sections: ['Licensed Property', 'Grant of License', 'License Restrictions', 'Royalties', 'Term', 'Termination'],
    variables: ['licensor', 'licensee', 'licensedProperty', 'royaltyRate']
  },
  {
    id: 'joint-venture',
    name: 'Joint Venture Agreement',
    category: 'Partnership',
    description: 'Agreement for joint business ventures and collaborations',
    icon: Network,
    sections: ['Joint Venture Purpose', 'Contributions', 'Profit Sharing', 'Management', 'Decision Making', 'Dissolution'],
    variables: ['party1', 'party2', 'venturePurpose', 'contribution1', 'contribution2']
  },
  {
    id: 'distribution-agreement',
    name: 'Distribution Agreement',
    category: 'Business',
    description: 'Agreement for product distribution and sales',
    icon: Truck,
    sections: ['Products', 'Territory', 'Distribution Rights', 'Pricing', 'Order Process', 'Termination'],
    variables: ['distributor', 'companyName', 'products', 'territory', 'pricing']
  },
  {
    id: 'manufacturing-agreement',
    name: 'Manufacturing Agreement',
    category: 'Business',
    description: 'Agreement for product manufacturing and production',
    icon: Factory,
    sections: ['Products', 'Specifications', 'Quantity', 'Pricing', 'Quality Standards', 'Delivery Terms'],
    variables: ['manufacturer', 'companyName', 'products', 'quantity', 'pricing']
  },
  {
    id: 'software-development',
    name: 'Software Development Agreement',
    category: 'Intellectual Property',
    description: 'Agreement for custom software development projects',
    icon: Code,
    sections: ['Project Scope', 'Deliverables', 'Timeline', 'Payment Terms', 'Intellectual Property', 'Warranties'],
    variables: ['developer', 'companyName', 'projectDescription', 'paymentAmount', 'timeline']
  },
  {
    id: 'website-terms',
    name: 'Website Terms of Use',
    category: 'Compliance',
    description: 'Terms of use for websites and online platforms',
    icon: Globe,
    sections: ['Acceptance', 'User Conduct', 'Intellectual Property', 'User Content', 'Limitation of Liability', 'Governing Law'],
    variables: ['companyName', 'website', 'jurisdiction', 'contactEmail']
  },
  {
    id: 'eula',
    name: 'End User License Agreement (EULA)',
    category: 'Compliance',
    description: 'End user license agreement for software and applications',
    icon: Code,
    sections: ['Grant of License', 'License Restrictions', 'User Obligations', 'Intellectual Property', 'Warranty Disclaimer', 'Limitation of Liability'],
    variables: ['companyName', 'softwareName', 'licenseType']
  },
  {
    id: 'api-terms',
    name: 'API Terms of Service',
    category: 'Compliance',
    description: 'Terms of service for API access and usage',
    icon: Code,
    sections: ['API Access', 'Usage Restrictions', 'Rate Limits', 'API Keys', 'Data Usage', 'Termination'],
    variables: ['companyName', 'apiName', 'rateLimit', 'contactEmail']
  },
  {
    id: 'affiliate-agreement',
    name: 'Affiliate Agreement',
    category: 'Business',
    description: 'Agreement for affiliate marketing programs',
    icon: Network,
    sections: ['Affiliate Program Terms', 'Commission Structure', 'Payment Terms', 'Promotional Materials', 'Restrictions', 'Termination'],
    variables: ['affiliateName', 'companyName', 'commissionRate', 'paymentTerms']
  },
  {
    id: 'referral-agreement',
    name: 'Referral Agreement',
    category: 'Business',
    description: 'Agreement for referral programs and partnerships',
    icon: HeartHandshake,
    sections: ['Referral Terms', 'Referral Fees', 'Qualification Criteria', 'Payment Terms', 'Exclusivity', 'Termination'],
    variables: ['referrerName', 'companyName', 'referralFee', 'qualificationCriteria']
  },
  {
    id: 'sponsorship-agreement',
    name: 'Sponsorship Agreement',
    category: 'Business',
    description: 'Agreement for event and content sponsorship',
    icon: Award,
    sections: ['Sponsorship Details', 'Sponsorship Benefits', 'Payment Terms', 'Brand Guidelines', 'Term', 'Termination'],
    variables: ['sponsorName', 'eventName', 'sponsorshipAmount', 'sponsorshipBenefits']
  },
  {
    id: 'event-agreement',
    name: 'Event Agreement',
    category: 'Business',
    description: 'Agreement for event hosting and participation',
    icon: Calendar,
    sections: ['Event Details', 'Responsibilities', 'Payment Terms', 'Cancellation Policy', 'Liability', 'Termination'],
    variables: ['eventName', 'organizer', 'venue', 'eventDate', 'paymentAmount']
  },
  {
    id: 'speaker-agreement',
    name: 'Speaker Agreement',
    category: 'Business',
    description: 'Agreement for speaking engagements and presentations',
    icon: Presentation,
    sections: ['Speaking Engagement', 'Compensation', 'Travel Arrangements', 'Content Rights', 'Cancellation', 'Termination'],
    variables: ['speakerName', 'eventName', 'speakingFee', 'eventDate']
  },
  {
    id: 'media-release',
    name: 'Media Release Form',
    category: 'Compliance',
    description: 'Release form for use of media, images, and content',
    icon: Camera,
    sections: ['Media Description', 'Usage Rights', 'Compensation', 'Release Scope', 'Term', 'Revocation'],
    variables: ['subjectName', 'companyName', 'mediaDescription', 'usageRights']
  },
  {
    id: 'photo-release',
    name: 'Photo Release Form',
    category: 'Compliance',
    description: 'Release form for use of photographs and images',
    icon: Camera,
    sections: ['Photo Description', 'Usage Rights', 'Compensation', 'Release Scope', 'Term', 'Revocation'],
    variables: ['subjectName', 'companyName', 'photoDescription', 'usageRights']
  },
  {
    id: 'volunteer-agreement',
    name: 'Volunteer Agreement',
    category: 'Employment',
    description: 'Agreement for volunteer workers and unpaid positions',
    icon: Heart,
    sections: ['Volunteer Role', 'Responsibilities', 'Time Commitment', 'Liability Waiver', 'Confidentiality', 'Termination'],
    variables: ['volunteerName', 'companyName', 'volunteerRole', 'timeCommitment']
  },
]

export default function LegalDocumentsPage() {
  const [activeTab, setActiveTab] = useState('templates')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [currentDocument, setCurrentDocument] = useState<LegalDocument | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showPreview, setShowPreview] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [documentVariables, setDocumentVariables] = useState<Record<string, string>>({})
  const [documentTitle, setDocumentTitle] = useState('')
  const [documentHistory, setDocumentHistory] = useState<Record<string, LegalDocument[]>>({})
  const [documentAnalytics, setDocumentAnalytics] = useState<Record<string, {
    views: number
    edits: number
    exports: number
    lastAccessed: string
    created: string
  }>>({})
  const [comparingDocuments, setComparingDocuments] = useState<string[]>([])
  const [documentTags, setDocumentTags] = useState<Record<string, string[]>>({})
  const [documentNotes, setDocumentNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legalDocuments')
      if (saved) {
        setDocuments(JSON.parse(saved))
      }
      const savedHistory = localStorage.getItem('legalDocumentHistory')
      if (savedHistory) {
        setDocumentHistory(JSON.parse(savedHistory))
      }
      const savedAnalytics = localStorage.getItem('legalDocumentAnalytics')
      if (savedAnalytics) {
        setDocumentAnalytics(JSON.parse(savedAnalytics))
      }
      const savedTags = localStorage.getItem('legalDocumentTags')
      if (savedTags) {
        setDocumentTags(JSON.parse(savedTags))
      }
      const savedNotes = localStorage.getItem('legalDocumentNotes')
      if (savedNotes) {
        setDocumentNotes(JSON.parse(savedNotes))
      }
    }
  }, [])

  const saveAnalytics = (docId: string, action: 'view' | 'edit' | 'export') => {
    const analytics = documentAnalytics[docId] || {
      views: 0,
      edits: 0,
      exports: 0,
      lastAccessed: new Date().toISOString(),
      created: new Date().toISOString()
    }
    
    if (action === 'view') analytics.views++
    if (action === 'edit') analytics.edits++
    if (action === 'export') analytics.exports++
    analytics.lastAccessed = new Date().toISOString()
    
    const updated = { ...documentAnalytics, [docId]: analytics }
    setDocumentAnalytics(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('legalDocumentAnalytics', JSON.stringify(updated))
    }
  }

  const saveDocumentVersion = (doc: LegalDocument) => {
    const history = documentHistory[doc.id] || []
    const newVersion = {
      ...doc,
      metadata: {
        ...doc.metadata,
        version: doc.metadata.version + 1,
        modified: new Date().toISOString()
      }
    }
    const updated = { ...documentHistory, [doc.id]: [...history, doc] }
    setDocumentHistory(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('legalDocumentHistory', JSON.stringify(updated))
    }
  }

  const categories = ['all', ...Array.from(new Set(documentTemplates.map(t => t.category)))]

  const filteredTemplates = documentTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const createDocumentFromTemplate = (templateId: string) => {
    const template = documentTemplates.find(t => t.id === templateId)
    if (!template) return

    // Generate default content for each section based on template type
    const getDefaultContent = (sectionName: string, templateId: string): string => {
      const defaults: Record<string, Record<string, string>> = {
        'founder-agreement': {
          'Parties': 'This agreement is entered into between [founder1] and [founder2] (collectively, the "Founders") for the purpose of establishing [companyName].',
          'Equity Distribution': '[founder1] shall receive [equity1]% equity and [founder2] shall receive [equity2]% equity in [companyName].',
          'Roles & Responsibilities': 'Each founder agrees to fulfill their designated roles and responsibilities as outlined in the company bylaws.',
          'Decision Making': 'Major decisions require unanimous consent of all founders.',
          'Exit Clauses': 'In the event of a founder\'s departure, equity shall vest according to the vesting schedule over [vestingPeriod] years.',
        },
        'nda': {
          'Parties': 'This Non-Disclosure Agreement is between [disclosingParty] (the "Disclosing Party") and [receivingParty] (the "Receiving Party").',
          'Confidential Information': 'Confidential information includes all non-public, proprietary information disclosed by the Disclosing Party.',
          'Obligations': 'The Receiving Party agrees to maintain confidentiality and not disclose any confidential information to third parties.',
          'Term': 'This agreement shall remain in effect for [duration] years from the date of execution.',
          'Remedies': 'Breach of this agreement may result in legal action and monetary damages.',
        },
        'privacy-policy': {
          'Information Collection': '[companyName] collects information from users of [website] including [information types] as specified in this privacy policy.',
          'Data Usage': 'Collected information is used for [purposes] including [service delivery], [communication], and [analytics] as specified.',
          'Data Sharing': '[companyName] may share information with [third parties] including [service providers], [partners], and [authorities] as necessary.',
          'User Rights': 'Users have the right to [access], [rectify], [delete], and [port] their personal data in accordance with applicable laws.',
          'Cookies': '[companyName] uses cookies and similar technologies to [purposes] as described in our Cookie Policy.',
          'Contact': 'For privacy inquiries, contact [companyName] at [contactEmail] or visit [website] for more information.',
        },
        'terms-of-service': {
          'Acceptance': 'By accessing or using [companyName]\'s services, you agree to be bound by these Terms of Service.',
          'User Obligations': 'Users agree to [obligations] including [lawful use], [accurate information], and [compliance with terms].',
          'Intellectual Property': 'All content, features, and functionality of the service are owned by [companyName] and protected by intellectual property laws.',
          'Limitation of Liability': '[companyName] is not liable for [limitations] including [indirect damages], [lost profits], or [data loss] as specified.',
          'Dispute Resolution': 'Disputes shall be resolved through [arbitration/mediation] in [jurisdiction] in accordance with applicable laws.',
        },
        'partnership-agreement': {
          'Parties': 'This partnership agreement is entered into between [partner1] and [partner2] (collectively, the "Partners").',
          'Partnership Structure': 'The partnership is structured as [partnershipType] under the laws of [jurisdiction].',
          'Contributions': 'Each partner contributes [contribution1] and [contribution2] respectively to the partnership.',
          'Profit Sharing': 'Profits and losses are shared [equally/proportionally] according to [ownership percentages/contribution ratios].',
          'Management': 'The partnership is managed by [management structure] with [decision-making process] as specified.',
          'Dissolution': 'The partnership may be dissolved upon [dissolution events] as specified in this agreement.',
        },
        'consultant-agreement': {
          'Services': '[consultantName] agrees to provide the following consulting services to [companyName]: [services].',
          'Compensation': 'Compensation for consulting services is $[rate] [per hour/per project], payable [paymentTerms] upon completion.',
          'Term': 'This consulting agreement commences on [start date] and continues until [end date] or completion of services.',
          'Intellectual Property': 'All work product and intellectual property created under this agreement is owned by [companyName].',
          'Confidentiality': 'Consultant agrees to maintain confidentiality of all proprietary information disclosed during the engagement.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice.',
        },
        'advisor-agreement': {
          'Advisory Role': '[advisorName] agrees to serve as [advisoryRole] for [companyName] under the terms of this agreement.',
          'Compensation': 'Advisor compensation includes [compensation] as specified, payable [payment schedule].',
          'Equity': 'Advisor receives [equity]% equity in [companyName], subject to [vesting schedule] as specified.',
          'Term': 'This advisory agreement is effective for [term] and may be renewed upon mutual agreement.',
          'Confidentiality': 'Advisor agrees to maintain confidentiality of all proprietary information disclosed during advisory service.',
          'Non-Compete': 'Advisor agrees not to compete with [companyName] in [restricted activities] for [restricted period] after termination.',
        },
        'ip-assignment': {
          'Assignment': '[assignor] assigns to [assignee] all right, title, and interest in [ipDescription] as specified.',
          'Consideration': 'This assignment is made in consideration of [consideration] as specified in this agreement.',
          'Warranties': 'Assignor warrants that they have full right to assign the intellectual property and that it does not infringe third-party rights.',
          'Future Inventions': 'Assignor agrees to assign all future inventions related to [field/scope] to [assignee] during [period].',
          'Enforcement': '[assignee] has the right to enforce intellectual property rights in the assigned property.',
        },
        'vendor-agreement': {
          'Services/Products': '[vendorName] agrees to provide the following services/products to [companyName]: [services].',
          'Pricing': 'Pricing for services/products is [pricing] as specified in the pricing schedule attached hereto.',
          'Delivery': 'Services/products shall be delivered [delivery terms] to [delivery location] as specified.',
          'Payment Terms': 'Payment terms are [paymentTerms] with invoices due within [payment period] days of receipt.',
          'Warranties': 'Vendor warrants that services/products meet [specifications] and [quality standards] as specified.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice for breach or as specified.',
        },
        'employment-contract': {
          'Position': '[employeeName] is employed as [position] reporting to [reportingTo] at [location].',
          'Compensation': 'The employee shall receive a base salary of $[salary] per year, payable in accordance with company payroll practices.',
          'Benefits': 'The employee is entitled to standard company benefits including health insurance, vacation days, and retirement plans.',
          'Term': 'This employment shall commence on [startDate] and continue until terminated in accordance with this agreement.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice.',
          'Non-Compete': 'The employee agrees not to compete with the company for [non-compete period] months after termination.',
        },
        'service-agreement': {
          'Services Description': '[companyName] agrees to provide the following services to [clientName]: [serviceDescription].',
          'Scope of Work': 'The scope of work includes all tasks and deliverables as outlined in the project specifications.',
          'Payment Terms': 'Payment of $[paymentAmount] shall be made according to the following schedule: [paymentSchedule].',
          'Timeline': 'Services shall be completed within the agreed timeline as specified in the project plan.',
          'Deliverables': 'All deliverables shall meet the quality standards and specifications agreed upon by both parties.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice.',
        },
        'software-license': {
          'Grant of License': '[licensor] grants [licensee] a [licenseType] license to use [softwareName] subject to the terms of this agreement.',
          'License Restrictions': 'The licensee may not copy, modify, distribute, or create derivative works of the software without prior written consent.',
          'Intellectual Property': 'All intellectual property rights in the software remain with the licensor.',
          'Support & Maintenance': 'Support and maintenance services, if included, shall be provided as specified in the service level agreement.',
          'Termination': 'This license may be terminated upon breach of terms or at the end of the license term.',
          'Limitation of Liability': 'The licensor\'s liability is limited to the amount paid for the license.',
        },
        'customer-agreement': {
          'Products/Services': '[companyName] agrees to provide the following products/services to [customerName]: [products].',
          'Pricing': 'The pricing for products/services is as follows: [pricing].',
          'Payment Terms': 'Payment terms: [paymentTerms]. All invoices are due within [payment period] days.',
          'Delivery': 'Products/services will be delivered according to the delivery schedule agreed upon by both parties.',
          'Warranties': 'Products/services are provided "as is" with standard warranties as specified in the product documentation.',
          'Returns & Refunds': 'Returns and refunds are subject to the company\'s refund policy, available upon request.',
        },
        'equity-grant': {
          'Grant Details': '[companyName] grants [employeeName] [grantAmount] shares/options under this equity grant agreement.',
          'Vesting Schedule': 'The equity shall vest over [vestingPeriod] according to the vesting schedule outlined in this agreement.',
          'Exercise Terms': 'The exercise price is $[exercisePrice] per share. Options may be exercised according to the terms specified.',
          'Termination Provisions': 'Upon termination, vested equity may be exercised within [exercise period] days, subject to the terms of this agreement.',
          'Tax Implications': 'The grantee acknowledges understanding of tax implications and agrees to consult with a tax advisor.',
          'Transfer Restrictions': 'The equity is subject to transfer restrictions and may not be transferred without company consent.',
        },
        'board-resolution': {
          'Resolution Title': 'Resolution Title: [resolutionTitle]',
          'Background': 'The board of directors of [companyName] has reviewed the matter and determined that this resolution is in the best interests of the company.',
          'Resolution Text': 'BE IT RESOLVED, that [resolution details].',
          'Voting Record': 'The resolution was approved by [vote count] votes in favor, [vote count] against, and [vote count] abstentions.',
          'Effective Date': 'This resolution shall be effective as of [boardDate].',
          'Signatures': 'This resolution is certified by the corporate secretary and signed by the board members.',
        },
        'loan-agreement': {
          'Loan Amount': '[lender] agrees to lend [borrower] the principal amount of $[loanAmount].',
          'Interest Rate': 'The loan shall bear interest at a rate of [interestRate]% per annum, compounded [compounding frequency].',
          'Repayment Terms': 'The loan shall be repaid over [repaymentPeriod] according to the repayment schedule attached hereto.',
          'Collateral': 'The loan is secured by [collateral description] as collateral.',
          'Default Provisions': 'In the event of default, the lender may accelerate the loan and exercise all remedies available at law or equity.',
          'Prepayment': 'The borrower may prepay the loan in whole or in part, subject to any prepayment penalties specified herein.',
        },
        'lease-agreement': {
          'Property Description': '[landlordName] leases to [tenantName] the property located at [propertyAddress].',
          'Lease Term': 'The lease term is [leaseTerm] months, commencing on [start date] and ending on [end date].',
          'Rent & Fees': 'Monthly rent is $[monthlyRent], payable in advance on the first day of each month. Additional fees may apply.',
          'Security Deposit': 'A security deposit of $[deposit amount] is required and will be held as security for performance of tenant obligations.',
          'Maintenance': 'Tenant is responsible for [tenant maintenance responsibilities]. Landlord is responsible for [landlord maintenance responsibilities].',
          'Termination': 'Either party may terminate this lease with [notice period] days written notice, subject to early termination provisions.',
        },
        'marketing-agreement': {
          'Marketing Services': '[marketingPartner] agrees to provide the following marketing services to [companyName]: [services].',
          'Compensation': 'Compensation for marketing services shall be [compensation], payable according to the payment schedule specified.',
          'Intellectual Property': 'All marketing materials and intellectual property created shall be owned by [companyName] upon payment.',
          'Performance Metrics': 'Performance will be measured according to the key performance indicators agreed upon by both parties.',
          'Term': 'This agreement shall remain in effect for [campaignDuration] unless terminated earlier in accordance with this agreement.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice.',
        },
        'reseller-agreement': {
          'Products': '[companyName] grants [resellerName] the right to resell the following products: [products].',
          'Territory': 'The reseller is authorized to sell products within the following territory: [territory].',
          'Pricing & Discounts': 'Reseller pricing is set at [discountRate]% discount from retail pricing, as specified in the pricing schedule.',
          'Order Process': 'All orders must be placed through the designated order process and are subject to acceptance by [companyName].',
          'Support': '[companyName] will provide [support level] support to reseller and end customers as specified.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice.',
        },
        'data-processing': {
          'Data Processing Details': '[dataProcessor] agrees to process personal data on behalf of [dataController] for the purpose of [processingPurpose].',
          'Data Security': 'The processor shall implement appropriate technical and organizational measures to ensure data security.',
          'Data Subject Rights': 'The processor shall assist the controller in responding to data subject rights requests in accordance with applicable law.',
          'Breach Notification': 'The processor shall notify the controller without undue delay of any personal data breach.',
          'Data Retention': 'Personal data shall be retained only for as long as necessary for the processing purpose.',
          'Audit Rights': 'The controller has the right to audit the processor\'s compliance with this agreement upon reasonable notice.',
        },
        'cookie-policy': {
          'What Are Cookies': 'Cookies are small text files placed on your device when you visit [website].',
          'Types of Cookies': 'We use [cookie types] including essential, functional, analytics, and marketing cookies.',
          'How We Use Cookies': 'We use cookies to [cookie purposes] including authentication, preferences, analytics, and advertising.',
          'Third-Party Cookies': 'We may use third-party cookies from [third parties] for analytics and advertising purposes.',
          'Managing Cookies': 'You can manage cookie preferences through your browser settings or our cookie consent tool.',
          'Contact': 'For questions about our cookie policy, contact us at [contactEmail].',
        },
        'refund-policy': {
          'Refund Eligibility': 'Refunds are available for [eligible items] within [refundPeriod] days of purchase, subject to the terms herein.',
          'Refund Process': 'To request a refund, contact [companyName] at [contactEmail] with your order details and reason for refund.',
          'Time Limits': 'Refund requests must be submitted within [refundPeriod] days of purchase or delivery, whichever is later.',
          'Non-Refundable Items': 'The following items are non-refundable: [non-refundable items].',
          'Processing Time': 'Refunds will be processed within [processing time] business days after approval.',
          'Contact': 'For refund inquiries, contact [companyName] at [contactEmail] or visit [website].',
        },
        'subscription-agreement': {
          'Subscription Terms': '[subscriberName] subscribes to [companyName]\'s [subscriptionPlan] plan for [billingCycle] billing.',
          'Billing & Payment': 'Subscription fee of $[subscriptionFee] will be charged [billingCycle] in advance. Payment is due on the billing date.',
          'Auto-Renewal': 'This subscription will automatically renew for successive [billingCycle] periods unless cancelled.',
          'Cancellation': 'Subscriber may cancel at any time. Cancellation takes effect at the end of the current billing period.',
          'Service Level': 'Service level commitments are as specified in the service level agreement, available upon request.',
          'Limitation of Liability': 'Company\'s liability is limited to the amount paid by subscriber in the [time period] preceding the claim.',
        },
        'beta-testing': {
          'Beta Program Terms': '[testerName] agrees to participate in [companyName]\'s beta testing program for [productName].',
          'Confidentiality': 'Tester agrees to maintain confidentiality of all beta information and not disclose to third parties.',
          'Feedback & IP': 'All feedback, suggestions, and improvements provided by tester become the property of [companyName].',
          'No Warranty': 'The beta product is provided "as is" without warranties of any kind. Tester uses at their own risk.',
          'Termination': 'Either party may terminate participation in the beta program at any time with or without notice.',
          'Limitation of Liability': '[companyName] shall not be liable for any damages arising from use of the beta product.',
        },
        'influencer-agreement': {
          'Campaign Details': '[influencerName] agrees to participate in [companyName]\'s influencer marketing campaign: [campaignDescription].',
          'Deliverables': 'Influencer shall deliver [deliverables] including [content types] on [platforms] by [deadline].',
          'Compensation': 'Compensation of [compensation] will be paid upon completion and approval of all deliverables.',
          'Content Ownership': 'All content created becomes the property of [companyName] and may be used for marketing purposes.',
          'Disclosure Requirements': 'Influencer must comply with FTC disclosure requirements and clearly disclose the partnership.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice.',
        },
        'stock-purchase': {
          'Purchase Terms': '[purchaser] agrees to purchase [shares] shares of [companyName] from [seller] under the terms of this agreement.',
          'Purchase Price': 'The purchase price is $[purchasePrice] per share, for a total purchase price of $[totalPrice].',
          'Payment Terms': 'Payment shall be made [payment terms] upon execution of this agreement and satisfaction of closing conditions.',
          'Representations & Warranties': 'Each party represents and warrants that they have full authority to enter into this agreement.',
          'Closing Conditions': 'Closing is subject to satisfaction of all conditions precedent as specified in this agreement.',
          'Transfer Restrictions': 'The shares are subject to transfer restrictions and may not be transferred without company consent.',
        },
        'convertible-note': {
          'Principal Amount': '[investor] agrees to lend [companyName] the principal amount of $[principalAmount].',
          'Interest Rate': 'The note shall bear interest at a rate of [interestRate]% per annum, [simple/compound] interest.',
          'Conversion Terms': 'The note shall convert into equity upon [conversion events] at a conversion price determined by the conversion terms.',
          'Maturity Date': 'The note matures on [maturityDate], at which time it must be repaid or converted according to the terms herein.',
          'Conversion Events': 'Conversion events include [qualifying financing], [sale of company], or [maturity date], as specified.',
          'Default Provisions': 'In the event of default, the investor may accelerate the note and exercise all remedies available.',
        },
        'safe-agreement': {
          'Investment Amount': '[investor] agrees to invest $[investmentAmount] in [companyName] under this SAFE agreement.',
          'Valuation Cap': 'The SAFE includes a valuation cap of $[valuationCap], which limits the conversion price.',
          'Discount Rate': 'The SAFE includes a [discountRate]% discount on the conversion price at the next equity financing.',
          'Conversion Events': 'The SAFE converts into equity upon [qualifying financing], [liquidity event], or [dissolution event].',
          'Pro Rata Rights': 'The investor has [pro rata rights] to participate in future financing rounds to maintain ownership percentage.',
          'Termination': 'This SAFE terminates upon conversion, repayment, or dissolution of the company.',
        },
        'shareholder-agreement': {
          'Shareholder Rights': 'Shareholders have the right to [voting rights], [information rights], and [inspection rights] as specified.',
          'Voting Rights': 'Voting rights are allocated according to share ownership, with [voting threshold] required for major decisions.',
          'Transfer Restrictions': 'Shares may not be transferred without [right of first refusal] and [board approval] as specified.',
          'Tag-Along Rights': 'Minority shareholders have tag-along rights to participate in sales by majority shareholders.',
          'Drag-Along Rights': 'Majority shareholders have drag-along rights to require minority shareholders to participate in sales.',
          'Dispute Resolution': 'Disputes shall be resolved through [arbitration/mediation] in accordance with the dispute resolution provisions.',
        },
        'operating-agreement': {
          'Company Formation': '[companyName] is formed as a limited liability company under the laws of [state].',
          'Member Contributions': 'Members contribute [contribution1] and [contribution2] respectively, as specified in the capital accounts.',
          'Profit & Loss Distribution': 'Profits and losses are distributed [equally/proportionally] among members according to their ownership percentages.',
          'Management Structure': 'The company is managed by [members/managers] as specified in this operating agreement.',
          'Transfer of Interests': 'Member interests may not be transferred without [unanimous consent/board approval] as specified.',
          'Dissolution': 'The company may be dissolved upon [dissolution events] as specified in this agreement.',
        },
        'bylaws': {
          'Corporate Structure': '[companyName] is a [corporation type] incorporated under the laws of [stateOfIncorporation].',
          'Board of Directors': 'The board consists of [numberOfDirectors] directors, elected by shareholders at annual meetings.',
          'Shareholder Meetings': 'Annual shareholder meetings shall be held [time/location] with [notice period] days advance notice.',
          'Officers': 'The corporation shall have [officers] including President, Secretary, and Treasurer, appointed by the board.',
          'Stock Issuance': 'Stock may be issued by the board of directors in accordance with the articles of incorporation.',
          'Amendments': 'These bylaws may be amended by [shareholder vote/board resolution] as specified.',
        },
        'stock-option-plan': {
          'Plan Purpose': 'The [planName] is established to provide equity incentives to employees, advisors, and consultants of [companyName].',
          'Eligible Participants': 'Eligible participants include [employees], [advisors], [consultants], and [directors] as determined by the board.',
          'Option Grants': 'Options may be granted for up to [totalShares] shares, subject to board approval and plan limits.',
          'Vesting Schedule': 'Options vest over [vestingPeriod] according to the vesting schedule specified in each grant agreement.',
          'Exercise Terms': 'Options may be exercised at the exercise price specified in the grant, subject to vesting and plan terms.',
          'Administration': 'The plan is administered by the board of directors or a designated committee.',
        },
        'invention-assignment': {
          'Assignment of Inventions': '[employeeName] assigns to [companyName] all right, title, and interest in inventions created during employment.',
          'Prior Inventions': 'Prior inventions are listed in Exhibit A and excluded from this assignment.',
          'Consideration': 'This assignment is made in consideration of [consideration] and continued employment.',
          'Assistance': 'Employee agrees to assist in securing patents and intellectual property rights for assigned inventions.',
          'Moral Rights': 'To the extent permitted by law, employee waives moral rights in assigned inventions.',
          'Enforcement': 'Company has the right to enforce intellectual property rights in assigned inventions.',
        },
        'work-for-hire': {
          'Work Description': '[contractorName] agrees to create the following work for [companyName]: [workDescription].',
          'Ownership Rights': 'All work created under this agreement is considered "work made for hire" and owned by [companyName].',
          'Payment Terms': 'Payment of $[paymentAmount] shall be made [payment schedule] upon completion and acceptance of deliverables.',
          'Deliverables': 'Deliverables include [deliverables] to be completed by [deadline] according to specifications.',
          'Warranties': 'Contractor warrants that the work is original, does not infringe third-party rights, and meets specifications.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice.',
        },
        'independent-contractor': {
          'Services': '[contractorName] agrees to provide the following services to [companyName]: [services].',
          'Compensation': 'Compensation is $[rate] [per hour/per project], payable [paymentTerms] upon completion of services.',
          'Term': 'This agreement commences on [start date] and continues until [end date] or termination.',
          'Independent Contractor Status': 'Contractor is an independent contractor, not an employee, and is responsible for taxes and benefits.',
          'Intellectual Property': 'All work product and intellectual property created under this agreement is owned by [companyName].',
          'Confidentiality': 'Contractor agrees to maintain confidentiality of all proprietary information disclosed during the engagement.',
        },
        'non-compete': {
          'Restricted Activities': '[employeeName] agrees not to engage in [restricted activities] that compete with [companyName].',
          'Geographic Scope': 'This restriction applies within [geographicArea] for the duration specified.',
          'Duration': 'The non-compete restriction applies for [restrictedPeriod] months after termination of employment.',
          'Consideration': 'This restriction is supported by consideration including [employment/compensation/equity] as specified.',
          'Enforcement': 'Company may seek injunctive relief and damages for breach of this non-compete agreement.',
          'Remedies': 'Remedies for breach include [injunctive relief], [monetary damages], and [attorney fees] as specified.',
        },
        'non-solicitation': {
          'Solicitation Restrictions': '[employeeName] agrees not to solicit [restrictedParties] for [restricted period] after termination.',
          'Restricted Parties': 'Restricted parties include [employees], [customers], [vendors], and [partners] of [companyName].',
          'Duration': 'The non-solicitation restriction applies for [restrictedPeriod] months after termination of employment.',
          'Geographic Scope': 'This restriction applies [globally/within geographic area] as specified.',
          'Consideration': 'This restriction is supported by consideration including [employment/compensation/equity] as specified.',
          'Enforcement': 'Company may seek injunctive relief and damages for breach of this non-solicitation agreement.',
        },
        'settlement-agreement': {
          'Dispute Description': 'This agreement settles the dispute between [party1] and [party2] regarding [disputeDescription].',
          'Settlement Terms': 'The parties agree to settle all claims for [settlementAmount] and other terms as specified herein.',
          'Payment Terms': 'Payment of $[settlementAmount] shall be made [payment schedule] as specified in this agreement.',
          'Release of Claims': 'Each party releases the other from all claims, known and unknown, arising from the dispute.',
          'Confidentiality': 'The terms of this settlement are confidential and may not be disclosed except as required by law.',
          'Enforcement': 'This agreement may be enforced through [arbitration/court] in accordance with the governing law.',
        },
        'license-agreement': {
          'Licensed Property': '[licensor] grants [licensee] a license to use [licensedProperty] under the terms of this agreement.',
          'Grant of License': 'The license is [exclusive/non-exclusive], [worldwide/territory-specific], for [license purpose].',
          'License Restrictions': 'The license is subject to restrictions including [restrictions] as specified in this agreement.',
          'Royalties': 'Licensee shall pay royalties of [royaltyRate]% of [revenue/net sales] as specified in the payment terms.',
          'Term': 'This license is effective for [term] and may be renewed upon mutual agreement of the parties.',
          'Termination': 'Either party may terminate this license with [notice period] days written notice for breach or as specified.',
        },
        'joint-venture': {
          'Joint Venture Purpose': '[party1] and [party2] form a joint venture for the purpose of [venturePurpose].',
          'Contributions': 'Each party contributes [contribution1] and [contribution2] respectively to the joint venture.',
          'Profit Sharing': 'Profits and losses are shared [equally/proportionally] according to [contribution percentages/ownership].',
          'Management': 'The joint venture is managed by [management structure] as specified in this agreement.',
          'Decision Making': 'Major decisions require [unanimous consent/majority vote] of the joint venture parties.',
          'Dissolution': 'The joint venture may be dissolved upon [dissolution events] as specified in this agreement.',
        },
        'distribution-agreement': {
          'Products': '[companyName] grants [distributor] the right to distribute the following products: [products].',
          'Territory': 'Distribution rights are granted for the following territory: [territory].',
          'Distribution Rights': 'Distributor has [exclusive/non-exclusive] rights to distribute products in the specified territory.',
          'Pricing': 'Distributor pricing is set at [pricing] with [discount/terms] as specified in the pricing schedule.',
          'Order Process': 'All orders must be placed through [order process] and are subject to acceptance by [companyName].',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice.',
        },
        'manufacturing-agreement': {
          'Products': '[manufacturer] agrees to manufacture the following products for [companyName]: [products].',
          'Specifications': 'Products must meet the specifications and quality standards as specified in the product specifications.',
          'Quantity': 'Manufacturer agrees to produce [quantity] units according to the production schedule.',
          'Pricing': 'Manufacturing price is $[pricing] per unit, with [payment terms] as specified.',
          'Quality Standards': 'Products must meet [quality standards] and pass [inspection/testing] before delivery.',
          'Delivery Terms': 'Products shall be delivered [delivery terms] to [delivery location] as specified.',
        },
        'software-development': {
          'Project Scope': '[developer] agrees to develop [projectDescription] for [companyName] according to the project specifications.',
          'Deliverables': 'Deliverables include [deliverables] to be completed by [deadline] according to the project timeline.',
          'Timeline': 'The project shall be completed within [timeline] with milestones as specified in the project plan.',
          'Payment Terms': 'Payment of $[paymentAmount] shall be made [payment schedule] upon completion of milestones.',
          'Intellectual Property': 'All intellectual property in the developed software is owned by [companyName] upon payment.',
          'Warranties': 'Developer warrants that the software meets specifications, is free from defects, and does not infringe third-party rights.',
        },
        'website-terms': {
          'Acceptance': 'By accessing [website], users agree to be bound by these Terms of Use.',
          'User Conduct': 'Users agree not to [prohibited activities] and to use the website in accordance with applicable laws.',
          'Intellectual Property': 'All content on [website] is owned by [companyName] and protected by intellectual property laws.',
          'User Content': 'Users grant [companyName] a license to use, modify, and display user-generated content.',
          'Limitation of Liability': '[companyName] is not liable for [limitations] as specified in this agreement.',
          'Governing Law': 'These terms are governed by the laws of [jurisdiction] and disputes shall be resolved [dispute resolution method].',
        },
        'eula': {
          'Grant of License': '[companyName] grants you a [licenseType] license to use [softwareName] subject to the terms of this EULA.',
          'License Restrictions': 'You may not [copy], [modify], [distribute], or [reverse engineer] the software without permission.',
          'User Obligations': 'You agree to use the software only for lawful purposes and in accordance with this EULA.',
          'Intellectual Property': 'All intellectual property rights in [softwareName] remain with [companyName].',
          'Warranty Disclaimer': 'The software is provided "as is" without warranties of any kind, express or implied.',
          'Limitation of Liability': '[companyName]\'s liability is limited to the amount paid for the software license.',
        },
        'api-terms': {
          'API Access': '[companyName] grants you access to the [apiName] API subject to the terms of this agreement.',
          'Usage Restrictions': 'API usage is subject to restrictions including [rate limits], [usage limits], and [prohibited uses].',
          'Rate Limits': 'API access is limited to [rateLimit] requests per [time period] as specified.',
          'API Keys': 'API access requires valid API keys, which must be kept confidential and not shared with third parties.',
          'Data Usage': 'Data accessed through the API may only be used for [permitted purposes] as specified.',
          'Termination': '[companyName] may terminate API access at any time with or without notice for breach of terms.',
        },
        'affiliate-agreement': {
          'Affiliate Program Terms': '[affiliateName] is accepted into [companyName]\'s affiliate program under the terms of this agreement.',
          'Commission Structure': 'Affiliate earns [commissionRate]% commission on [qualified sales] generated through affiliate links.',
          'Payment Terms': 'Commissions are paid [payment schedule] after [payment threshold] is reached, subject to verification.',
          'Promotional Materials': 'Affiliate may use [promotional materials] provided by [companyName] in accordance with brand guidelines.',
          'Restrictions': 'Affiliate agrees not to [prohibited activities] including [spam], [fraud], or [misrepresentation].',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice.',
        },
        'referral-agreement': {
          'Referral Terms': '[referrerName] agrees to refer potential customers to [companyName] under the terms of this agreement.',
          'Referral Fees': 'Referrer earns $[referralFee] for each [qualified referral] that results in [conversion criteria].',
          'Qualification Criteria': 'Referrals must meet [qualificationCriteria] to qualify for referral fees.',
          'Payment Terms': 'Referral fees are paid [payment schedule] after [verification period] and confirmation of qualification.',
          'Exclusivity': '[Exclusivity terms] apply to referrals as specified in this agreement.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice.',
        },
        'sponsorship-agreement': {
          'Sponsorship Details': '[sponsorName] agrees to sponsor [eventName] under the terms of this sponsorship agreement.',
          'Sponsorship Benefits': 'Sponsor receives [sponsorshipBenefits] including [benefits] as specified in the sponsorship package.',
          'Payment Terms': 'Sponsorship fee of $[sponsorshipAmount] is payable [payment schedule] as specified.',
          'Brand Guidelines': 'Sponsor must comply with [brand guidelines] and [usage restrictions] for sponsor branding.',
          'Term': 'This sponsorship is effective for [term] and covers [event dates] as specified.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice for breach.',
        },
        'event-agreement': {
          'Event Details': '[eventName] is organized by [organizer] and will be held at [venue] on [eventDate].',
          'Responsibilities': 'Each party\'s responsibilities include [responsibilities] as specified in this agreement.',
          'Payment Terms': 'Payment of $[paymentAmount] is due [payment schedule] as specified in the payment terms.',
          'Cancellation Policy': 'Cancellation is subject to [cancellation policy] with [refund terms] as specified.',
          'Liability': 'Liability is limited as specified, with [insurance requirements] and [liability waivers] as applicable.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice for breach.',
        },
        'speaker-agreement': {
          'Speaking Engagement': '[speakerName] agrees to speak at [eventName] on [eventDate] under the terms of this agreement.',
          'Compensation': 'Speaker compensation is $[speakingFee] plus [travel expenses/other benefits] as specified.',
          'Travel Arrangements': 'Travel arrangements including [transportation], [accommodation], and [meals] are [provided/reimbursed] as specified.',
          'Content Rights': '[companyName] has the right to [record], [stream], and [distribute] the presentation as specified.',
          'Cancellation': 'Cancellation is subject to [cancellation policy] with [penalties/refunds] as specified.',
          'Termination': 'Either party may terminate this agreement with [notice period] days written notice for breach.',
        },
        'media-release': {
          'Media Description': '[subjectName] grants [companyName] the right to use [mediaDescription] as specified in this release.',
          'Usage Rights': '[companyName] may use the media for [usageRights] including [purposes] as specified.',
          'Compensation': 'Compensation for this release is [compensation] as specified, if applicable.',
          'Release Scope': 'This release covers [scope] including [uses] and [distribution channels] as specified.',
          'Term': 'This release is effective [term] and may be [revocable/non-revocable] as specified.',
          'Revocation': '[Revocation terms] apply to this release as specified, if applicable.',
        },
        'photo-release': {
          'Photo Description': '[subjectName] grants [companyName] the right to use [photoDescription] as specified in this release.',
          'Usage Rights': '[companyName] may use the photos for [usageRights] including [purposes] as specified.',
          'Compensation': 'Compensation for this release is [compensation] as specified, if applicable.',
          'Release Scope': 'This release covers [scope] including [uses] and [distribution channels] as specified.',
          'Term': 'This release is effective [term] and may be [revocable/non-revocable] as specified.',
          'Revocation': '[Revocation terms] apply to this release as specified, if applicable.',
        },
        'volunteer-agreement': {
          'Volunteer Role': '[volunteerName] agrees to volunteer as [volunteerRole] for [companyName] under the terms of this agreement.',
          'Responsibilities': 'Volunteer responsibilities include [responsibilities] as specified in the volunteer position description.',
          'Time Commitment': 'Volunteer commits to [timeCommitment] hours per [time period] as specified.',
          'Liability Waiver': 'Volunteer acknowledges and waives liability for [risks] associated with volunteer activities.',
          'Confidentiality': 'Volunteer agrees to maintain confidentiality of all proprietary information accessed during volunteer service.',
          'Termination': 'Either party may terminate this volunteer agreement at any time with or without notice.',
        },
      }

      return defaults[templateId]?.[sectionName] || `[${sectionName} content - customize as needed]`
    }

    const sections: DocumentSection[] = template.sections.map((section, idx) => ({
      id: Date.now().toString() + idx,
      title: section,
      content: getDefaultContent(section, templateId),
      order: idx,
    }))

    const variables: Record<string, string> = {}
    template.variables.forEach(variable => {
      variables[variable] = ''
    })

    const newDocument: LegalDocument = {
      id: Date.now().toString(),
      type: templateId,
      title: `${template.name} - ${new Date().toLocaleDateString()}`,
      sections,
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: 1,
        status: 'draft',
      },
      variables,
    }

    setDocuments([...documents, newDocument])
    setCurrentDocument(newDocument)
    setDocumentTitle(newDocument.title)
    setDocumentVariables(newDocument.variables)
    setSelectedTemplate(templateId)
    setActiveTab('editor')
    localStorage.setItem('legalDocuments', JSON.stringify([...documents, newDocument]))
    showToast('Document created!', 'success')
  }

  const saveDocument = () => {
    if (!currentDocument) return

    // Save current version to history before updating
    saveDocumentVersion(currentDocument)

    const updated = {
      ...currentDocument,
      title: documentTitle || currentDocument.title,
      variables: documentVariables,
      sections: currentDocument.sections,
      metadata: {
        ...currentDocument.metadata,
        modified: new Date().toISOString(),
      },
    }

    const updatedDocuments = documents.map(d => d.id === updated.id ? updated : d)
    setDocuments(updatedDocuments)
    setCurrentDocument(updated)
    localStorage.setItem('legalDocuments', JSON.stringify(updatedDocuments))
    showToast('Document saved!', 'success')
  }

  const updateSection = (sectionId: string, content: string) => {
    if (!currentDocument) return

    const updatedSections = currentDocument.sections.map(s =>
      s.id === sectionId ? { ...s, content } : s
    )
    saveAnalytics(currentDocument.id, 'edit')

    setCurrentDocument({
      ...currentDocument,
      sections: updatedSections,
      metadata: {
        ...currentDocument.metadata,
        modified: new Date().toISOString(),
      },
    })
  }

  const addSection = () => {
    if (!currentDocument) return

    const newSection: DocumentSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
      order: currentDocument.sections.length,
    }

    setCurrentDocument({
      ...currentDocument,
      sections: [...currentDocument.sections, newSection],
    })
    setEditingSection(newSection.id)
    showToast('Section added!', 'success')
  }

  const deleteSection = (sectionId: string) => {
    if (!currentDocument) return

    setCurrentDocument({
      ...currentDocument,
      sections: currentDocument.sections.filter(s => s.id !== sectionId),
    })
    showToast('Section removed', 'info')
  }

  const generateDocument = () => {
    if (!currentDocument) return

    let documentText = `${currentDocument.title}\n`
    documentText += '='.repeat(50) + '\n\n'

    currentDocument.sections.forEach((section, idx) => {
      documentText += `${idx + 1}. ${section.title}\n`
      documentText += '-'.repeat(30) + '\n'
      
      let content = section.content
      // Replace variables
      Object.entries(documentVariables).forEach(([key, value]) => {
        content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`)
      })
      
      documentText += content + '\n\n'
    })

    documentText += '\n' + '='.repeat(50) + '\n'
    documentText += `Generated on ${new Date().toLocaleDateString()}\n`
    documentText += `Version ${currentDocument.metadata.version}\n`

    return documentText
  }

  const exportToPDF = () => {
    if (!currentDocument) {
      showToast('No document to export', 'error')
      return
    }
    saveAnalytics(currentDocument.id, 'export')

    const documentText = generateDocument()
    const blob = new Blob([documentText || ''], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentDocument.title.replace(/\s+/g, '-')}.txt`
    a.click()
    showToast('Document exported!', 'success')
  }

  const exportToWord = () => {
    if (!currentDocument) {
      showToast('No document to export', 'error')
      return
    }
    saveAnalytics(currentDocument.id, 'export')

    const documentText = generateDocument()
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${currentDocument.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { color: #666; margin-top: 30px; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <h1>${currentDocument.title}</h1>
  ${currentDocument.sections.map((section, idx) => {
    let content = section.content
    Object.entries(documentVariables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`)
    })
    return `<h2>${idx + 1}. ${section.title}</h2><p>${content.replace(/\n/g, '<br>')}</p>`
  }).join('')}
  <hr>
  <p><small>Generated on ${new Date().toLocaleDateString()} | Version ${currentDocument.metadata.version}</small></p>
</body>
</html>
    `

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentDocument.title.replace(/\s+/g, '-')}.html`
    a.click()
    showToast('Document exported as HTML!', 'success')
  }

  const printDocument = () => {
    if (!currentDocument) {
      showToast('No document to print', 'error')
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      showToast('Please allow popups to print', 'error')
      return
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${currentDocument.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { color: #666; margin-top: 30px; }
    p { line-height: 1.6; }
    @media print {
      body { margin: 0; padding: 20px; }
    }
  </style>
</head>
<body>
  <h1>${currentDocument.title}</h1>
  ${currentDocument.sections.map((section, idx) => {
    let content = section.content
    Object.entries(documentVariables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`)
    })
    return `<h2>${idx + 1}. ${section.title}</h2><p>${content.replace(/\n/g, '<br>')}</p>`
  }).join('')}
  <hr>
  <p><small>Generated on ${new Date().toLocaleDateString()} | Version ${currentDocument.metadata.version}</small></p>
</body>
</html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      showToast('Print dialog opened!', 'success')
    }, 250)
  }

  const shareDocument = () => {
    if (!currentDocument) {
      showToast('No document to share', 'error')
      return
    }

    const documentText = generateDocument()
    const shareData = {
      title: currentDocument.title,
      text: (documentText || '').substring(0, 500) + '...',
      url: window.location.href,
    }

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(documentText || '')
        showToast('Document copied to clipboard!', 'success')
      })
    } else {
      navigator.clipboard.writeText(documentText || '')
      showToast('Document copied to clipboard!', 'success')
    }
  }

  const importDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.id && data.type && data.sections) {
          const importedDoc: LegalDocument = {
            ...data,
            id: Date.now().toString(),
            metadata: {
              ...data.metadata,
              created: new Date().toISOString(),
              modified: new Date().toISOString(),
            },
          }
          setDocuments([...documents, importedDoc])
          setCurrentDocument(importedDoc)
          setDocumentTitle(importedDoc.title)
          setDocumentVariables(importedDoc.variables)
          setSelectedTemplate(importedDoc.type)
          setActiveTab('editor')
          localStorage.setItem('legalDocuments', JSON.stringify([...documents, importedDoc]))
          showToast('Document imported successfully!', 'success')
        } else {
          showToast('Invalid document format', 'error')
        }
      } catch (error) {
        showToast('Error importing document. Please check file format.', 'error')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const exportDocumentJSON = () => {
    if (!currentDocument) {
      showToast('No document to export', 'error')
      return
    }
    saveAnalytics(currentDocument.id, 'export')

    const data = JSON.stringify(currentDocument, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentDocument.title.replace(/\s+/g, '-')}.json`
    a.click()
    showToast('Document exported as JSON!', 'success')
  }

  const reorderSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!currentDocument) return

    const index = currentDocument.sections.findIndex(s => s.id === sectionId)
    if (index === -1) return

    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === currentDocument.sections.length - 1) return

    const newSections = [...currentDocument.sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]

    // Update order
    newSections.forEach((s, idx) => {
      s.order = idx
    })

    setCurrentDocument({
      ...currentDocument,
      sections: newSections,
    })
    showToast('Section reordered!', 'success')
  }

  const createNewVersion = () => {
    if (!currentDocument) return

    const newVersion: LegalDocument = {
      ...currentDocument,
      id: Date.now().toString(),
      metadata: {
        ...currentDocument.metadata,
        version: currentDocument.metadata.version + 1,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      },
    }

    setDocuments([...documents, newVersion])
    setCurrentDocument(newVersion)
    localStorage.setItem('legalDocuments', JSON.stringify([...documents, newVersion]))
    showToast('New version created!', 'success')
  }

  const duplicateDocument = (doc: LegalDocument) => {
    const duplicated: LegalDocument = {
      ...doc,
      id: Date.now().toString(),
      title: `${doc.title} (Copy)`,
      metadata: {
        ...doc.metadata,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: 1,
      },
    }

    setDocuments([...documents, duplicated])
    localStorage.setItem('legalDocuments', JSON.stringify([...documents, duplicated]))
    showToast('Document duplicated!', 'success')
  }

  const deleteDocument = (docId: string) => {
    const updated = documents.filter(d => d.id !== docId)
    setDocuments(updated)
    localStorage.setItem('legalDocuments', JSON.stringify(updated))
    if (currentDocument?.id === docId) {
      setCurrentDocument(null)
      setActiveTab('templates')
    }
    showToast('Document deleted', 'info')
  }

  const loadDocument = (doc: LegalDocument) => {
    setCurrentDocument(doc)
    setDocumentTitle(doc.title)
    setDocumentVariables(doc.variables)
    setSelectedTemplate(doc.type)
    setActiveTab('editor')
    saveAnalytics(doc.id, 'view')
    showToast('Document loaded!', 'success')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary-500 to-growthlab-slate bg-clip-text text-transparent">
              Legal Document Generator
            </span>
          </h1>
          <p className="text-lg text-gray-600">
                Create, customize, and manage legal documents for your startup
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {currentDocument && (
                <>
                  <Button variant="outline" size="sm" onClick={saveDocument}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Edit' : 'Preview'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportToWord}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export Word
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportDocumentJSON}>
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={printDocument}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareDocument}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={createNewVersion}>
                    <History className="h-4 w-4 mr-2" />
                    New Version
                  </Button>
                </>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={importDocument}
                  className="hidden"
                  id="import-document-input"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('import-document-input')?.click()}
                  className="font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-primary-500/30 text-primary-600 hover:bg-primary-50 hover:border-primary-500 active:bg-primary-100 focus:ring-primary-500 px-4 py-2 text-sm flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </button>
              </label>
              <Link href="/startup/legal-documents/enhanced">
                <Button size="sm">
                  <Zap className="h-4 w-4 mr-2" />
                  AI Enhanced
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <SimpleTabs
          tabs={[
            { id: 'templates', label: 'Templates', icon: BookOpen },
            { id: 'editor', label: 'Document Editor', icon: Edit },
            { id: 'documents', label: 'My Documents', icon: FileText },
            { id: 'history', label: 'History', icon: History },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'compare', label: 'Compare', icon: GitBranch },
            { id: 'quick-generators', label: 'Quick Generators', icon: Zap },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="mt-6 space-y-6">
            {/* Search and Filter */}
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="pl-10"
                  />
              </div>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  options={categories.map(cat => ({
                    value: cat,
                    label: cat === 'all' ? 'All Categories' : cat,
                  }))}
                />
              </div>
            </Card>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const IconComponent = template.icon || FileText
                if (!IconComponent) {
                  console.error(`Icon is undefined for template: ${template.id}`)
                  return null
                }
                return (
                  <Card
                    key={template.id}
                    className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="cursor-pointer" onClick={() => createDocumentFromTemplate(template.id)}>
                      <div className="bg-primary-500/10 text-primary-600 p-4 rounded-lg w-fit mb-4">
                      {React.createElement(IconComponent, { className: "h-6 w-6" })}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{template.category}</Badge>
                      <Button size="sm" variant="outline">
                        Use Template <Plus className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs font-medium text-gray-500 mb-2">Includes:</div>
                        <div className="text-xs text-gray-600">
                          {template.sections.length} sections • {template.variables.length} variables
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Document Editor Tab */}
        {activeTab === 'editor' && (
          <div className="mt-6 space-y-6">
            {!currentDocument ? (
              <Card className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Document Selected</h3>
                <p className="text-gray-600 mb-6">Select a template or create a new document to get started</p>
                <Button onClick={() => setActiveTab('templates')}>
                  Browse Templates
                </Button>
              </Card>
            ) : (
              <>
                {/* Document Header */}
                <Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                      <Input
                        value={documentTitle}
                        onChange={(e) => setDocumentTitle(e.target.value)}
                        placeholder="Enter document title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <Select
                        value={currentDocument.metadata.status}
                        onChange={(e) => {
                          setCurrentDocument({
                            ...currentDocument,
                            metadata: {
                              ...currentDocument.metadata,
                              status: e.target.value as any,
                            },
                          })
                        }}
                        options={[
                          { value: 'draft', label: 'Draft' },
                          { value: 'final', label: 'Final' },
                          { value: 'archived', label: 'Archived' },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Created: {new Date(currentDocument.metadata.created).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Modified: {new Date(currentDocument.metadata.modified).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Version: {currentDocument.metadata.version}
                    </div>
                  </div>
                </Card>

                {/* Variables */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Document Variables</h3>
                    <Badge variant="outline">
                      {Object.keys(currentDocument.variables).length} variable{Object.keys(currentDocument.variables).length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  {Object.keys(currentDocument.variables).length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No variables for this document type</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.keys(currentDocument.variables).map(key => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            {(key.includes('Name') || key.includes('Party') || key.includes('Company')) && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>
                          <Input
                            value={documentVariables[key] || ''}
                            onChange={(e) => setDocumentVariables({
                              ...documentVariables,
                              [key]: e.target.value,
                            })}
                            placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Use [<code className="bg-gray-100 px-1 rounded">{key}</code>] in content
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Document Sections */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Document Sections</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentDocument.sections.length} section{currentDocument.sections.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Button onClick={addSection} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>

                  {showPreview ? (
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                        <div className="text-center mb-8 pb-4 border-b-2 border-gray-300">
                          <h1 className="text-3xl font-bold mb-2">{documentTitle || currentDocument.title}</h1>
                          <p className="text-sm text-gray-600">
                            Generated on {new Date().toLocaleDateString()} | Version {currentDocument.metadata.version}
                          </p>
                        </div>
                        {currentDocument.sections.map((section, idx) => {
                          let content = section.content
                          Object.entries(documentVariables).forEach(([key, value]) => {
                            content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`)
                          })
                          return (
                            <div key={section.id} className="mb-8 pb-6 border-b border-gray-200 last:border-0">
                              <h4 className="text-xl font-semibold mb-3 text-primary-600">{idx + 1}. {section.title}</h4>
                              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</div>
                            </div>
                          )
                        })}
                        <div className="mt-8 pt-4 border-t-2 border-gray-300 text-center text-sm text-gray-500">
                          <p>This document was generated using GrowthLab Legal Document Generator</p>
                          <p className="mt-1">Status: {currentDocument.metadata.status.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <Button onClick={printDocument}>
                          <Printer className="h-4 w-4 mr-2" />
                          Print Document
                        </Button>
                        <Button variant="outline" onClick={exportToPDF}>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentDocument.sections.map((section, idx) => (
                        <Card key={section.id} className="relative border-l-4 border-l-primary-500">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                  {idx + 1}
                                </div>
                                {editingSection === section.id ? (
                                  <Input
                                    value={section.title}
                                    onChange={(e) => {
                                      const updated = currentDocument.sections.map(s =>
                                        s.id === section.id ? { ...s, title: e.target.value } : s
                                      )
                                      setCurrentDocument({ ...currentDocument, sections: updated })
                                    }}
                                    onBlur={() => setEditingSection(null)}
                                    onKeyPress={(e) => e.key === 'Enter' && setEditingSection(null)}
                                    className="font-semibold text-lg flex-1"
                                  />
                                ) : (
                                  <h4
                                    className="text-lg font-semibold cursor-pointer flex-1"
                                    onClick={() => setEditingSection(section.id)}
                                  >
                                    {section.title}
                                  </h4>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
              <Button 
                                variant="ghost"
                size="sm" 
                                onClick={() => reorderSection(section.id, 'up')}
                                disabled={idx === 0}
                                title="Move up"
                              >
                                ↑
              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => reorderSection(section.id, 'down')}
                                disabled={idx === currentDocument.sections.length - 1}
                                title="Move down"
                              >
                                ↓
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                                title="Edit title"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(section.content)
                                  showToast('Section copied to clipboard!', 'success')
                                }}
                                title="Copy section"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSection(section.id)}
                                title="Delete section"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <div className="relative">
                            <textarea
                              value={section.content}
                              onChange={(e) => updateSection(section.id, e.target.value)}
                              rows={8}
                              placeholder="Enter section content... Use [variableName] to insert variables."
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all resize-y font-mono text-sm"
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded">
                              {section.content.length} chars
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                            <AlertCircle className="h-3 w-3" />
                            <span>Tip: Use [variableName] format to insert variables from the Variables section above</span>
                          </div>
            </Card>
          ))}
        </div>
                  )}
                </Card>
              </>
            )}
          </div>
        )}

        {/* My Documents Tab */}
        {activeTab === 'documents' && (
          <div className="mt-6 space-y-6">
            {documents.length === 0 ? (
              <Card className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Documents Yet</h3>
                <p className="text-gray-600 mb-6">Create your first legal document using a template</p>
                <Button onClick={() => setActiveTab('templates')}>
                  Browse Templates
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc) => {
                  const template = documentTemplates.find(t => t.id === doc.type)
                  const IconComponent = template?.icon || FileText
                  if (!IconComponent) {
                    return null
                  }
                  return (
                    <Card key={doc.id} className="hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                            {React.createElement(IconComponent, { className: "h-5 w-5" })}
                          </div>
                          <div>
                            <h4 className="font-semibold">{doc.title}</h4>
                            <div className="text-xs text-gray-500 mt-1">
                              {template?.name || doc.type}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
                        <div>{doc.sections.length} sections</div>
                        <Badge variant={doc.metadata.status === 'final' ? 'new' : 'outline'}>
                          {doc.metadata.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                          onClick={() => loadDocument(doc)}
                          className="flex-1"
              >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                          onClick={() => duplicateDocument(doc)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this document?')) {
                              deleteDocument(doc.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Last modified: {new Date(doc.metadata.modified).toLocaleDateString()}
                      </div>
            </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="mt-6 space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <History className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Document History & Versions</h2>
              </div>
              {Object.keys(documentHistory).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4" />
                  <p>No document history yet. Document versions will be saved automatically.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(documentHistory).map(([docId, versions]) => {
                    const currentDoc = documents.find(d => d.id === docId)
                    if (!currentDoc) return null
                    const template = documentTemplates.find(t => t.id === currentDoc.type)
                    const IconComponent = template?.icon || FileText
                    return (
                      <Card key={docId} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary-500/10 text-primary-600 p-3 rounded-lg">
                              {React.createElement(IconComponent, { className: "h-6 w-6" })}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{currentDoc.title}</h3>
                              <p className="text-sm text-gray-600">{template?.name || currentDoc.type}</p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {versions.length} version{versions.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border-2 border-primary-200">
                            <div>
                              <div className="font-semibold">Current Version (v{currentDoc.metadata.version})</div>
                              <div className="text-sm text-gray-600">
                                Modified: {new Date(currentDoc.metadata.modified).toLocaleString()}
                              </div>
                            </div>
                            <Badge variant="new">Current</Badge>
                          </div>
                          {versions.slice().reverse().map((version, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <div>
                                <div className="font-medium">Version {version.metadata.version}</div>
                                <div className="text-sm text-gray-600">
                                  Modified: {new Date(version.metadata.modified).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Status: {version.metadata.status}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setCurrentDocument(version)
                                    setDocumentTitle(version.title)
                                    setDocumentVariables(version.variables)
                                    setActiveTab('editor')
                                    saveAnalytics(version.id, 'view')
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm('Restore this version? Current version will be saved to history.')) {
                                      saveDocumentVersion(currentDoc)
                                      setCurrentDocument(version)
                                      setDocumentTitle(version.title)
                                      setDocumentVariables(version.variables)
                                      const updated = documents.map(d => d.id === docId ? version : d)
                                      setDocuments(updated)
                                      if (typeof window !== 'undefined') {
                                        localStorage.setItem('legalDocuments', JSON.stringify(updated))
                                      }
                                      setActiveTab('editor')
                                      showToast('Version restored!', 'success')
                                    }
                                  }}
                                >
                                  <History className="h-4 w-4 mr-2" />
                                  Restore
                                </Button>
                              </div>
                            </div>
          ))}
        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="mt-6 space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Document Analytics</h2>
              </div>
              {Object.keys(documentAnalytics).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                  <p>No analytics data yet. Start using documents to see analytics.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Total Documents</div>
                      <div className="text-2xl font-bold">{documents.length}</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Total Views</div>
                      <div className="text-2xl font-bold">
                        {Object.values(documentAnalytics).reduce((sum, a) => sum + a.views, 0)}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Total Edits</div>
                      <div className="text-2xl font-bold">
                        {Object.values(documentAnalytics).reduce((sum, a) => sum + a.edits, 0)}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-gray-600 mb-1">Total Exports</div>
                      <div className="text-2xl font-bold">
                        {Object.values(documentAnalytics).reduce((sum, a) => sum + a.exports, 0)}
                      </div>
                    </Card>
                  </div>
                  <div className="space-y-4">
                    {documents.map((doc) => {
                      const analytics = documentAnalytics[doc.id]
                      if (!analytics) return null
                      const template = documentTemplates.find(t => t.id === doc.type)
                      const IconComponent = template?.icon || FileText
                      return (
                        <Card key={doc.id} className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                                {React.createElement(IconComponent, { className: "h-5 w-5" })}
                              </div>
                              <div>
                                <h4 className="font-semibold">{doc.title}</h4>
                                <p className="text-sm text-gray-600">{template?.name || doc.type}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Views</div>
                              <div className="text-xl font-bold">{analytics.views}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Edits</div>
                              <div className="text-xl font-bold">{analytics.edits}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Exports</div>
                              <div className="text-xl font-bold">{analytics.exports}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600 mb-1">Last Accessed</div>
                              <div className="text-sm font-medium">
                                {new Date(analytics.lastAccessed).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </>
              )}
            </Card>
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div className="mt-6 space-y-6">
            <Card>
              <div className="flex items-center gap-3 mb-6">
                <GitBranch className="h-6 w-6 text-primary-500" />
                <h2 className="text-2xl font-bold">Compare Documents</h2>
              </div>
              {documents.length < 2 ? (
                <div className="text-center py-12 text-gray-400">
                  <GitBranch className="h-16 w-16 mx-auto mb-4" />
                  <p>You need at least 2 documents to compare. Create more documents to use this feature.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Documents to Compare (2 documents)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc) => {
                        const isSelected = comparingDocuments.includes(doc.id)
                        const template = documentTemplates.find(t => t.id === doc.type)
                        const IconComponent = template?.icon || FileText
                        return (
                          <Card
                            key={doc.id}
                            className={`p-4 cursor-pointer transition-all ${
                              isSelected ? 'border-2 border-primary-500 bg-primary-50' : 'hover:border-primary-300'
                            }`}
                            onClick={() => {
                              if (isSelected) {
                                setComparingDocuments(comparingDocuments.filter(id => id !== doc.id))
                              } else if (comparingDocuments.length < 2) {
                                setComparingDocuments([...comparingDocuments, doc.id])
                              } else {
                                showToast('Please select only 2 documents to compare', 'error')
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-primary-500/10 text-primary-600 p-2 rounded-lg">
                                {React.createElement(IconComponent, { className: "h-5 w-5" })}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{doc.title}</h4>
                                <p className="text-sm text-gray-600">{template?.name || doc.type}</p>
                              </div>
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-primary-500" />
                              )}
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                  {comparingDocuments.length === 2 && (
                    <Card className="p-6">
                      <h3 className="font-semibold mb-4">Comparison</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {comparingDocuments.map((docId, idx) => {
                          const doc = documents.find(d => d.id === docId)
                          if (!doc) return null
                          const template = documentTemplates.find(t => t.id === doc.type)
                          return (
                            <div key={docId} className="space-y-4">
                              <div className="flex items-center gap-3 mb-4">
                                <Badge variant={idx === 0 ? 'new' : 'outline'}>
                                  Document {idx + 1}
                                </Badge>
                                <h4 className="font-semibold">{doc.title}</h4>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Type:</span> {template?.name || doc.type}
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span> {doc.metadata.status}
                                </div>
                                <div>
                                  <span className="font-medium">Version:</span> {doc.metadata.version}
                                </div>
                                <div>
                                  <span className="font-medium">Sections:</span> {doc.sections.length}
                                </div>
                                <div>
                                  <span className="font-medium">Variables:</span> {Object.keys(doc.variables).length}
                                </div>
                                <div>
                                  <span className="font-medium">Created:</span> {new Date(doc.metadata.created).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Modified:</span> {new Date(doc.metadata.modified).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="pt-4 border-t">
                                <h5 className="font-medium mb-2">Sections:</h5>
                                <div className="space-y-1">
                                  {doc.sections.map((section) => (
                                    <div key={section.id} className="text-sm text-gray-600">
                                      • {section.title}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </Card>
                  )}
                </>
              )}
            </Card>
          </div>
        )}

        {/* Quick Generators Tab */}
        {activeTab === 'quick-generators' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/startup/nda-generator">
                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <div className="bg-blue-50 text-blue-600 p-4 rounded-lg w-fit mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">NDA Generator</h3>
                  <p className="text-sm text-gray-600">Quick NDA generation</p>
                </Card>
              </Link>
              <Link href="/startup/partnership-agreement">
                <Card className="hover:shadow-lg transition-all cursor-pointer">
                  <div className="bg-green-50 text-green-600 p-4 rounded-lg w-fit mb-4">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Partnership Agreement</h3>
                  <p className="text-sm text-gray-600">Partnership agreements</p>
            </Card>
              </Link>
            </div>
        </div>
        )}
      </div>
    </main>
  )
}
