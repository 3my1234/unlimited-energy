const services = [
  ["01", "Solar installations", "Site assessment, system design and precise installation for homes, offices and industrial facilities."],
  ["02", "Battery & backup", "High-capacity storage, intelligent power control and resilient backup for life beyond the grid."],
  ["03", "Mini-grid systems", "Scalable off-grid, grid-tied and hybrid power networks for estates, communities and enterprises."],
  ["04", "Energy advisory", "Energy audits, sustainability planning and practical strategies that reduce operating costs."],
];

const process = [
  ["Assess", "We study your site, energy use and priorities."],
  ["Design", "Our engineers specify a system built around your load."],
  ["Install", "Certified teams deliver a clean, safe installation."],
  ["Support", "Monitoring and maintenance keep performance on track."],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Unlimited Energy home">
          <span className="brand-mark">U</span>
          <span>UNLIMITED <b>ENERGY</b></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#solutions">Solutions</a>
          <a href="#process">How it works</a>
          <a href="#company">Company</a>
        </nav>
        <a className="header-cta" href="#consultation">Get a Quote</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-media" role="img" aria-label="Solar panels installed on a modern home" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow light">Clean power, engineered for you</p>
          <h1>Power without limits.</h1>
          <p className="hero-sub">Solar systems designed for Nigerian homes and businesses.</p>
        </div>
        <div className="hero-actions">
          <a className="button button-light" href="#consultation">Request an assessment</a>
          <a className="button button-glass" href="#solutions">Explore solutions</a>
        </div>
        <a className="scroll-cue" href="#intro" aria-label="Scroll to learn more">↓</a>
      </section>

      <section className="intro" id="intro">
        <p className="eyebrow">Unlimited Energy Systems Limited</p>
        <h2>Energy that works<br />when the grid doesn&apos;t.</h2>
        <p className="intro-body">We design and install intelligent solar, storage and hybrid energy systems—giving families and organisations cleaner, quieter and more dependable power.</p>
      </section>

      <section className="feature residential-gallery" aria-label="Residential solar gallery">
        <div className="feature-track">
          <div className="feature-slide feature-home" id="residential-1" role="img" aria-label="Solar panels installed on a family home" />
          <div className="feature-slide feature-rooftop" id="residential-2" role="img" aria-label="Aerial view of a rooftop solar installation" />
          <div className="feature-slide feature-evening" id="residential-3" role="img" aria-label="Solar-powered home in the evening" />
        </div>
        <div className="feature-copy">
          <p className="eyebrow light">Residential solar</p>
          <h2>Own your<br />daylight.</h2>
          <p>Turn your roof into a reliable source of power. Our tailored home systems reduce generator use, protect essential appliances and store energy for the night.</p>
          <a className="text-link light" href="#consultation">Power your home <Arrow /></a>
        </div>
        <div className="gallery-nav" aria-label="Choose gallery image">
          <a href="#residential-1" aria-label="View residential solar image 1">01</a>
          <a href="#residential-2" aria-label="View residential solar image 2">02</a>
          <a href="#residential-3" aria-label="View residential solar image 3">03</a>
        </div>
        <p className="swipe-hint">Swipe to explore <span aria-hidden="true">→</span></p>
      </section>

      <section className="solutions" id="solutions">
        <div className="section-heading">
          <p className="eyebrow">What we deliver</p>
          <h2>One partner.<br />Every energy need.</h2>
        </div>
        <div className="service-list">
          {services.map(([number, title, body]) => (
            <article className="service" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{body}</p>
              <a href="#consultation" aria-label={`Discuss ${title}`}><Arrow /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="film" aria-label="Project film placeholder">
        <div className="film-copy">
          <p className="eyebrow light">Built for real life</p>
          <h2>From sunlight<br />to switch-on.</h2>
        </div>
        <button className="play" type="button" aria-label="Play project film"><span>▶</span></button>
        <p className="media-note">Full-width project video space</p>
      </section>

      <section className="process" id="process">
        <div className="process-image" role="img" aria-label="Technician installing rooftop solar panels" />
        <div className="process-copy">
          <p className="eyebrow">A clear path to clean power</p>
          <h2>Designed around your life.</h2>
          <div className="steps">
            {process.map(([title, body], index) => (
              <div className="step" key={title}>
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="company" id="company">
        <div>
          <p className="eyebrow light">More than panels</p>
          <h2>A complete clean-energy company.</h2>
        </div>
        <p>Our capabilities span renewable generation, technical engineering, smart-grid infrastructure, storage, energy auditing, equipment distribution and commercial energy partnerships.</p>
      </section>

      <section className="consultation" id="consultation">
        <p className="eyebrow">Start your energy journey</p>
        <h2>Let&apos;s build your<br />power system.</h2>
        <p>Tell us about your property and power needs. We&apos;ll guide you toward the right system.</p>
        <a className="button button-dark" href="mailto:hello@unlimitedenergy.systems?subject=Solar%20assessment%20request">Request a consultation</a>
        <small>Company registration in progress with the Corporate Affairs Commission.</small>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">U</span><span>UNLIMITED <b>ENERGY</b></span></a>
        <p>Clean power. Built without limits.</p>
        <div><a href="#solutions">Solutions</a><a href="#company">Company</a><a href="#consultation">Contact</a></div>
        <p className="copyright">© 2026 Unlimited Energy Systems Limited</p>
      </footer>
    </main>
  );
}
