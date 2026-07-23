module.exports = {
  apps: [
    {
      name: "tathyaforge",
      cwd: __dirname,
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "750M",
      kill_timeout: 5000,
      listen_timeout: 10000,
      time: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
