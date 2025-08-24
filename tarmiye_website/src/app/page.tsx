import Image from 'next/image'; 
import Hero from '@/components/sections/Hero';
import ValuePropositionSection from '@/components/sections/ValuePropositionSection';
import HowItWorksSection from '@/components/sections/HowItWorksSteps';


export default function Home() {
  return (
  <>
      <Hero /> 
      <ValuePropositionSection />
      <HowItWorksSection />
      
    

    </>
  );
}