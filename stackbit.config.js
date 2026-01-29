import { defineStackbitConfig } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  ssgName: 'custom',
  nodeVersion: '18',
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['content'],
      models: [
        {
          name: 'Page',
          type: 'page',
          urlPath: '/{slug}',
          filePath: 'content/pages/{slug}.json',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'heroTitle', type: 'string' },
            { name: 'heroSubtitle', type: 'text' },
            { name: 'heroButtonText', type: 'string' },
            { name: 'sections', type: 'list', items: { type: 'object' } }
          ]
        },
        {
          name: 'SiteConfig',
          type: 'data',
          filePath: 'content/data/config.json',
          fields: [
            { name: 'siteName', type: 'string' },
            { name: 'phone', type: 'string' },
            { name: 'email', type: 'string' },
            { name: 'address', type: 'text' }
          ]
        }
      ]
    })
  ],
  pagesDir: 'pages',
  dataDir: 'content'
});
