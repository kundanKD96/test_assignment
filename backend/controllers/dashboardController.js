const dashboardData = require('../services/dashboardService.js');
const { sequelize } = require('../models');
const {Assignment, Class} = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const class_name = req?.query?.class;
    const sortBy = req?.query?.sort;
    const assignment_type = req?.query?.assignment_type;
    let condition = "a.status = 'active'"
    if ( class_name && class_name!== "all" ) condition += ` AND c.class_alice = '${class_name}'`
    if ( assignment_type == "upcoming" ) condition += ` AND a.due_date > CURDATE()`
    if ( assignment_type == "past" ) condition += ` AND a.due_date < CURDATE()`
    let orderBy = 'ORDER BY due_date ASC'
    if ( sortBy == "alphabetical" ) orderBy = 'ORDER BY a.title ASC'
    if ( sortBy == "completion" ) orderBy = 'ORDER BY submissionProgress DESC'
    if ( sortBy == "createdAt" ) orderBy = 'ORDER BY a.createdAt DESC'
    if ( sortBy == "dueDate" ) orderBy = 'ORDER BY due_date ASC'
    let result = await dashboardData.customeQuery(`
        SELECT
            c.class_name AS class,
            a.title AS title,
            a.status AS status,
            a.due_date AS dueDate,
            COUNT(DISTINCT sa.student_id) AS studentsAssigned,
            CONCAT(COUNT(DISTINCT CASE WHEN sa.status = 'submitted' THEN sa.student_id END), '/', COUNT(DISTINCT sa.student_id)) AS submissionStatus,
            ROUND((COUNT(DISTINCT CASE WHEN sa.status = 'submitted' THEN sa.student_id END) / COUNT(DISTINCT sa.student_id)) * 100) AS submissionProgress,
            c.class_alice AS classAlice
        FROM
            classes c
            JOIN assignments a ON c.class_id = a.class_id
            LEFT JOIN student_assignments sa ON a.assignment_id = sa.assignment_id
        WHERE
            ${condition}
        GROUP BY
            c.class_id, a.assignment_id
        ${orderBy};
    `)


    let analyticsData = await dashboardData.customeQuery(`
      SELECT
      COUNT(DISTINCT a.assignment_id) AS total_assignments,
      ROUND(
          AVG(
              CASE
                  WHEN sa.status IN ('submitted', 'graded') THEN 1
                  ELSE 0
              END
          ) * 100,
          2
      ) AS avg_completion_rate,
      ROUND(AVG(sa.grade), 2) AS avg_grade
  FROM
      assignments a
      LEFT JOIN student_assignments sa ON a.assignment_id = sa.assignment_id
  WHERE
      a.createdAt >= NOW() - INTERVAL 30 DAY;`
    )
    analyticsData = analyticsData[0]

    let listStudents = await dashboardData.customeQuery(`
      SELECT
        s.name,
        c.class_name AS course,
        issue_data.issue,
        issue_data.assignments,
        s.id
      FROM students s
      JOIN (
        SELECT
          sa.student_id,
          'Late Submission' AS issue,
          COUNT(*) AS assignments
        FROM student_assignments sa
        WHERE sa.status = 'late'
        GROUP BY sa.student_id

        UNION

        SELECT
          sa.student_id,
          'Missing Assignment' AS issue,
          COUNT(*) AS assignments
        FROM student_assignments sa
        WHERE sa.status = 'assigned'
        GROUP BY sa.student_id

        UNION

        SELECT
          sa.student_id,
          'Low Grade' AS issue,
          ROUND(AVG(sa.grade), 2) AS assignments
        FROM student_assignments sa
        WHERE sa.status = 'graded' AND sa.grade < 50
        GROUP BY sa.student_id
      ) AS issue_data ON s.id = issue_data.student_id
      LEFT JOIN class_students cs ON cs.student_id = s.id
      LEFT JOIN classes c ON c.class_id = cs.class_id;`
  )

    res.status(200).json({ success: true, data: {cardData : result, analyticsData: analyticsData, listStudents: listStudents} });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    let { title, description, due_date, class_name, status, total_points, dueTime } = req.body;
    due_date +=` ${dueTime}` + ':00'

    if (!title || !description || !due_date || !class_name) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    let class_id = ""
    if (class_name) class_id = await Class.findOne({ where: { class_alice: class_name }, raw: true, attributes: ['class_id'] } );
    if (!class_id) return res.status(404).json({ success: false, message: 'Class not found' });
    class_id = class_id?.class_id
    const assignment = await Assignment.create({
      title,
      description,
      due_date,
      class_id,
      status,
      total_points
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    console.error('Create assignment error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
