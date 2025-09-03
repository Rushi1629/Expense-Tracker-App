// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ✅ Allow .cjs files (sometimes used in node_modules)
config.resolver.sourceExts.push('cjs');

module.exports = config;
