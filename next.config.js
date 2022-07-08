/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*
  env:{
    MONGO_URI: "mongodb://localhost/dabatase"
  }*/
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
}

module.exports = nextConfig
