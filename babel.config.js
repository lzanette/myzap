module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@controller': './src/controller/',
        '@entity': './src/entity/',
        '@config': './src/config/',
        '@global': './src/global/',
        '@database': './src/database/',
        '@errors': './src/errors/',
        '@services': './src/services/',
        '@repository':'./src/repository/'

      }
    }],
    ['@babel/plugin-transform-flow-strip-types'],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}