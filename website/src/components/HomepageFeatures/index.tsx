import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Fast and Small',
    Svg: require('@site/static/img/illustrations/undraw/red/undraw_outer_space_re_u9vd.svg').default,
    description: (
      <>
        LiRX/core was designed from the ground up to be fast, small, and performant.
        It <a href={'/docs/documentation/performances/'}>outperforms RxJS</a> in every aspects.
      </>
    ),
  },
  {
    title: 'Build Complex Data Flows',
    Svg: require('@site/static/img/illustrations/undraw/red/undraw_mind_map_re_nlb6.svg').default,
    description: (
      <>
        Assemble many Observables to create custom data streams,
        and adopt <i>Reactive Programming</i> for each of your async data sources.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/illustrations/undraw/red/undraw_programmer_re_owql.svg').default,
    description: (
      <>
        LiRX/core can create understandable and complex data pipelines with just a few lines of code.
        Master data streams like a boss.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
