function HowItWorks() {
    return (
      <section id="howitworks" className="py-16 bg-white font-sans">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6">
            How does <span className="text-[#229799]">cashless tipping</span> work?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            If your business accepts tips, TipNex's cashless tipping platform is for you! Customers simply scan a
            QR code with their smartphone to leave a contactless tip, rating and review.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-start space-y-8 md:space-y-0 md:space-x-8">
            {[
              {
                title: 'Scan',
                description: 'Customers simply scan a QR code from their mobile phone camera to access our tipping platform. No app required!',
                image: '/placeholder.svg?height=500&width=250'
              },
              {
                title: 'Tip',
                description: 'They then choose how much tip they would like to leave and can also leave a review and rating at the same time.',
                image: '/placeholder.svg?height=500&width=250'
              },
              {
                title: 'Pay',
                description: 'The tip is sent directly to the staff member(s) with real-time notifications and they can track and view all tip transactions for full transparency.',
                image: '/placeholder.svg?height=500&width=250'
              }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center max-w-xs">
                <img src={step.image} alt={`${step.title} process`} className="w-full h-auto mb-4 rounded-lg shadow-lg" />
                <h3 className="text-2xl font-bold text-[#229799] mb-2">{step.title}</h3>
                <p className="text-center text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  export default HowItWorks