window.onload = function() {
  window.ui = SwaggerUIBundle({
    url: "swagger.json", // <--- This is where you set your OpenAPI spec file
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });
};
