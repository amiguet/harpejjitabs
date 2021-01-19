module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    //"**/*.{css,ico,png,svg,html,js,json,mp3,txt}"
    "**/*.{ico,png,svg,html,json,mp3,txt}"
  ],
  //mode: 'development',
  "swDest": "dist/service-worker.js",
  "skipWaiting": true,
  "runtimeCaching": [{
    "urlPattern": /.*\.(?:js|html|css)$/,
    "handler": "StaleWhileRevalidate",
    "options": {
      "cacheName": "srcFile",
      "expiration": {
        "maxEntries": 60,
        "maxAgeSeconds": 30 * 24 * 60 * 60, // 30 Days
      }
    }
  },
  {
    "urlPattern": /.*\.(?:mp3)$/,
    "handler": "CacheFirst",
    "options": {
      "cacheName": "mp3File",
      "expiration": {
        "maxEntries": 60,
        "maxAgeSeconds": 30 * 24 * 60 * 60, // 30 Days
      }
    }
  }]
};