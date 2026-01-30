/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEMO_URL: process.env.DEMO_URL,
    LINK_TO_WEEK: process.env.LINK_TO_WEEK,
    LINK_TO_MONTH: process.env.LINK_TO_MONTH,
    LINK_TO_YEAR: process.env.LINK_TO_YEAR,
  },
};

module.exports = nextConfig;
