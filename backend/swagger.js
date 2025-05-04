import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'swagger-output.json'), 'utf-8')
);

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