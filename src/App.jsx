import { useEffect, useRef, useState } from "react";
import { principles, products, transferSteps } from "./content.js";

const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT?.trim();

function ArrowIcon({ direction = "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={`arrow-icon arrow-icon--${direction}`}
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Brand({ compact = false }) {
  return (
    <span className={`brand${compact ? " brand--compact" : ""}`}>
      <svg aria-hidden="true" className="brand__mark" viewBox="0 0 32 32">
        <path d="M5 24h22M8 19h16M11 14h10M14 9h4" />
      </svg>
      <span>FREEHOLD</span>
    </span>
  );
}

function focusSection(id) {
  window.setTimeout(() => {
    const section = document.getElementById(id);
    section?.focus({ preventScroll: true });
  }, 350);
}

function NavLink({ children, target, onNavigate }) {
  return (
    <a
      href={`#${target}`}
      onClick={() => {
        onNavigate?.();
        focusSection(target);
      }}
    >
      {children}
    </a>
  );
}

function Header({ onEnquire }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.body.classList.add("nav-open");
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("nav-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <a
        aria-label="Freehold, home"
        className="brand-link"
        href="#top"
        onClick={() => {
          close();
          focusSection("top");
        }}
      >
        <Brand compact />
      </a>

      <button
        ref={menuButtonRef}
        aria-controls="primary-navigation"
        aria-expanded={open}
        className="menu-button"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="menu-button__lines" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>{open ? "Close" : "Menu"}</span>
      </button>

      <nav
        aria-label="Primary"
        className={`primary-navigation${open ? " is-open" : ""}`}
        id="primary-navigation"
      >
        <NavLink target="products" onNavigate={close}>
          Products
        </NavLink>
        <NavLink target="work" onNavigate={close}>
          Work
        </NavLink>
        <NavLink target="studio" onNavigate={close}>
          Studio
        </NavLink>
        <a
          className="button button--small"
          href="#enquire"
          onClick={() => {
            close();
            onEnquire("general");
            focusSection("enquire");
          }}
        >
          Start a conversation
          <ArrowIcon />
        </a>
      </nav>
    </header>
  );
}

function ButtonLink({
  children,
  href,
  variant = "primary",
  onClick,
  className = "",
}) {
  return (
    <a
      className={`button button--${variant} ${className}`.trim()}
      href={href}
      onClick={onClick}
    >
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}

function SectionRule({ number }) {
  return (
    <div aria-hidden="true" className="section-rule">
      <span>{number}</span>
      <span className="section-rule__line" />
    </div>
  );
}

function Hero({ onEnquire }) {
  return (
    <section className="hero" id="top" tabIndex="-1">
      <div className="hero__copy">
        <h1>Buy working software. Or commission something built.</h1>
        <p className="hero__lede">
          Freehold sells complete web products — codebase, domain, documentation
          and handover included. When the right product is not available, we
          build to commission.
        </p>
        <div className="hero__actions">
          <ButtonLink
            href="#products"
            onClick={() => focusSection("products")}
          >
            View products
          </ButtonLink>
          <ButtonLink
            href="#enquire"
            onClick={() => {
              onEnquire("build");
              focusSection("enquire");
            }}
            variant="outline"
          >
            Discuss a build
          </ButtonLink>
        </div>
        <p className="hero__trust">
          <span aria-hidden="true" className="trust-mark">
            <svg viewBox="0 0 32 32">
              <path d="M7 24h18M10 19h12M13 14h6M15 9h2" />
            </svg>
          </span>
          Independent build studio <span aria-hidden="true">·</span> London
        </p>
      </div>
      <div className="hero__art" aria-hidden="true">
        <img
          alt=""
          height="1024"
          src="./assets/ownership-transfer.png"
          width="1536"
        />
      </div>
      <div aria-hidden="true" className="section-notch" />
    </section>
  );
}

function ProductGlyph({ type }) {
  if (type === "Thicket") {
    return (
      <svg aria-hidden="true" viewBox="0 0 120 80">
        <path d="M60 69V13M60 29 43 18M60 37 78 22M60 46 35 32M60 52l26-17M60 59 45 48" />
        <path d="M17 70h86" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 120 80">
      <path d="M24 70V28l36-20 36 20v42M44 70V45c0-13 7-21 16-21s16 8 16 21v25" />
      <path d="M14 70h92" />
      <path d="M84 20h19v50" />
    </svg>
  );
}

function ProductStack({ stack }) {
  return (
    <p className="product__stack" aria-label={`Technology: ${stack.join(", ")}`}>
      {stack.map((item, index) => (
        <span key={item}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {item}
        </span>
      ))}
    </p>
  );
}

function Products({ onEnquire }) {
  const featured = products.find((product) => product.featured);
  const secondary = products.filter((product) => !product.featured);

  return (
    <section className="section products" id="products" tabIndex="-1">
      <SectionRule number="01" />
      <div className="section-heading">
        <h2>Products, built and ready.</h2>
        <p>
          A small number of complete web products are available each year.
          Source, domain, documentation and structured handover are included.
        </p>
      </div>

      <article className="featured-product">
        <div className="featured-product__visual">
          <img
            alt="Software source, domain and handover documentation presented together"
            height="1024"
            loading="lazy"
            src="./assets/ownership-transfer.png"
            width="1536"
          />
        </div>
        <div className="featured-product__content">
          <h3>{featured.name}</h3>
          <p className="product__description">{featured.description}</p>
          <ProductStack stack={featured.stack} />
          <p className="product__disclosure">{featured.disclosure}</p>
          <ButtonLink
            href="#enquire"
            onClick={() => {
              onEnquire("product", featured.name);
              focusSection("enquire");
            }}
          >
            {featured.action}
          </ButtonLink>
        </div>
      </article>

      <div className="product-rows">
        {secondary.map((product) => (
          <article className="product-row" key={product.name}>
            <div className="product-row__glyph">
              <ProductGlyph type={product.name} />
            </div>
            <div>
              <h3>{product.name}</h3>
              <p className="product__description">{product.description}</p>
            </div>
            <div className="product-row__detail">
              <ProductStack stack={product.stack} />
              <p className="product__disclosure">{product.disclosure}</p>
            </div>
            <ButtonLink
              href="#enquire"
              onClick={() => {
                onEnquire("product", product.name);
                focusSection("enquire");
              }}
              variant="outline"
            >
              {product.action}
            </ButtonLink>
          </article>
        ))}
      </div>

      <a
        className="text-link"
        href="#enquire"
        onClick={() => {
          onEnquire("availability");
          focusSection("enquire");
        }}
      >
        Join the private availability list
        <ArrowIcon />
      </a>
    </section>
  );
}

function StepIcon({ type }) {
  const paths = {
    conversation: (
      <>
        <path d="M5 6h14v10H9l-4 3V6Z" />
        <path d="M9 11h.01M12 11h.01M15 11h.01" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="m15 15 4 4" />
      </>
    ),
    document: (
      <>
        <path d="M7 3h7l4 4v14H7V3Z" />
        <path d="M14 3v5h4M10 12h5M10 16h5" />
      </>
    ),
    package: (
      <>
        <path d="m4 8 8-4 8 4v9l-8 4-8-4V8Z" />
        <path d="m4 8 8 4 8-4M12 12v9" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[type]}
    </svg>
  );
}

function Process({ onEnquire }) {
  return (
    <section className="section process" id="process" tabIndex="-1">
      <SectionRule number="02" />
      <div className="process__intro">
        <div>
          <h2>A transfer, without ambiguity.</h2>
          <p>
            Every acquisition starts with a conversation. We open the product
            properly, agree the transfer in writing, and stay through handover.
          </p>
        </div>
        <div className="process__document" aria-hidden="true">
          <span>TRANSFER AGREEMENT</span>
          <i />
          <span>ASSETS</span>
          <span>TERMS</span>
          <span>SCHEDULE</span>
        </div>
      </div>

      <ol className="process-rail">
        {transferSteps.map((step) => (
          <li key={step.number}>
            <div className="process-step__marker">{step.number}</div>
            <div className="process-step__icon">
              <StepIcon type={step.icon} />
            </div>
            <h3>
              <span>{step.number}</span>
              {step.title}
            </h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>

      <ButtonLink
        href="#enquire"
        onClick={() => {
          onEnquire("product");
          focusSection("enquire");
        }}
      >
        Ask about a product
      </ButtonLink>
    </section>
  );
}

function Work({ onEnquire }) {
  return (
    <section className="section work" id="work" tabIndex="-1">
      <SectionRule number="03" />
      <div className="section-heading">
        <h2>Built for clients.</h2>
        <p>
          Commissioned products are scoped, designed, engineered and handed
          over by the same small team.
        </p>
      </div>

      <article className="case-study">
        <div className="case-study__copy">
          <p className="case-study__category">Financial operations</p>
          <h3>Ledgerwork</h3>
          <dl className="case-study__story">
            <div>
              <dt>The problem</dt>
              <dd>
                Three disconnected feeds left the finance team reconciling
                exceptions by hand.
              </dd>
            </div>
            <div>
              <dt>The response</dt>
              <dd>
                A focused reconciliation workspace that surfaces only the
                mismatches that need attention.
              </dd>
            </div>
            <div>
              <dt>The outcome</dt>
              <dd>
                Daily spreadsheet triage was replaced by one maintained
                operational view.
              </dd>
            </div>
          </dl>
          <p className="case-study__stack">React · Postgres · D3</p>
          <details className="case-study__details">
            <summary className="button button--primary">
              <span>Read the case study</span>
              <ArrowIcon />
            </summary>
            <div className="case-study__details-body">
              <p>
                Ledgerwork was designed around exception handling rather than
                reproducing the entire ledger. The interface keeps routine
                matches quiet and gives the finance team one place to resolve
                what remains.
              </p>
              <p>
                The client identity is withheld under the project agreement.
              </p>
            </div>
          </details>
        </div>
        <div className="case-study__image">
          <img
            alt="A reconciliation workspace showing exception rows and operational activity"
            height="1024"
            loading="lazy"
            src="./assets/ledgerwork-workspace.png"
            width="1536"
          />
        </div>
      </article>

      <div className="commission-strip">
        <div className="commission-strip__mark" aria-hidden="true">
          <StepIcon type="document" />
        </div>
        <h3>Need something built?</h3>
        <p>
          Bring us a defined problem. We’ll tell you whether we should build it.
        </p>
        <ButtonLink
          href="#enquire"
          onClick={() => {
            onEnquire("build");
            focusSection("enquire");
          }}
        >
          Discuss your build
        </ButtonLink>
      </div>
    </section>
  );
}

function Studio() {
  return (
    <section className="section studio" id="studio" tabIndex="-1">
      <SectionRule number="04" />
      <div className="studio__intro">
        <h2>Small by design.</h2>
        <p>
          Freehold is an independent London build studio. We stay small so the
          person who scopes the work stays close to the build.
        </p>
      </div>
      <div className="principles">
        {principles.map((principle) => (
          <article className="principle" key={principle.title}>
            <ArrowIcon />
            <div>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactForm({ route, project }) {
  const [status, setStatus] = useState("");
  const [interest, setInterest] = useState(route);
  const [details, setDetails] = useState("");

  useEffect(() => {
    setInterest(route);
    if (project) {
      setDetails(`I’m interested in ${project}.`);
    } else if (route === "availability") {
      setDetails("Please add me to the private product availability list.");
    } else if (route === "build") {
      setDetails("");
    }
  }, [route, project]);

  const handleSubmit = (event) => {
    if (FORM_ENDPOINT) return;

    event.preventDefault();
    setStatus(
      "The enquiry form needs its secure form endpoint before launch. Your details have not been sent.",
    );
  };

  return (
    <form
      action={FORM_ENDPOINT || undefined}
      className="contact-form"
      method="post"
      onSubmit={handleSubmit}
    >
      <input name="_subject" type="hidden" value="New Freehold enquiry" />
      <div className="form-grid">
        <label>
          <span>
            Name <b aria-hidden="true">*</b>
          </span>
          <input autoComplete="name" name="name" required type="text" />
        </label>
        <label>
          <span>
            Email <b aria-hidden="true">*</b>
          </span>
          <input autoComplete="email" name="email" required type="email" />
        </label>
      </div>

      <label>
        <span>
          I’m interested in <b aria-hidden="true">*</b>
        </span>
        <select
          name="interest"
          onChange={(event) => setInterest(event.target.value)}
          required
          value={interest}
        >
          <option value="product">A listed product</option>
          <option value="build">A commissioned build</option>
          <option value="availability">The private availability list</option>
          <option value="general">Something else</option>
        </select>
      </label>

      <label>
        <span>
          What do you need? <b aria-hidden="true">*</b>
        </span>
        <textarea
          name="message"
          onChange={(event) => setDetails(event.target.value)}
          required
          rows="5"
          value={details}
        />
      </label>

      <div className="form-submit">
        <label className="consent">
          <input name="consent" required type="checkbox" value="yes" />
          <span>
            I agree to the <a href="#privacy">Privacy Policy</a> so Freehold can
            reply.
          </span>
        </label>
        <button className="button button--primary" type="submit">
          <span>Send enquiry</span>
          <ArrowIcon />
        </button>
      </div>
      <p aria-live="polite" className="form-status" role="status">
        {status}
      </p>
    </form>
  );
}

function Enquire({ route, project }) {
  return (
    <section className="section enquire" id="enquire" tabIndex="-1">
      <SectionRule number="05" />
      <div className="enquire-panel">
        <div className="enquire-panel__intro">
          <h2>Tell us what you’re building—or buying.</h2>
          <p>
            Choose the closest route and give us enough context for a useful
            first reply.
          </p>
        </div>
        <ContactForm project={project} route={route} />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <a
        aria-label="Freehold, back to top"
        href="#top"
        onClick={() => focusSection("top")}
      >
        <Brand />
      </a>
      <nav aria-label="Footer">
        <NavLink target="products">Products</NavLink>
        <NavLink target="work">Work</NavLink>
        <NavLink target="studio">Studio</NavLink>
        <a href="#privacy">Privacy</a>
      </nav>
      <p>Independent build studio · London</p>
      <p>© 2026 Freehold</p>
    </footer>
  );
}

function PrivacyNote() {
  return (
    <section className="privacy-note" id="privacy" tabIndex="-1">
      <div>
        <h2>Privacy, in brief</h2>
        <p>
          Enquiry details are used to reply and assess the work or product you
          asked about. They are not sold or used for unrelated marketing. You
          can request deletion through the same enquiry route.
        </p>
      </div>
    </section>
  );
}

export default function App() {
  const [enquiry, setEnquiry] = useState({
    route: "product",
    project: "",
  });

  const setEnquiryRoute = (route, project = "") => {
    setEnquiry({ route, project });
  };

  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={() => focusSection("main")}
      >
        Skip to content
      </a>
      <Header onEnquire={setEnquiryRoute} />
      <main id="main" tabIndex="-1">
        <Hero onEnquire={setEnquiryRoute} />
        <Products onEnquire={setEnquiryRoute} />
        <Process onEnquire={setEnquiryRoute} />
        <Work onEnquire={setEnquiryRoute} />
        <Studio />
        <Enquire project={enquiry.project} route={enquiry.route} />
        <PrivacyNote />
      </main>
      <Footer />
    </>
  );
}
