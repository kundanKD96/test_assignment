// Sequelize model definitions with complete schema fields
// File: models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(`school_management_dashboard`, 'root', 'password', {
  dialect: 'mysql', // or 'postgres', etc.
});

const Student = sequelize.define('student', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const Class = sequelize.define('class', {
  class_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  class_name: { type: DataTypes.STRING, allowNull: false },
  class_alice: { type: DataTypes.STRING, allowNull: false },
  instructor: { type: DataTypes.STRING, allowNull: false }
});

const Assignment = sequelize.define('assignment', {
    assignment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    class_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    due_date: { type: DataTypes.DATE, allowNull: false },
    status: {
        type: DataTypes.ENUM('active', 'deactive'),
        defaultValue: 'active'
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    total_points: { type: DataTypes.INTEGER, allowNull: true },
});

const ClassStudent = sequelize.define('class_student', {
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    class_id: { type: DataTypes.INTEGER, allowNull: false },
    enrollment_date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
  timestamps: false,
  indexes: [{ unique: true, fields: ['student_id', 'class_id'] }]
});

const StudentAssignment = sequelize.define('student_assignment', {
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    assignment_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
    type: DataTypes.ENUM('assigned', 'submitted', 'graded', 'late'),
    defaultValue: 'assigned'
  },
  grade: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  submission_date: { type: DataTypes.DATE, allowNull: true },
}, {
  timestamps: true,
  indexes: [{ unique: true, fields: ['student_id', 'assignment_id'] }]
});

// Relationships
Student.belongsToMany(Class, { through: ClassStudent, foreignKey: 'student_id' });
Class.belongsToMany(Student, { through: ClassStudent, foreignKey: 'class_id' });

Class.hasMany(Assignment, { foreignKey: 'class_id' });
Assignment.belongsTo(Class, { foreignKey: 'class_id' });

Student.belongsToMany(Assignment, { through: StudentAssignment, foreignKey: 'student_id' });
Assignment.belongsToMany(Student, { through: StudentAssignment, foreignKey: 'assignment_id' });

StudentAssignment.belongsTo(Student, { foreignKey: 'student_id' });
StudentAssignment.belongsTo(Assignment, { foreignKey: 'assignment_id' });
Student.hasMany(StudentAssignment, { foreignKey: 'student_id' });
Assignment.hasMany(StudentAssignment, { foreignKey: 'assignment_id' });

module.exports = {
  sequelize,
  Student,
  Class,
  Assignment,
  ClassStudent,
  StudentAssignment
};
