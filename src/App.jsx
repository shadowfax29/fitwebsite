import { Glow, Nav, Progress } from './components/Chrome.jsx'
import Hero, { Marquee } from './components/Hero.jsx'
import Disciplines from './components/Disciplines.jsx'
import Lab from './components/Lab.jsx'
import Gallery from './components/Gallery.jsx'
import Coaching from './components/Coaching.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Progress />
      <Glow />
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <Disciplines />
        <Lab />
        <Gallery />
        <Coaching />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
