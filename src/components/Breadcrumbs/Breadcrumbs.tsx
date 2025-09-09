import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';
import { getImageUrl } from '../../utils/getImageUrl';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface Props {
  items: Breadcrumb[];
  className?: string;
}

export const Breadcrumbs: React.FC<Props> = ({ items, className = '' }) => {
  return (
    <div className={`${styles.breadcrumbs} ${className}`}>
      {items.map((item, idx) => (
        <React.Fragment key={item.label}>
          {idx === 0 ? (
            <Link
              to={item.href || '/'}
              className={styles.breadcrumbs__home}
              aria-label="Home"
            >
              <img src={getImageUrl('/img/Home.png')} alt="Home" />
            </Link>
          ) : (
            <>
              <img
                src={getImageUrl('/img/btn-next.png')}
                alt="Next"
                className={styles.breadcrumbs__arrow}
              />
              {item.href ? (
                <Link to={item.href} className={styles.breadcrumbs__route}>
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${styles.breadcrumbs__route} ${styles['breadcrumbs__route--last']}`}
                >
                  {item.label}
                </span>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
