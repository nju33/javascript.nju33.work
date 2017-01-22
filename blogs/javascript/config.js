const Minimalist = require('diz-theme-minimalist');
const CollectionPageGenerator = require('diz-plugin-collection-page-generator');
const Ref = require('diz-plugin-ref');
const magu = require('magu');
const anchor = require('magu-plugin-anchor');
const say = require('magu-plugin-say');
const {highlight} = require('highlight.js');

module.exports = {
  title: 'javascript.log',
  url: 'https://javascript.nju33.work',
  theme: {
    Renderer: Minimalist,
    config: {
      inlineCSS: false
    }
  },
  reverse: true,
  compile(contents) {
    return new Promise(resolve => {
      const result = magu({
        code(code, lang) {
          if (!lang) {
            return '<pre><code>code</code></pre>'
          }
          return `
<pre><code class=lang--${lang}>${highlight(lang, code).value}</code></pre>
          `;
        }
      }, [
        anchor(),
        say({
          icon: '/images/user/icon.png'
        })
      ])
        .process(contents)
        .then(result => {
          resolve(result.html);
        });
    })
  },
  plugins: [
    new CollectionPageGenerator({pager: 30}),
    new Ref()
  ]
};
