import React from 'react'
import Layout from './Layout';
import Hero from './Hero';
import Features from './Features';
import TestimonialSlider from './TestimonialCard';
import HowItWorks from './HowItWorks';  
function MainLanding() {
    return (
        <Layout>
          <Hero />
          <Features />
            <HowItWorks />
          <TestimonialSlider />
         </Layout>
      )
}

export default MainLanding