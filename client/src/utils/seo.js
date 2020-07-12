import React from "react";
import { Helmet } from "react-helmet";

const SEO = props => {
  const seo = {
    title: props.title || "memestar - where people can share their memes",
    description:
      props.description ||
      "memestar is social networking site where people can share their memes"
  };

  return (
    <Helmet title={seo.title} titleTemplate={seo.title}>
      <meta name="description" content={seo.description} />
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
      {seo.title && <meta name="twitter:title" content={seo.title} />}
      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}
    </Helmet>
  );
};

export default SEO;
