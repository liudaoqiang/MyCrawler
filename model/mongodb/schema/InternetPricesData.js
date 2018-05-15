/**
 * Created by bozhang on 2017/6/1.
 */
"use strict";

module.exports = {
    name: "data_internet_prices",
    data: {
        site_name: {type: String, required: true},
        market_name: {type: String},
        medicine_name: {type: String, required: true},
        medicine_price: {type: Number, required: true},
        produce_area: {type: String},
        medicine_type: {type: String},
        price_trend: {type: String},
        time: {type: String},
        public_date: {type: String}
    },
    index: [
        {medicine_name: 1, medicine_type:-1}
    ]
};