const manifestUrl = './manifest.json';

function waitFor(checkFn, { interval = 50, timeout = 10000 } = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function poll() {
      try {
        if (checkFn()) return resolve();
        if (Date.now() - start >= timeout) return reject(new Error('waitFor: timed out'));
        setTimeout(poll, interval);
      } catch (e) {
        reject(e);
      }
    })();
  });
}

function getScriptDomain(scriptUrl) {
  try {
    return new URL(scriptUrl, window.location.href).origin;
  } catch {
    return window.location.origin;
  }
}

function buildAssetPath(assetUrls) {
  if (!Array.isArray(assetUrls)) return [];
  const scriptDomain = getScriptDomain(document.currentScript?.src);
  const assetPaths = assetUrls.map((file) =>
    /^https?:\/\//.test(file) ? file : `${scriptDomain}/${file.replace(/^\/+/, '')}`,
  );
  return assetPaths;
}

function injectWebComponent(manifestUrl) {
  fetch(manifestUrl)
    .then((response) => response.json())
    .then((manifest) => {
      // manifest.entries.index.initial.js (array)
      // manifest.entries.index.initial.css (array)
      const initial = manifest?.entries?.index?.initial;
      if (initial) {
        // Add JS files as <script>
        if (Array.isArray(initial.js)) {
          const jsLinkArray = buildAssetPath(initial.js, manifestUrl);
          console.log('injecting js links', jsLinkArray);
          for (const jsFile of jsLinkArray) {
            const script = document.createElement('script');
            script.src = jsFile;
            script.defer = true;
            document.body.appendChild(script);
          }
        }
        waitFor(() => window.registerWishlistDock).then(() => {
          // inject css files into web component
          const cssLinkArray = buildAssetPath(initial.css, manifestUrl);
          console.log('injecting css links ', cssLinkArray);
          window.registerWishlistDock(cssLinkArray);
        });
      }
    });
}

injectWebComponent(manifestUrl);
