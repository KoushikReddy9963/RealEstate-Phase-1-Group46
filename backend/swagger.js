import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger-output.json', 'utf-8'));

const customCssUrl = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css';
const customJs = [
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
  'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
];

export const swaggerUiServe = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerDocument, false, {
  customCssUrl,
  customJs,
});