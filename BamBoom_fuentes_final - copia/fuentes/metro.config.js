const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permitir que Metro cargue archivos WebAssembly
config.resolver.assetExts.push('wasm');

module.exports = config;