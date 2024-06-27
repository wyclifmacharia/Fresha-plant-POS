import async from 'async';
import DatabaseManager from '../lib/DatabaseManager.js';
import { Consts } from '../lib/Consts.js';
import validator from 'validator';
import { Op } from 'sequelize';
import { ValidationError } from 'sequelize';

class ShopLogic {
    //utility function to validate name
    static isValidName(name) {
        return validator.matches(name, /^[a-zA-Z]+$/);
    }

    
    //create shop
    static create(body, callback) {
        async.waterfall([
            function (done) {

                // validation logic
                let errors =[];
                if(!body.name || !ShopLogic.isValidName(body.name)){
                    errors.push("Name is required and should be in characters.");
                }
                if(!body.location || !validator.isLength(body.location,{min:1})){
                    errors.push("location is required.");
                }
                if(body.tillNumber && !validator.isNumeric(body.tillNumber,{min:1})){
                    errors.push("Till is required.");
                }
                if(body.bank && !validator.isLength(body.bank,{min:1})){
                    errors.push("Bank name is required.");
                }

                if(errors.length > 0){

                    return done ({ValidationErrors:errors});
                }

                done(null);
            },
            function (done) {
                DatabaseManager.shop.create(body)
                    .then(shop => done(null, shop))
                    .catch(err => done(err));
            }
        ], function (err, shop) {
            if (err) {
                return callback({
                    status: Consts.httpCodeSeverError,
                    message: 'Failed to create shop',
                    error: err,
                });
            }

            return callback({
                status: Consts.httpCodeSuccess,
                data: shop,
            });
        });
    }
    //list shop
    static list(params, callback) {
        const offset = params.start ? parseInt(params.start) : 0;
        const limit = params.length ? parseInt(params.length) : 20;

        const filter = {};
        if (params.name) filter.name = { [Op.like]: `%${params.name}%` };
        if (params.location) filter.location = { [Op.like]: `%${params.location}%` };
        if (params.tillNumber) filter.tillNumber = { [Op.like]: `%${params.tillNumber}%` };
        if (params.bank) filter.bank = { [Op.like]: `%${params.bank}%` };

        async.waterfall([
            function (done) {
                DatabaseManager.shop.count({ where: filter })
                    .then(totalRecords => done(null, totalRecords))
                    .catch(err => done(err));
            },
            function (totalRecords, done) {
                DatabaseManager.shop.findAll({
                    attributes: [
                        'shopID', 'name', 'location', 'tillNumber', 'bank'
                    ],
                    where: filter,
                    offset,
                    limit,
                    order: [['name', 'ASC']]
                })
                .then(shops => done(null, totalRecords, shops))
                .catch(err => done(err));
            }
        ], function (err, totalRecords, shops) {
            if (err) {
                return callback({
                    status: Consts.httpCodeSeverError,
                    message: 'Failed to fetch shops',
                    error: err,
                    data: [],
                    recordsTotal: 0,
                    recordsFiltered: 0,
                });
            }

            return callback({
                status: Consts.httpCodeSuccess,
                data: shops,
                recordsTotal: totalRecords,
                recordsFiltered: totalRecords,
            });
        });
    }


}

export default ShopLogic;
