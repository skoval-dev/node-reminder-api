const env = process.env.NODE_ENV || 'development';

if( env === 'development' || env === 'test' ){
    let config = require('./config.json');
    const env_config = config[env];
    Object.keys(env_config).forEach((key) => {
        process.env[key] = env_config[key];
    });
}

console.log('env *****', env);
