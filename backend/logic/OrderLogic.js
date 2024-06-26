import async from "async";
import DatabaseManager from "../lib/DatabaseManager.js";
import { Consts } from "../lib/Consts.js";
import { Op, } from "sequelize";

class OrderLogic {
    static create(body, callback) {

        async.waterfall(
            [function (done) {
                //validation
                done(null)
            },
            function (done) { }
            ],
            function (err, data) {
                //return response
            }
        );
    }

    static list(params, callback) {
        var offset = params.start ? parseInt(params.start) : 0;

        var filter = {};
        if (params.orderNumber) filter["orderNumber"] = params.orderNumber;
        if (params.isPaymentProcessed == "true") filter["paymentRefNumber"] = {
            [Op.ne]: null
        }

        if (params.startDate) {
            filter["orderDate"] = {
                [Op.between]: [params.startDate, params.endDate]
            }
        }

        console.log(filter)

        async.waterfall(
            [
                function (done) {
                    DatabaseManager.order
                        .count({
                            where: filter,
                        })
                        .then((res) => {
                            done(null, res);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
                function (totalRecords, done) {
                    //fetch orders

                    DatabaseManager.order
                        .findAll({
                            attributes: [
                                "orderID",
                                "orderNumber",
                                "numberOfItems",
                                "orderDate",
                                "orderAmount",
                                "taxAmount",
                                "kraVerificationUrl",
                                "cuRefNumber",
                                "cuInvoiceNumber",
                                "paymentRefNumber",
                                "sysproStatus",
                                "sysproResponse",
                                "timeProcessedToSyspro"
                            ],
                            where: filter,
                            offset: offset,
                            order: [
                                ['orderDate', 'DESC'],
                            ],
                            limit: params.length ? parseInt(params.length) : 20,
                        })
                        .then((res) => {
                            done(null, totalRecords, res);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
            ],
            function (err, totalRecords, data) {
                if (err)
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: "Failed to fetch orders",
                        error: err,
                        data: [],
                        recordsTotal: 0,
                        recordsFiltered: 0,
                    });

                return callback({
                    status: Consts.httpCodeSuccess,
                    data: data,
                    recordsTotal: totalRecords,
                    recordsFiltered: totalRecords,
                });
            }
        );
    }

    static getOrder(orderId, callback) {
        var filter = {
            orderID: orderId,
        };
        async.waterfall(
            [
                function (done) {
                    //fetch orders
                    DatabaseManager.order
                        .findOne({
                            attributes: [
                                "orderID",
                                "orderNumber",
                                "numberOfItems",
                                "orderDate",
                                "orderAmount",
                                "taxAmount",
                                "kraVerificationUrl",
                                "cuRefNumber",
                                "cuInvoiceNumber",
                                "paymentRefNumber",
                                "sysproStatus",
                                "sysproResponse",
                                "timeProcessedToSyspro"
                            ],
                            include: [
                                {
                                    model: DatabaseManager.orderItem,
                                    required: true,
                                    as: "items",
                                },
                            ],
                            where: filter,
                        })
                        .then((res) => {
                            done(null, res);
                        })
                        .catch((err) => {
                            done(err);
                        });
                }
            ],
            function (err, data) {
                if (err)
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: "Failed to fetch order details",
                        error: err,
                    });
                return callback({
                    status: Consts.httpCodeSuccess,
                    data: data
                });
            }
        );
    }

}

export default OrderLogic;

