"use strict";

module.exports = {
    name: "medicine_prescriptions",
    data: {
        medicine_name: {type: String},
        herbs: [],
        cell_amount: {type: Number},
        cell_unit: {type: String},
        data_resource: {type: String},
        resource_link: {type: String}
    },
    // 索引
    index: [
        {medicine_name: -1}, {unique: true, dropDups: true},
    ]
};