import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  // return (
  //   <header className={clsx('hero hero--primary', styles.heroBanner)}>
  //     <div className="container">
  //       <h1 className="hero__title">{siteConfig.title}</h1>
  //       <p className="hero__subtitle">{siteConfig.tagline}</p>
  //       <div className={styles.buttons}>
  //         <Link
  //           className="button button--secondary button--lg"
  //           to="/docs/documentation/getting-started/introduction/"
  //         >
  //           Tutorial - 5min ⏱️
  //         </Link>
  //       </div>
  //     </div>
  //   </header>
  // );

  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <h1 className={clsx('hero__title', styles.heroBannerTitle)}>{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>

        <div className={clsx(styles.heroBannerMessage)}>
          Compose asynchronous data streams like a breeze, create complex data flow, and unleash the full potential of Reactive Programming.
        </div>

        <div className={clsx(styles.heroBannerSubMessage)}>
          Includes <Link to="/docs/documentation/signals/introduction/">signals</Link> out of the box !
        </div>

        <div className={styles.heroBannerButtons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/documentation/getting-started/introduction/"
          >
            Get started !
          </Link>

        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}: ${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader/>
      <main>
        <HomepageFeatures/>
      </main>
    </Layout>
  );
}
