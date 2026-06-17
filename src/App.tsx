import WaitlistProvider from './components/WaitlistProvider'
import Header from './components/Header'
import Hero from './components/Hero'
import SkillsRow from './components/SkillsRow'
import WhatSetsUsApart from './components/WhatSetsUsApart'
import WaitlistCTA from './components/WaitlistCTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <WaitlistProvider>
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
