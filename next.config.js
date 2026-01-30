/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEMO_URL: process.env.DEMO_URL,
    LINK_TO_WEEK: process.env.LINK_TO_WEEK,
    LINK_TO_MONTH: process.env.LINK_TO_MONTH,
    LINT_TO_MONTH: process.env.LINT_TO_MONTH,
    LINK_TO_YEAR: process.env.LINK_TO_YEAR,
    LINK_TO_WEEK_PROMO: process.env.LINK_TO_WEEK_PROMO,
    LINK_TO_MONTH_PROMO: process.env.LINK_TO_MONTH_PROMO,
    LINK_TO_YEAR_PROMO: process.env.LINK_TO_YEAR_PROMO,
  },
};

module.exports = nextConfig;
