const enviroment = {};

enviroment.development = {
    httpPort:3000,
    httpsPort:3001,
    env:"development"
};

enviroment.production = {
    httpPort:5000,
    httpPort:5001,
    env:"production"
};

const choosenEnv = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV : " ";
const choosenConfig = typeof(enviroment[choosenEnv]) === "undefined" ? enviroment.development:enviroment[choosenEnv];

module.exports = choosenConfig;