'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath, pathToFileURL } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '../config/config.json');
const rawConfig = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(rawConfig)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
Promise.all(
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')&& !file.endsWith('.test.js');
    })
    .map(async (file) => {
      // const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
       const modelPath = pathToFileURL(path.join(__dirname, file)).href; // Convert to file:// URL
      console.log("🚀 ~ modelPath:", modelPath)
      const modelModule =  await import(modelPath);
      console.log("🚀 ~ .forEach ~ modelModule:", modelModule.default)
      const model = modelModule.default(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    })
).then(() => {
  
  console.log('haha',Object.keys(db))
  Object.keys(db).forEach(modelName => {
    console.log("🚀 ~ Object.keys ~ modelName:", modelName)
    if (db[modelName].associate) {
      console.log("🚀 ~ Object.keys ~ associate:")
      db[modelName].associate(db);
    }
  });
  
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;