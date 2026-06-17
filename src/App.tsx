import Hero from './components/Hero'
import ValueProps from './components/ValueProps'
import HowItWorks from './components/HowItWorks'
import WaitlistForm from './components/WaitlistForm'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <ValueProps />
        <HowItWorks />
        <WaitlistForm />
      </main>
      <Footer />
    </>
  )
}
