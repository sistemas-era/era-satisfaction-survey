// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'survey-app',
      script: 'dist/server/entry.mjs',
      env_file: '.env',
    },
  ],
}