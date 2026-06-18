import WaitlistProvider from './components/WaitlistProvider'
import Aurora from './components/Aurora'
import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import SkillsRow from './components/SkillsRow'
import WhoItsFor from './components/WhoItsFor'
import WhatSetsUsApart from './components/WhatSetsUsApart'
import WaitlistCTA from './components/WaitlistCTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <WaitlistProvider>
      {/* Sunrise over the hills — a quiet indigo → warm-sun aurora glow
          at the top, dialed down so it never competes with the content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-20"
      >
        <Aurora
          colorStops={['#2b2a6b', '#f7901e', '#2b2a6b']}
          amplitude={0.8}
          blend={0.5}
          speed={0.6}
        />
      </div>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <SkillsRow />
        <WhoItsFor />
        <WhatSetsUsApart />
        <WaitlistCTA />
      </main>
      <Footer />
    </WaitlistProvider>
  )
}
