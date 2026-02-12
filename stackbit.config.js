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
          name: 'SiteSettings',
          type: 'data',
          label: 'Site Settings',
          filePath: 'content/settings.json',
          fields: [
            { name: 'site_title', type: 'string', label: 'Site Title' },
            { name: 'site_description', type: 'text', label: 'Site Description' }
          ]
        },
        {
          name: 'ContactInfo',
          type: 'data',
          label: 'Contact Information',
          filePath: 'content/contact.json',
          fields: [
            { name: 'phone', type: 'string', label: 'Phone' },
            { name: 'email', type: 'string', label: 'Email' },
            { name: 'address1', type: 'string', label: 'Address Line 1' },
            { name: 'address2', type: 'string', label: 'Address Line 2' },
            { name: 'city', type: 'string', label: 'City' },
            { name: 'state', type: 'string', label: 'State' },
            { name: 'zip', type: 'string', label: 'Zip Code' }
          ]
        },
        {
          name: 'HomePage',
          type: 'page',
          label: 'Home Page',
          urlPath: '/',
          filePath: 'index.html',
          fields: [
            { name: 'title', type: 'string', label: 'Page Title', required: true }
          ]
        }
      ]
    })
  ],
  pagesDir: 'pages',
  dataDir: 'content',
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter((m) => m.type === 'page');
    
    return documents
      .filter((d) => pageModels.some(m => m.name === d.modelName))
      .map((document) => {
        // Map document to URL
        let urlPath = '/';
        
        if (document.modelName === 'HomePage') {
          urlPath = '/';
        }
        
        return {
          stableId: document.id,
          urlPath: urlPath,
          document,
          isHomePage: document.modelName === 'HomePage'
        };
      });
  }
});
