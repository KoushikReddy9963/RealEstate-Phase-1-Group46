import swaggerAutogen from "swagger-autogen";
import YAML from "yamljs";

const doc = YAML.load("./swagger.yaml");

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./routes/userRoutes.js",
  "./routes/buyerRoutes.js",
  "./routes/sellerRoutes.js",
  "./routes/employeeRoutes.js",
  "./routes/adminRoutes.js",
  "./routes/AdvertisementRoutes.js",
  "./routes/feedbackroutes.js",
];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
