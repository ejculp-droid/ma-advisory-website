export default {
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  nodeVersion: '18',
  contentSources: [],
  models: {
    page: {
      type: 'page',
      urlPath: '/{slug}',
      filePath: 'pages/{slug}.html'
    }
  },
  pagesDir: 'pages',
  dataDir: 'content'
};
