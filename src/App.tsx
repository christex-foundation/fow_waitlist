import WaitlistProvider from './components/WaitlistProvider'
import DotField from './components/DotField'
import Header from './components/Header'
import Hero from './components/Hero'
import SkillsRow from './components/SkillsRow'
import WhatSetsUsApart from './components/WhatSetsUsApart'
import WaitlistCTA from './components/WaitlistCTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <WaitlistProvider>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <DotField cursorRadius={200} bulgeStrength={26} />
      </div>
      <Header />
      <main>
        <Hero />
        <SkillsRow />
        <WhatSetsUsApart />
        <WaitlistCTA />
      </main>
      <Footer />
    </WaitlistProvider>
  )
}
