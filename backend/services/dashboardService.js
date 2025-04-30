const { Student, Class, Assignment, ClassStudent, StudentAssignment } = require('../models');
const { sequelize } = require('../models');


exports.customeQuery = async (query) => {
    const [rows] = await sequelize.query(query);
    return rows;
}
