import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: Record<string, unknown>;
}

const SITE_URL = 'https://kaliyapafarmstead.com';
const DEFAULT_TITLE = 'Kaliyapa Farmstead - Redefining Agricultural Luxury | Salima, Malawi';
const DEFAULT_DESCRIPTION = 'Premium goat farming, poultry, and piggery in Salima, Malawi. Quality livestock, sustainable practices, and agricultural excellence since 2008.';
const DEFAULT_OG_IMAGE = '/logo.png';

export default function SEO({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  structuredData,
}: SEOProps) {
  const fullTitle = title ? `${title} | Kaliyapa Farmstead` : DEFAULT_TITLE;
  const canonical = canonicalUrl || SITE_URL;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : SITE_URL;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attribute = 'name') => {
      let el = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta') as HTMLMetaElement;
        el.setAttribute(attribute, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setPropertyMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta') as HTMLMetaElement;
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description || DEFAULT_DESCRIPTION);
    if (keywords) setMeta('keywords', keywords);

    setMeta('robots', 'index, follow');
    setPropertyMeta('og:type', ogType);
    setPropertyMeta('og:title', fullTitle);
    setPropertyMeta('og:description', description || DEFAULT_DESCRIPTION);
    setPropertyMeta('og:url', currentUrl);
    setPropertyMeta('og:image', ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`);
    setPropertyMeta('og:locale', 'en_US');
    setPropertyMeta('og:site_name', 'Kaliyapa Farmstead');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description || DEFAULT_DESCRIPTION);
    setMeta('twitter:image', ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link') as HTMLLinkElement;
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonical;

    if (structuredData) {
      let scriptEl = document.getElementById('structured-data') as HTMLScriptElement;
      if (!scriptEl) {
        scriptEl = document.createElement('script') as HTMLScriptElement;
        scriptEl.id = 'structured-data';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(structuredData);
    }

    return () => {
      const scriptEl = document.getElementById('structured-data');
      if (scriptEl && !structuredData) {
        scriptEl.remove();
      }
    };
  }, [fullTitle, description, keywords, canonical, ogImage, ogType, structuredData, currentUrl]);

  return null;
}
