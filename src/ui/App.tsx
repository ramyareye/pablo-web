import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom'

import demoOneHtml from '../demo/demo1.html?raw'
import demoOneCss from '../demo/demo1.css?raw'
import demoTwoHtml from '../demo/demo2.html?raw'
import demoTwoCss from '../demo/demo2.css?raw'

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; id?: string; raw?: string }
  | { status: 'error'; message: string; raw?: string }

async function postForm(endpoint: string, form: HTMLFormElement) {
  const body = new FormData(form)
  const res = await fetch(endpoint, { method: 'POST', body })
  const text = await res.text()
  let json: any = null
  try {
    json = JSON.parse(text)
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message =
      (json && typeof json.error === 'string' && json.error) || `Request failed (${res.status})`
    throw Object.assign(new Error(message), { raw: text })
  }

  return { id: json?.id as string | undefined, raw: text }
}

function FormCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle: string
  action: string
  children: React.ReactNode
}) {
  const [state, setState] = useState<SubmitState>({ status: 'idle' })
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  return (
    <section className="card">
      <div className="section-title">{title}</div>
      <div className="section-subtitle">{subtitle}</div>
      <form
        className="form-grid"
        encType="multipart/form-data"
        onSubmit={async (e) => {
          e.preventDefault()
          if (cooldown > 0) return
          setState({ status: 'submitting' })
          try {
            const { id, raw } = await postForm(action, e.currentTarget)
            setState({ status: 'success', id, raw })
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Submission failed'
            const raw = (err as any)?.raw as string | undefined
            setState({ status: 'error', message, raw })
          } finally {
            setCooldown(10)
          }
        }}
      >
        {children}
        <button
          className="btn primary span-2"
          type="submit"
          disabled={state.status === 'submitting' || cooldown > 0}
        >
          {state.status === 'submitting'
            ? 'Submitting…'
            : cooldown > 0
              ? `Please wait ${cooldown}s`
              : 'Submit'}
        </button>
      </form>

      {state.status === 'success' && (
        <div className="fineprint">
          Submitted{state.id ? ` — Report ID: ${state.id}` : ''}.
        </div>
      )}
      {state.status === 'error' && (
        <div className="fineprint" style={{ color: 'var(--alert)' }}>
          {state.message}
        </div>
      )}
      {(state.status === 'success' || state.status === 'error') && state.raw && (
        <pre className="result">{state.raw}</pre>
      )}
    </section>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <header className="topbar card">
        <div className="brand">
          <div className="logo-mark">IJAF</div>
          <div className="brand-text">
            <div className="brand-title">IJAF</div>
            <div className="brand-subtitle">Iran Justice &amp; Accountability Foundation</div>
            <div className="brand-note">Documentation is ongoing. Accountability is unavoidable.</div>
          </div>
        </div>
        <div className="lang">EN | FA</div>
      </header>

      <nav className="card">
        <div className="footer-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/victim-report">Victim / Killed</NavLink>
          <NavLink to="/detention-report">Detained / Missing</NavLink>
          <NavLink to="/perpetrator-report">Perpetrator ID</NavLink>
          <NavLink to="/witness-testimony">Witness Testimony</NavLink>
          <NavLink to="/demo-1">Demo 1</NavLink>
          <NavLink to="/demo-2">Demo 2</NavLink>
        </div>
      </nav>

      <main className="stack">{children}</main>

      <footer className="footer card">
        <div className="footer-links">About IJAF | Security | Privacy | Contact</div>
        <div className="footer-copy">© IJAF</div>
      </footer>
    </div>
  )
}

function Home() {
  return (
    <PageShell>
      <section className="card hero">
        <div className="hero-title">Documenting crimes. Preserving truth. Pursuing accountability.</div>
        <ul className="bullet-list">
          <li>Securely collects testimonies and evidence</li>
          <li>Verifies information through independent review</li>
          <li>Preserves records for future legal accountability</li>
          <li>Supports international justice mechanisms</li>
        </ul>
        <div className="actions">
          <NavLink className="btn primary" to="/victim-report">
            Submit information — securely
          </NavLink>
          <a className="btn ghost" href="#">
            Browse documented cases
          </a>
        </div>
      </section>

      <section className="card report">
        <div className="section-title">Report safely</div>
        <div className="section-subtitle">Choose how you submit information.</div>
        <div className="report-grid">
          <div className="report-col">
            <ul className="checklist">
              <li>No IP logging (application-side)</li>
              <li>No data shared with governments</li>
              <li>Encrypted storage (optional contact)</li>
              <li>Your safety comes first</li>
            </ul>
          </div>
          <div className="report-col">
            <ul className="checklist emphasis">
              <li>Fully anonymous (recommended)</li>
              <li>Anonymous + encrypted contact (optional)</li>
              <li>Identified submission (legal follow-up only)</li>
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  )
}

function Form1() {
  return (
    <PageShell>
      <FormCard
        title="Victim / Killed"
        subtitle="Document deaths accurately, respectfully, and verifiably."
        action="/api/reports/victims"
      >
        <label className="span-2">
          Victim’s full name (or “Unknown”)
          <input name="fullName" required />
        </label>
        <label>
          Age (approx)
          <input name="age" />
        </label>
        <label>
          Gender (optional)
          <input name="gender" />
        </label>
        <label>
          Date of death
          <input name="dateOfDeath" required placeholder="YYYY-MM-DD" />
        </label>
        <label>
          Location (city)
          <input name="locationCity" />
        </label>
        <label>
          Location (area)
          <input name="locationArea" />
        </label>
        <label className="span-2">
          Coordinates (optional)
          <input name="locationCoordinates" placeholder="Lat, Long" />
        </label>
        <label className="span-2">
          Circumstances of death
          <textarea name="circumstances" required />
        </label>
        <label className="span-2">
          Alleged responsible force (if known)
          <input name="allegedResponsibleForce" />
        </label>
        <label>
          Source of information
          <select name="sourceOfInfo" required>
            <option value="family">Family</option>
            <option value="witness">Witness</option>
            <option value="media">Media</option>
            <option value="hospital">Hospital</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Source details (if other)
          <input name="sourceDetails" />
        </label>
        <label className="span-2">
          Relationship to victim (optional)
          <input name="relationshipToVictim" />
        </label>
        <label>
          Photo
          <input name="photo" type="file" accept="image/*" multiple />
        </label>
        <label>
          Video
          <input name="video" type="file" accept="video/*" multiple />
        </label>
        <label>
          Death certificate
          <input name="deathCertificate" type="file" multiple />
        </label>
        <label>
          Burial record
          <input name="burialRecord" type="file" multiple />
        </label>
      </FormCard>
    </PageShell>
  )
}

function Form2() {
  return (
    <PageShell>
      <FormCard
        title="Detained / Missing"
        subtitle="Track enforced disappearances and political detention."
        action="/api/reports/detentions"
      >
        <label className="span-2">
          Person’s full name
          <input name="fullName" required />
        </label>
        <label>
          Date last seen
          <input name="dateLastSeen" required placeholder="YYYY-MM-DD" />
        </label>
        <label>
          Place last seen
          <input name="placeLastSeen" required />
        </label>
        <label>
          Arresting authority (if known)
          <input name="arrestingAuthority" />
        </label>
        <label>
          Current status
          <select name="status" required>
            <option value="detained">Detained</option>
            <option value="missing">Missing</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label>
          Detention facility (if known)
          <input name="detentionFacility" />
        </label>
        <label>
          Charges (if any)
          <input name="charges" />
        </label>
        <label>
          Last contact date
          <input name="lastContactDate" placeholder="YYYY-MM-DD" />
        </label>
        <label>
          Health concerns
          <select name="healthConcerns" required>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>
        <label className="span-2">
          Health concerns details
          <textarea name="healthConcernsDetails" />
        </label>
        <label className="span-2">
          Family contact info (optional & encrypted)
          <textarea name="familyContact" />
        </label>
        <label>
          Arrest notice
          <input name="arrestNotice" type="file" multiple />
        </label>
        <label>
          Court documents
          <input name="courtDocuments" type="file" multiple />
        </label>
        <label>
          Messages
          <input name="messages" type="file" multiple />
        </label>
        <label>
          Photos/videos
          <input name="media" type="file" multiple />
        </label>
      </FormCard>
    </PageShell>
  )
}

function Form3() {
  return (
    <PageShell>
      <FormCard
        title="Perpetrator Identification"
        subtitle="Identify individuals responsibly, without vigilantism."
        action="/api/reports/perpetrators"
      >
        <label className="span-2">
          Name / alias
          <input name="nameOrAlias" required />
        </label>
        <label>
          Role
          <select name="role" required>
            <option value="shooter">Shooter</option>
            <option value="commander">Commander</option>
            <option value="interrogator">Interrogator</option>
            <option value="informant">Informant</option>
            <option value="enabler">Enabler</option>
          </select>
        </label>
        <label>
          Organization/unit
          <input name="organizationUnit" />
        </label>
        <label>
          Rank or position
          <input name="rankOrPosition" />
        </label>
        <label className="span-2">
          Location & timeframe
          <input name="locationTimeframe" />
        </label>
        <label className="span-2">
          Actions allegedly committed
          <textarea name="actionsAllegedlyCommitted" required />
        </label>
        <label>
          How do you know this?
          <select name="knowledgeSource" required>
            <option value="witness">Witness</option>
            <option value="document">Document</option>
            <option value="media">Media</option>
          </select>
        </label>
        <label>
          Photos
          <input name="photos" type="file" accept="image/*" multiple />
        </label>
        <label>
          Videos
          <input name="videos" type="file" accept="video/*" multiple />
        </label>
        <label>
          Orders
          <input name="orders" type="file" multiple />
        </label>
        <label>
          Public statements
          <input name="publicStatements" type="file" multiple />
        </label>
      </FormCard>
    </PageShell>
  )
}

function Form4() {
  return (
    <PageShell>
      <FormCard
        title="Witness Testimony"
        subtitle="Capture firsthand accounts safely and structurally."
        action="/api/reports/witnesses"
      >
        <label>
          Were you an eyewitness?
          <select name="isEyewitness" required>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label>
          Event type witnessed
          <select name="eventType" required>
            <option value="shooting">Shooting</option>
            <option value="arrest">Arrest</option>
            <option value="torture">Torture</option>
            <option value="execution">Execution</option>
            <option value="protest_violence">Protest violence</option>
          </select>
        </label>
        <label>
          Date
          <input name="eventDate" required placeholder="YYYY-MM-DD" />
        </label>
        <label>
          Location
          <input name="eventLocation" required />
        </label>
        <label className="span-2">
          What happened?
          <textarea name="narrative" required />
        </label>
        <label>
          Number of victims observed (estimate)
          <input name="victimsObserved" />
        </label>
        <label>
          Identifiable units or uniforms
          <input name="identifiableUnits" />
        </label>
        <label>
          Were weapons used?
          <select name="weaponsUsed" required>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
        <label>
          Video
          <input name="video" type="file" accept="video/*" multiple />
        </label>
        <label>
          Audio
          <input name="audio" type="file" accept="audio/*" multiple />
        </label>
        <label>
          Photos
          <input name="photos" type="file" accept="image/*" multiple />
        </label>
      </FormCard>
    </PageShell>
  )
}

function Demo1() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: demoOneCss }} />
      <nav className="demo-menu">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/victim-report">Victim / Killed</NavLink>
        <NavLink to="/detention-report">Detained / Missing</NavLink>
        <NavLink to="/perpetrator-report">Perpetrator ID</NavLink>
        <NavLink to="/witness-testimony">Witness Testimony</NavLink>
        <NavLink to="/demo-1">Demo 1</NavLink>
        <NavLink to="/demo-2">Demo 2</NavLink>
      </nav>
      <div id="app" dangerouslySetInnerHTML={{ __html: demoOneHtml }} />
    </div>
  )
}

function Demo2() {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: demoTwoCss }} />
      <nav className="demo-menu">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/victim-report">Victim / Killed</NavLink>
        <NavLink to="/detention-report">Detained / Missing</NavLink>
        <NavLink to="/perpetrator-report">Perpetrator ID</NavLink>
        <NavLink to="/witness-testimony">Witness Testimony</NavLink>
        <NavLink to="/demo-1">Demo 1</NavLink>
        <NavLink to="/demo-2">Demo 2</NavLink>
      </nav>
      <div dangerouslySetInnerHTML={{ __html: demoTwoHtml }} />
    </div>
  )
}

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/victim-report" element={<Form1 />} />
        <Route path="/detention-report" element={<Form2 />} />
        <Route path="/perpetrator-report" element={<Form3 />} />
        <Route path="/witness-testimony" element={<Form4 />} />
        <Route path="/demo-1" element={<Demo1 />} />
        <Route path="/demo-2" element={<Demo2 />} />
      </Routes>
    </BrowserRouter>
  )
}
