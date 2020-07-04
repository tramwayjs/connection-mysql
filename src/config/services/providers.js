import {
    MySQLProvider,
} from '../../providers';

export default {
    "provider.mysql": {
        "class": MySQLProvider,
        "constructor": [
            {"type": "parameter", "key": "mysql"}
        ],
        "functions": []
    },
};