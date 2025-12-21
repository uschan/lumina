import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  lang?: 'en' | 'zh';
}

const SEO: React.FC<SEOProps> = ({ title, description, lang = 'en' }) => {
  const baseTitle = 'Lumina | AI Digital Laboratory';
  const fullTitle = title === 'Home' ? baseTitle : `${title} | Lumina`;
  const defaultDesc = 'A personalized brand website featuring a Bento Grid layout, i18n support, and elegant dark/light mode transitions.';

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default SEO;