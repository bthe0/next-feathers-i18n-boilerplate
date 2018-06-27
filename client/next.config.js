const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const withSass = require('@zeit/next-sass');

module.exports = withBundleAnalyzer({
    analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
        server: {
            analyzerMode: 'static',
            reportFilename: '../../bundles/server.html'
        },
        browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html'
        }
    },
    ...withSass({
        cssModules: true,

    }),
    useFileSystemPublicRoutes: false
});