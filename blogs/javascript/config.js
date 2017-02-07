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
      inlineCSS: false,
      twemoji: true
    }
  },
  reverse: true,
  compile(contents) {
    return new Promise(resolve => {
      const result = magu({
        code(code, lang) {
          if (!lang) {
            return `<pre><code>${code}</code></pre>`;
          }

          try {
            const hled = highlight(lang, code).value;
            return `
  <pre><code class=lang--${lang}>${hled.replace(/  /g, '<span class=hljs-indent>  </span>')}</code></pre>
            `;
          } catch (e) {
            return `<pre><code class=lang--${lang}>${code}</code></pre>`;
          }
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
