import React, { useState } from 'react'
import Layout from './Layout';
import Hero from './Hero';
import Features from './Features';
import FooterSection from './FooterSection';
import HowItWorks from './HowItWorks';  
import LoadingOverlay from './LoadingOverlay';
function MainLanding() {
  
    return (
        <Layout>
          <LoadingOverlay duration={500}/>
          <Hero />
          <Features />
            <HowItWorks />
            <FooterSection />
         </Layout>
      )
}

export default MainLanding