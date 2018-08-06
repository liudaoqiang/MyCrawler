"use strict";

module.exports = {
    name: "medicine_factorys",
    data: {
        factory_name: {type: String},
        produced_medicines:[],
        factory_address: {type: String},
        factory_phone_number: {type: Number},
        factory_ERP_id: {type: Number},
        factory_contractors: [],
        factory_logo: {type: String}
    },
    // 索引
    index: [
        {factory_name: -1}, {unique: true, dropDups: true},
        {factory_ERP_id: -1}, {unique: true, dropDups: true},
    ]
};