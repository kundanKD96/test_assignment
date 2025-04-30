const {
    sequelize,
    Student,
    Class,
    Assignment,
    ClassStudent,
    StudentAssignment
  } = require('../models');
  
  (async () => {
    try {
      await sequelize.sync({ force: true }); // DANGER: resets DB, use only in dev
  
      // Students
     let studentsData = [
        { name: 'Alice', email: 'alice412@mail.com' },
        { name: 'David', email: 'david982@example.com' },
        { name: 'Grace', email: 'grace407@test.org' },
        { name: 'Bob', email: 'bob683@example.com' },
        { name: 'Ivy', email: 'ivy594@mail.com' },
        { name: 'Charlie', email: 'charlie718@example.com' },
        { name: 'Helen', email: 'helen101@test.org' },
        { name: 'Jack', email: 'jack821@mail.com' },
        { name: 'Eve', email: 'eve258@example.com' },
        { name: 'Frank', email: 'frank376@test.org' },
        { name: 'David', email: 'david423@mail.com' },
        { name: 'Alice', email: 'alice300@example.com' },
        { name: 'Ivy', email: 'ivy910@test.org' },
        { name: 'Charlie', email: 'charlie532@mail.com' },
        { name: 'Grace', email: 'grace719@example.com' },
        { name: 'Helen', email: 'helen637@mail.com' },
        { name: 'Frank', email: 'frank209@example.com' },
        { name: 'Jack', email: 'jack394@test.org' },
        { name: 'Bob', email: 'bob104@example.com' },
        { name: 'Eve', email: 'eve811@mail.com' }
      ]
      
      const students = await Student.bulkCreate(studentsData);
  
      // Classes
      const classes = await Class.bulkCreate([
        { class_name: 'Science 101', instructor: 'Mr. Smith', class_alice: "science101" },
        { class_name: 'Biology 202', instructor: 'Dr. Brown', class_alice: "biology202" },
        { class_name: 'Chemistry 101', instructor: 'Dr. Brown', class_alice: "chemistry101" }
      ]);
  
      let ClassStudentData = [
        { student_id: students[0].id, class_id: classes[1].class_id },
        { student_id: students[5].id, class_id: classes[2].class_id },
        { student_id: students[12].id, class_id: classes[0].class_id },
        { student_id: students[3].id, class_id: classes[1].class_id },
        { student_id: students[8].id, class_id: classes[2].class_id },
        { student_id: students[14].id, class_id: classes[0].class_id },
        { student_id: students[1].id, class_id: classes[2].class_id },
        { student_id: students[19].id, class_id: classes[1].class_id },
        { student_id: students[6].id, class_id: classes[0].class_id },
        { student_id: students[10].id, class_id: classes[2].class_id },
        { student_id: students[2].id, class_id: classes[1].class_id },
        { student_id: students[16].id, class_id: classes[0].class_id },
        { student_id: students[4].id, class_id: classes[1].class_id },
        { student_id: students[9].id, class_id: classes[0].class_id },
        { student_id: students[7].id, class_id: classes[2].class_id },
        { student_id: students[15].id, class_id: classes[1].class_id },
        { student_id: students[11].id, class_id: classes[0].class_id },
        { student_id: students[13].id, class_id: classes[2].class_id },
        { student_id: students[17].id, class_id: classes[1].class_id },
        { student_id: students[18].id, class_id: classes[0].class_id }
      ]
      
      // Enrollments
      await ClassStudent.bulkCreate(ClassStudentData);
  
      let AssignmentData = [
        { title: 'Marine Biodiversity Study', due_date: new Date('2025-05-01'), class_id: classes[1].class_id, status: "active", description: "Examine the relationship between marine species and ocean ecosystems.", total_points: 80 },
        { title: 'Forest Ecosystem Dynamics', due_date: new Date('2025-05-02'), class_id: classes[0].class_id, status: "active", description: "Explore the dynamics of plant and animal life in temperate forests.", total_points: 90 },
        { title: 'Pollution and Biodiversity', due_date: new Date('2025-05-03'), class_id: classes[2].class_id, status: "active", description: "Investigate how pollution affects biodiversity in aquatic ecosystems.", total_points: 70 },
        { title: 'Wetlands and Water Conservation', due_date: new Date('2025-05-04'), class_id: classes[1].class_id, status: "active", description: "Create a plan to conserve wetland ecosystems and prevent water pollution.", total_points: 60 },
        { title: 'Tropical Rainforest Exploration', due_date: new Date('2025-05-05'), class_id: classes[2].class_id, status: "active", description: "Study the biodiversity and conservation of tropical rainforests.", total_points: 100 },
        { title: 'Urban Ecosystem Research', due_date: new Date('2025-05-06'), class_id: classes[0].class_id, status: "active", description: "Evaluate the balance between urban growth and natural ecosystems.", total_points: 90 },
        { title: 'Species Preservation Project', due_date: new Date('2025-05-07'), class_id: classes[1].class_id, status: "active", description: "Study endangered species and propose strategies for their preservation.", total_points: 50 },
        { title: 'Mountain Ecosystem Survey', due_date: new Date('2025-05-08'), class_id: classes[2].class_id, status: "active", description: "Research the flora and fauna of mountainous ecosystems.", total_points: 70 },
        { title: 'Aquatic Food Web Study', due_date: new Date('2025-05-09'), class_id: classes[0].class_id, status: "active", description: "Analyze the structure and stability of aquatic food webs.", total_points: 100 },
        { title: 'Keystone Species Analysis', due_date: new Date('2025-05-10'), class_id: classes[1].class_id, status: "active", description: "Investigate the role of keystone species in maintaining ecosystem health.", total_points: 60 },
        { title: 'Ecological Restoration Techniques', due_date: new Date('2025-05-11'), class_id: classes[2].class_id, status: "active", description: "Study the techniques used in ecological restoration of damaged ecosystems.", total_points: 80 },
        { title: 'Marine Ecosystem Health', due_date: new Date('2025-05-12'), class_id: classes[0].class_id, status: "active", description: "Research the impacts of climate change on marine ecosystems.", total_points: 70 },
        { title: 'Sustainable Agriculture Practices', due_date: new Date('2025-05-13'), class_id: classes[1].class_id, status: "active", description: "Examine sustainable agricultural practices and their environmental impact.", total_points: 90 },
        { title: 'Coral Reef Conservation', due_date: new Date('2025-05-14'), class_id: classes[2].class_id, status: "active", description: "Present conservation methods for coral reef ecosystems.", total_points: 100 },
        { title: 'Arctic Ecosystem Study', due_date: new Date('2025-05-15'), class_id: classes[0].class_id, status: "active", description: "Study the effects of global warming on Arctic ecosystems and species.", total_points: 80 },
        { title: 'Desert Ecosystem Analysis', due_date: new Date('2025-05-16'), class_id: classes[1].class_id, status: "active", description: "Research the unique adaptations of species in desert ecosystems.", total_points: 60 },
        { title: 'Ocean Acidification Impact', due_date: new Date('2025-05-17'), class_id: classes[2].class_id, status: "active", description: "Research the effects of ocean acidification on marine life.", total_points: 90 },
        { title: 'Wildlife Habitat Simulation', due_date: new Date('2025-05-18'), class_id: classes[0].class_id, status: "active", description: "Simulate wildlife habitat changes due to human development.", total_points: 70 },
        { title: 'Forest Conservation Plan', due_date: new Date('2025-05-19'), class_id: classes[1].class_id, status: "active", description: "Create a forest conservation plan addressing deforestation and biodiversity loss.", total_points: 100 },
        { title: 'Invasive Species Study', due_date: new Date('2025-05-20'), class_id: classes[2].class_id, status: "active", description: "Summarize the effects of invasive species on ecosystems and mitigation strategies.", total_points: 50 }
      ]
      
      
      // Assignments
      const assignments = await Assignment.bulkCreate(AssignmentData);
      const StudentAssignmentData = [
        { student_id: students[0].id, assignment_id: assignments[0].assignment_id, status: 'submitted', grade: 75, submission_date: new Date('2025-04-28 10:30:00') },
        { student_id: students[1].id, assignment_id: assignments[1].assignment_id, status: 'graded', grade: 80, submission_date: new Date('2025-04-28 14:22:00') },
        { student_id: students[2].id, assignment_id: assignments[2].assignment_id, status: 'assigned', grade: 65, submission_date: null },
        { student_id: students[3].id, assignment_id: assignments[3].assignment_id, status: 'late', grade: 55, submission_date: new Date('2025-04-29 09:10:00') },
        { student_id: students[4].id, assignment_id: assignments[4].assignment_id, status: 'graded', grade: 90, submission_date: new Date('2025-04-28 15:00:00') },
        { student_id: students[5].id, assignment_id: assignments[5].assignment_id, status: 'submitted', grade: 85, submission_date: new Date('2025-04-29 09:30:00') },
        { student_id: students[6].id, assignment_id: assignments[6].assignment_id, status: 'assigned', grade: 45, submission_date: null },
        { student_id: students[7].id, assignment_id: assignments[7].assignment_id, status: 'graded', grade: 65, submission_date: new Date('2025-04-28 18:20:00') },
        { student_id: students[8].id, assignment_id: assignments[8].assignment_id, status: 'submitted', grade: 95, submission_date: new Date('2025-04-29 07:00:00') },
        { student_id: students[9].id, assignment_id: assignments[9].assignment_id, status: 'late', grade: 50, submission_date: new Date('2025-04-28 19:15:00') },
        { student_id: students[10].id, assignment_id: assignments[10].assignment_id, status: 'graded', grade: 70, submission_date: new Date('2025-04-28 20:30:00') },
        { student_id: students[11].id, assignment_id: assignments[11].assignment_id, status: 'assigned', grade: 60, submission_date: null },
        { student_id: students[12].id, assignment_id: assignments[12].assignment_id, status: 'submitted', grade: 85, submission_date: new Date('2025-04-28 22:00:00') },
        { student_id: students[13].id, assignment_id: assignments[13].assignment_id, status: 'graded', grade: 90, submission_date: new Date('2025-04-28 23:30:00') },
        { student_id: students[14].id, assignment_id: assignments[14].assignment_id, status: 'late', grade: 75, submission_date: new Date('2025-04-29 01:00:00') },
        { student_id: students[15].id, assignment_id: assignments[15].assignment_id, status: 'assigned', grade: 50, submission_date: null },
        { student_id: students[16].id, assignment_id: assignments[16].assignment_id, status: 'submitted', grade: 80, submission_date: new Date('2025-04-29 05:30:00') },
        { student_id: students[17].id, assignment_id: assignments[17].assignment_id, status: 'graded', grade: 60, submission_date: new Date('2025-04-28 12:30:00') },
        { student_id: students[18].id, assignment_id: assignments[18].assignment_id, status: 'submitted', grade: 95, submission_date: new Date('2025-04-28 13:00:00') },
        { student_id: students[19].id, assignment_id: assignments[19].assignment_id, status: 'late', grade: 45, submission_date: new Date('2025-04-29 04:10:00') }
      ]
      
      
      
      
      // Student Assignments
      await StudentAssignment.bulkCreate(StudentAssignmentData);
  
      console.log('Sample data inserted successfully!');
      process.exit();
    } catch (error) {
      console.error('Error seeding database:', error);
      process.exit(1);
    }
  })();
  