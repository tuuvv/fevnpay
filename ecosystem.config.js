module.exports = {
  apps: [
    {
      name: 'fevnpay',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: './',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
