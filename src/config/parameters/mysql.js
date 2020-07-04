const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    MYSQL_DATABASE
} = process.env;

const settings = {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
};

export default settings;