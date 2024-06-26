import async from "async";
import DatabaseManager from "../lib/DatabaseManager.js";
import { Consts } from "../lib/Consts.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Utils from "../lib/Utils.js"; 

class UserLogic {
    static list(callback) {
        async.waterfall(
            [
                function (done) {
                    DatabaseManager.user
                        .count({})
                        .then((res) => {
                            done(null, res);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
                function (totalRecords, done) {
                    DatabaseManager.user
                        .findAll({
                            attributes: ["name", "phone", "email", "session", "expiry", "sysproUser"],
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
                        message: "Failed to fetch users",
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

    static login(body, callback) {
        async.waterfall(
            [
                function (done) {
                    DatabaseManager.user
                        .findOne({
                            where: {
                                email: body.username,
                            },
                        })
                        .then((res) => {
                            if (res == undefined) {
                                done("Invalid credentials");
                                return;
                            }
                            done(null, res);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
                function (user, done) {



                    if (bcrypt.compareSync(body.password, user.password)) {
                        //generate and update a session
                        var params = {
                            session: Utils.randomString(40),
                            expiry: Utils.addTimeToDate(0, 0, 1, 0, 0)
                        }

                        DatabaseManager.user
                            .update(params, {
                                where: {
                                    email: user.email,
                                },
                            })
                            .then((res) => {
                                done(null, user);
                            })
                            .catch((err) => {
                                console.log(err)
                                done(err);
                            });
                    } else {

                        done("Invalid credentials");
                    }
                },
                function (user, done) {
                    //get user

                    DatabaseManager.user
                        .findOne({
                            attributes: ["name", "phone", "email", "session", "expiry", "sysproUser"],
                            where: {
                                email: user.email,
                            },
                        })
                        .then((res) => {
                            let jwtToken = jwt.sign(
                                {
                                    session: res.session,
                                    expiry: res.expiry,
                                    name: res.name,
                                    email: res.email
                                },
                                process.env["JWT_KEY"],
                                {
                                    expiresIn: process.env["JWT_EXPIRY_TIME"],
                                }
                            );

                            done(null, jwtToken);
                        })
                        .catch((err) => {
                            console.log(err)
                            done(err);
                        });
                }
            ],
            function (err, data) {
                if (err) {
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: "Failed to login",
                        error: err,
                    });
                }


                return callback({
                    status: Consts.httpCodeSuccess,
                    token: data,
                });
            }
        );
    }
    static create(body, callback) {
        async.waterfall(
            [
                function (done) {
                    //fetch orders
                    DatabaseManager.user
                        .findOne({
                            where: {
                                email: body.email,
                            },
                        })
                        .then((res) => {
                            if (res != undefined) {
                                done("User with similar details already exists");
                                return;
                            }
                            done(null);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
                function (done) {
                    //fetch orders

                    DatabaseManager.user
                        .create({
                            sysproUser: body.sysproUser,
                            sysproPassword: body.sysproPassword,
                            name: body.name,
                            phone: body.phone,
                            email: body.email,
                            password: bcrypt.hashSync(body.password, 8),
                        })
                        .then((res) => {
                            done(null, res);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
            ],
            function (err, data) {
                if (err)
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: "Failed to create user",
                        error: err,
                    });

                return callback({
                    status: Consts.httpCodeSuccess,
                    message: "User created successfully",
                });
            }
        );
    }

    static findById(userId, callback) {
        async.waterfall(
            [
                function (done) {
                    DatabaseManager.user
                        .findOne({
                            where: {
                                userID: userId,
                            },
                            attributes: ["name", "phone", "email", "session", "expiry", "sysproUser"],
                        })
                        .then((res) => {
                            done(null, res);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
            ],

            function (err, data) {
                if (err)
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: "Error fetching user",
                        error: err,
                    });

                return callback({
                    status: Consts.httpCodeSuccess,
                    user: data,
                });
            }
        );
    }

    static update(body, callback) {
        async.waterfall(
            [
                function (done) {
                    //fetch orders
                    DatabaseManager.user
                        .findOne({
                            where: {
                                userID: body.userId,
                            },
                        })
                        .then((res) => {
                            if ((res === undefined) | (res === null)) {
                                done("User not found");
                                return;
                            }
                            done(null);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
                function (done) {
                    DatabaseManager.user
                        .update(
                            {
                                name: body.name,
                                phone: body.phone,
                                email: body.email,
                                sysproPassword: body.sysproPassword,
                                sysproUser: body.sysproUser
                            },
                            { where: { userID: body.userId } }
                        )
                        .then((res) => {
                            done(null, res);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
            ],
            function (err, data) {
                if (err)
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: "Failed to update user",
                        error: err,
                    });

                return callback({
                    status: Consts.httpCodeSuccess,
                    message: "User updated successfully",
                });
            }
        );
    }

    static changePassword(body, callback) {
        async.waterfall(
            [
                function (done) {
                    if (Utils.isEmpty(body.userId)) {
                        done("UserId is required");
                        return;
                    }

                    if (Utils.isEmpty(body.oldPassword)) {
                        done("Old password is required");
                        return;
                    }

                    if (Utils.isEmpty(body.password)) {
                        done("Please provide new password");
                        return;
                    }

                    done(null);
                },

                function (done) {
                    DatabaseManager.user
                        .findOne({
                            where: { userID: body.userId },
                        })
                        .then((res) => {
                            if (!res) {
                                done("User not found");
                                return;
                            }
                            done(null, res);
                        })
                        .catch((error) => {
                            console.error("Failed to retrieve user:", error);
                            done(`User not found:, ${error.message}`, null);
                        });
                },

                function (user, done) {
                    if (!bcrypt.compareSync(body.oldPassword, user.password)) {
                        done("Incorrect Password!", null);
                        return;
                    }
                    DatabaseManager.user
                        .update(
                            {
                                password: bcrypt.hashSync(body.password, 8),
                            },
                            { where: { userID: body.userId } }
                        )
                        .then((res) => {
                            done(null, "Password updated succesfully");
                        })
                        .catch((error) => {
                            console.error("Error updating password:", error);
                            done(`Error updating password ${error.message}`, null);
                        });
                },
            ],
            function (err, data) {
                if (err) {
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: err,
                    });
                } else {
                    return callback({
                        status: Consts.httpCodeSuccess,
                        message: data,
                    });
                }
            }
        );
    }


    static resetPassword(body, callback) {
        async.waterfall(
            [
                function (done) {
                    if (Utils.isEmpty(body.userId)) {
                        done("UserId is required");
                        return;
                    }
                    if (Utils.isEmpty(body.password)) {
                        done("password is required");
                        return;
                    }

                    if (body.password !== body.confirmPassword) {
                        done("Passwords do not match");
                        return;
                    }

                    done(null);
                },

                function (done) {
                    DatabaseManager.user
                        .findOne({
                            where: { userID: body.userId },
                        })
                        .then((user) => {
                            if (user === null) {
                                done("user not found!");
                                return;
                            }
                            done(null, user);
                        })
                        .catch((err) => {
                            console.log("error");
                            done(err, null);
                        });
                },

                function (user, done) {
                    DatabaseManager.user
                        .update(
                            {
                                password: bcrypt.hashSync(body.password, 8),
                            },
                            { where: { userID: user.userID } }
                        )
                        .then((res) => {
                            done(null, "Password reset succesfull");
                        })
                        .catch((error) => {
                            done("Error resetting password", null);
                        });
                },
            ],
            function (err, data) {
                if (err) {
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: err,
                    });
                } else {
                    return callback({
                        status: Consts.httpCodeSuccess,
                        message: data,
                    });
                }
            }
        );
    }
}

export default UserLogic;
