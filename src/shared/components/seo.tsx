import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
}

export function SEO({ title, description, canonical }: SEOProps) {
    const { t, i18n } = useTranslation();
    
    const siteTitle = t('seo.default_title', 'GRVT MES | Independent ISA-95 Level 3 Manufacturing Execution System');
    const siteDescription = t('seo.default_description', 'GRVT is an open-source, ISA-95 compliant Level 3 MES built for SME electronics manufacturers. Scale your factory with pure L3 control.');
    
    const displayTitle = title ? `${title} | GRVT MES` : siteTitle;
    const displayDescription = description || siteDescription;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const displayCanonical = canonical || currentUrl;

    useEffect(() => {
        // Update Title
        document.title = displayTitle;

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', displayDescription);

        // Update Canonical Link
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.setAttribute('href', displayCanonical);

        // Update Language
        document.documentElement.lang = i18n.language;

        // Open Graph Tags
        const updateOG = (property: string, content: string) => {
            let el = document.querySelector(`meta[property="${property}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute('property', property);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        updateOG('og:title', displayTitle);
        updateOG('og:description', displayDescription);
        updateOG('og:url', displayCanonical);
        updateOG('og:type', 'website');

    }, [displayTitle, displayDescription, displayCanonical, i18n.language]);

    return null; // This component doesn't render anything to the DOM
}
