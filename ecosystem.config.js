module.exports = {
  apps: [
    {
      name: 'fevnpay-staging',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3100',
      cwd: '/www/wwwroot/staging/fevnpay',
      env: {
        NODE_ENV: 'staging'
      }
    }
  ]
}

