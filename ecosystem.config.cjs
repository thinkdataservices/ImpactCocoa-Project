module.exports = {
  apps: [
    {
      name: 'thinkdata-be',
      cwd: './apps/be',
      script: 'bun',
      args: 'run start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
    {
      name: 'thinkdata-fe',
      cwd: './apps/fe',
      script: 'bun',
      args: 'run preview',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3030,
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
  ],
};
