module.exports = {
  apps: [
    {
      name: "taiatiniyara",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "./",
      instances: 1,
      exec_mode: "fork",
      env_file: "./.env",
      env: {
        NODE_ENV: "production",
        PORT: 5188,
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
      max_memory_restart: "512M",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
    },
  ],
};
