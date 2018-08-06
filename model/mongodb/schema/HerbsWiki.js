"use strict";

module.exports = {
    name: "doc_herbs_wiki",
    data: {
        doc_id: {type: String},
        resource_link: {type: String},
        herb_name: {type: String},
        herb_des: {type: String},
        herb_efficacy: {},
        herb_attributes: {},
        herb_directions: {},
        herb_harvesting: {},
        herb_excerption: [],
        herb_drug: []
    },
    // 索引
    index: [
        {doc_id: -1}, {unique: true, dropDups: true},
        {herb_name: -1}, {unique: true, dropDups: true},
    ]
};