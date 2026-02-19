import HeroSection from '@/components/sections/HeroSection'
import EssentialTools from '@/components/sections/EssentialTools'
import ResourceLibrarySection from '@/components/sections/ResourceLibrarySection'
import FeaturedResourcesSection from '@/components/sections/FeaturedResourcesSection'
import AIToolsSection from '@/components/sections/AIToolsSection'
import AdvancedToolsSection from '@/components/sections/AdvancedToolsSection'
import LearningDevelopmentSection from '@/components/sections/LearningDevelopmentSection'
import CommunityNetworkingSection from '@/components/sections/CommunityNetworkingSection'
import IndustryResourcesSection from '@/components/sections/IndustryResourcesSection'
import SuccessStoriesSection from '@/components/sections/SuccessStoriesSection'
import StartupJourneySection from '@/components/sections/StartupJourneySection'
import FundingResourcesSection from '@/components/sections/FundingResourcesSection'
import TechnologySection from '@/components/sections/TechnologySection'
import MarketingSalesSection from '@/components/sections/MarketingSalesSection'
import LegalComplianceSection from '@/components/sections/LegalComplianceSection'
import AcceleratorProgramsSection from '@/components/sections/AcceleratorProgramsSection'
import ToolsSoftwareSection from '@/components/sections/ToolsSoftwareSection'
import ComprehensiveResourcesSection from '@/components/sections/ComprehensiveResourcesSection'
import TemplatesDocumentsSection from '@/components/sections/TemplatesDocumentsSection'
import LearningEducationSection from '@/components/sections/LearningEducationSection'
import ExpertHelpSection from '@/components/sections/ExpertHelpSection'
import ProfessionalServices from '@/components/sections/ProfessionalServices'
import BusinessInvestorToolsSection from '@/components/sections/BusinessInvestorToolsSection'
import MobileNavigation from '@/components/navigation/MobileNavigation'
import SectionNavigation from '@/components/navigation/SectionNavigation'

export default function StartupResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Section Navigation */}
      <SectionNavigation />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {/* Hero Section */}
        <div id="hero">
          <HeroSection />
        </div>

        {/* Quick Stats Bar */}
        <div className="mb-12 lg:mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm">
              <div className="text-3xl font-bold text-primary-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">Resources</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm">
              <div className="text-3xl font-bold text-primary-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">Tools</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm">
              <div className="text-3xl font-bold text-primary-600 mb-1">35+</div>
              <div className="text-sm text-gray-600">Guides</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm">
              <div className="text-3xl font-bold text-primary-600 mb-1">12K+</div>
              <div className="text-sm text-gray-600">Founders</div>
            </div>
          </div>
        </div>

        {/* Core Tools Section */}
        <div id="essential-tools" className="mb-16 lg:mb-24">
          <EssentialTools />
        </div>

        {/* Business & Investor Tools */}
        <div id="investor-tools" className="mb-16 lg:mb-24">
          <BusinessInvestorToolsSection />
        </div>

        {/* AI & Advanced Tools */}
        <div id="ai-tools" className="mb-16 lg:mb-24">
          <AIToolsSection />
          <div className="mt-8">
            <AdvancedToolsSection />
          </div>
        </div>

        {/* Resources Section */}
        <div id="resources" className="mb-16 lg:mb-24">
          <div className="mb-8">
            <FeaturedResourcesSection />
          </div>
          <ResourceLibrarySection />
        </div>

        {/* Funding & Investment */}
        <div id="funding" className="mb-16 lg:mb-24">
          <FundingResourcesSection />
        </div>

        {/* Startup Journey by Stage */}
        <div id="journey" className="mb-16 lg:mb-24">
          <StartupJourneySection />
        </div>

        {/* Community & Networking */}
        <div id="community" className="mb-16 lg:mb-24">
          <CommunityNetworkingSection />
        </div>

        {/* Learning & Development */}
        <div id="learning" className="mb-16 lg:mb-24">
          <LearningDevelopmentSection />
          <div className="mt-8">
            <LearningEducationSection />
          </div>
        </div>

        {/* Marketing & Sales */}
        <div id="marketing" className="mb-16 lg:mb-24">
          <MarketingSalesSection />
        </div>

        {/* Technology & Development */}
        <div id="technology" className="mb-16 lg:mb-24">
          <TechnologySection />
        </div>

        {/* Legal & Compliance */}
        <div id="legal" className="mb-16 lg:mb-24">
          <LegalComplianceSection />
        </div>

        {/* Industry Resources */}
        <div id="industry" className="mb-16 lg:mb-24">
          <IndustryResourcesSection />
        </div>

        {/* Templates & Documents */}
        <div id="templates" className="mb-16 lg:mb-24">
          <TemplatesDocumentsSection />
        </div>

        {/* Tools & Software */}
        <div id="tools-software" className="mb-16 lg:mb-24">
          <ToolsSoftwareSection />
        </div>

        {/* Accelerator Programs */}
        <div id="accelerators" className="mb-16 lg:mb-24">
          <AcceleratorProgramsSection />
        </div>

        {/* Success Stories */}
        <div id="success" className="mb-16 lg:mb-24">
          <SuccessStoriesSection />
        </div>

        {/* Expert Help & Services */}
        <div id="expert" className="mb-16 lg:mb-24">
          <ExpertHelpSection />
          <div className="mt-8">
            <ProfessionalServices />
          </div>
        </div>

        {/* Comprehensive Resources */}
        <div id="comprehensive" className="mb-16 lg:mb-24">
          <ComprehensiveResourcesSection />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  )
}
