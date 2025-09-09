import React from 'react';
import { getImageUrl } from '../../utils/getImageUrl';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="notFoundPage">
      <img
        className="notFoundPage__img"
        src={getImageUrl('/img/page-not-found.png')}
        alt="Page not found"
      />
    </div>
  );
};
