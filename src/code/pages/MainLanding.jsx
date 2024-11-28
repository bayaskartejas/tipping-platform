import React, { useState } from 'react'
import Layout from '../sections/Layout';
import Hero from '../sections/Hero';
import Features from '../sections/Features';
import FooterSection from '../sections/FooterSection';
import HowItWorks from '../sections/HowItWorks';  
import LoadingOverlay from '../components/LoadingOverlay';
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