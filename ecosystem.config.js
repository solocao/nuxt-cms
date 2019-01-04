module.exports = {
  apps : [{
    name      : 'nuxt-cms',
    script    : 'build/main.js',
    env: {
      NODE_ENV: 'development',
      __ENV: 'development'
    },
    env_uat : {
      NODE_ENV: 'uat',
      __ENV: 'uat'
    },
    env_production : {
      NODE_ENV: 'production',
      __ENV: 'production'
    }
  }],
  deploy: {
    production: {
      user: "root",
      // host: ["xx.xx.xx.xx"],
      ref: "origin/master",
      ssh_options: "StrictHostKeyChecking=no",
      repo: "git@github.com:patricknieh/nuxt-cms.git",
      path: "/git/nuxt-cms",
      "pre-deploy": "git fetch --all",
      "post-deploy": "yarn --ignore-engines && yarn build:production && pm2 startOrRestart ecosystem.config.js --env production"
    }
  }
}
