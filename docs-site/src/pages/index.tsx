import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const features = [
  { title: 'Visual Flowchart Builder', icon: '🎨', desc: 'Design forms with a drag-and-drop node editor. 5 node types, 13 field types, conditional logic.' },
  { title: 'Dynamic Validation Engine', icon: '✅', desc: 'Zod-powered runtime validation. Rules stored in config — no code changes needed to update behavior.' },
  { title: 'REST API v1', icon: '🔌', desc: 'Full programmatic access with scoped API keys. Create forms, submit responses, retrieve data.' },
  { title: 'PostgreSQL + Docker', icon: '🐘', desc: 'Production-ready with PostgreSQL, Prisma ORM, and Docker Compose for one-command deployment.' },
  { title: 'Real Authentication', icon: '🔐', desc: 'Database-backed user registration, login, session management with SHA-256 password hashing.' },
  { title: '6 Starter Templates', icon: '🚀', desc: 'KYC, Feedback, Event Registration, Support Ticket, Job Application, Contact Form — all customizable.' },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <header className={styles.heroBanner}>
        <div className="container">
          <h1 className="hero__title">FormEngine <span style={{ color: '#f59e0b' }}>Pro</span></h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="/docs/getting-started">Get Started</Link>
            <Link className="button button--secondary button--lg" to="/api/authentication">API Reference</Link>
          </div>
        </div>
      </header>
      <main className="container padding-vert--xl">
        <div className="row">
          {features.map((f, i) => (
            <div key={i} className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__body">
                  <h2 style={{ fontSize: '2rem' }}>{f.icon}</h2>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text--center padding-top--xl">
          <h2>152 Tests Passing</h2>
          <p>Unit, integration, and end-to-end tests covering the validation engine, API keys, auth, schema generation, and form lifecycle.</p>
        </div>
      </main>
    </Layout>
  );
}
