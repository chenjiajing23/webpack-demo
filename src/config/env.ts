const env = {
  ENV: (window.ENV ? window.ENV.toLowerCase() : 'local') as
    | 'dev'
    | 'test'
    | 'stage'
    | 'prod'
    | 'local'
};

export default env;
