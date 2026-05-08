'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {

      /* ===============================
         ADD INDEXES (VERY IMPORTANT)
      =============================== */

     // await queryInterface.addIndex('Subjects', ['subject_id'], { unique: true, transaction: t });
    //  await queryInterface.addIndex('Students', ['student_id'], { unique: true, transaction: t });
  //   await queryInterface.addIndex('Faculties', ['faculty_id'], { unique: true, transaction: t });
    //  await queryInterface.addIndex('Courses', ['course_id'], { unique: true, transaction: t });
    //  await queryInterface.addIndex('Departments', ['department_id'], { unique: true, transaction: t });
     // await queryInterface.addIndex('Roles', ['role_id'], { unique: true, transaction: t });

      /* ===============================
         BASIC RELATIONS
      =============================== */

      await queryInterface.addConstraint('Users', {
        fields: ['role_id'],
        type: 'foreign key',
        name: 'fk_users_role',
        references: { table: 'Roles', field: 'role_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        transaction: t
      });

      await queryInterface.addConstraint('Faculties', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'fk_faculty_user',
        references: { table: 'Users', field: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });

      await queryInterface.addConstraint('Faculties', {
        fields: ['department_id'],
        type: 'foreign key',
        name: 'fk_faculty_department',
        references: { table: 'Departments', field: 'department_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        transaction: t
      });

      await queryInterface.addConstraint('Courses', {
        fields: ['department_id'],
        type: 'foreign key',
        name: 'fk_course_department',
        references: { table: 'Departments', field: 'department_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        transaction: t
      });

      /* ===============================
         COURSE / CLASS / SUBJECT
      =============================== */

      await queryInterface.addConstraint('classes', {
        fields: ['course_id'],
        type: 'foreign key',
        name: 'fk_class_course',
        references: { table: 'Courses', field: 'course_id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('classes', {
        fields: ['mentor_id'],
        type: 'foreign key',
        name: 'fk_class_mentor',
        references: { table: 'Faculties', field: 'faculty_id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('Subjects', {
        fields: ['course_id'],
        type: 'foreign key',
        name: 'fk_subject_course',
        references: { table: 'Courses', field: 'course_id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        transaction: t
      });

      /* ===============================
         STUDENT MODULE
      =============================== */

      await queryInterface.addConstraint('Students', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'fk_student_user',
        references: { table: 'Users', field: 'user_id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('Students', {
        fields: ['department_id'],
        type: 'foreign key',
        name: 'fk_student_department',
        references: { table: 'Departments', field: 'department_id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('Students', {
        fields: ['course_id'],
        type: 'foreign key',
        name: 'fk_student_course',
        references: { table: 'Courses', field: 'course_id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('Students', {
        fields: ['class_pk'],
        type: 'foreign key',
        name: 'fk_student_class',
        references: { table: 'classes', field: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        transaction: t
      });

      /* ===============================
         ATTENDANCE
      =============================== */

      await queryInterface.addConstraint('Attendances', {
        fields: ['student_id'],
        type: 'foreign key',
        name: 'fk_attendance_student',
        references: { table: 'Students', field: 'student_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('Attendances', {
        fields: ['subject_id'],
        type: 'foreign key',
        name: 'fk_attendance_subject',
        references: { table: 'Subjects', field: 'subject_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('Attendances', {
        fields: ['faculty_id'],
        type: 'foreign key',
        name: 'fk_attendance_faculty',
        references: { table: 'Faculties', field: 'faculty_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction: t
      });

      /* ===============================
         TIMETABLE
      =============================== */

      await queryInterface.addConstraint('Timetables', {
        fields: ['class_pk'],
        type: 'foreign key',
        name: 'fk_timetable_class',
        references: { table: 'classes', field: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('Timetables', {
        fields: ['subject_id'],
        type: 'foreign key',
        name: 'fk_timetable_subject',
        references: { table: 'Subjects', field: 'subject_id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('Timetables', {
        fields: ['faculty_id'],
        type: 'foreign key',
        name: 'fk_timetable_faculty',
        references: { table: 'Faculties', field: 'faculty_id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        transaction: t
      });

      /* ===============================
         FEES
      =============================== */

      await queryInterface.addConstraint('StudentFees', {
        fields: ['student_id'],
        type: 'foreign key',
        name: 'fk_studentfee_student',
        references: { table: 'Students', field: 'student_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('StudentFees', {
        fields: ['fee_structure_id'],
        type: 'foreign key',
        name: 'fk_studentfee_structure',
        references: { table: 'FeeStructures', field: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('FeePayments', {
        fields: ['student_id'],
        type: 'foreign key',
        name: 'fk_feepayment_student',
        references: { table: 'Students', field: 'student_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('FeePayments', {
        fields: ['fee_structure_id'],
        type: 'foreign key',
        name: 'fk_feepayment_structure',
        references: { table: 'FeeStructures', field: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
        transaction: t
      });

      /* ===============================
         EXAMS
      =============================== */

      await queryInterface.addConstraint('ExamTimetables', {
        fields: ['exam_id'],
        type: 'foreign key',
        name: 'fk_examtimetable_exam',
        references: { table: 'Exams', field: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await queryInterface.addConstraint('ExamTimetables', {
        fields: ['subject_id'],
        type: 'foreign key',
        name: 'fk_examtimetable_subject',
        references: { table: 'Subjects', field: 'subject_id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction: t
      });

      await t.commit();

    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeConstraint('Users', 'fk_users_role', { transaction: t });
      await queryInterface.removeConstraint('Faculties', 'fk_faculty_user', { transaction: t });
      await queryInterface.removeConstraint('Faculties', 'fk_faculty_department', { transaction: t });
      await queryInterface.removeConstraint('Courses', 'fk_course_department', { transaction: t });
      await queryInterface.removeConstraint('classes', 'fk_class_course', { transaction: t });
      await queryInterface.removeConstraint('classes', 'fk_class_mentor', { transaction: t });
      await queryInterface.removeConstraint('Subjects', 'fk_subject_course', { transaction: t });
      await queryInterface.removeConstraint('Students', 'fk_student_user', { transaction: t });
      await queryInterface.removeConstraint('Students', 'fk_student_department', { transaction: t });
      await queryInterface.removeConstraint('Students', 'fk_student_course', { transaction: t });
      await queryInterface.removeConstraint('Students', 'fk_student_class', { transaction: t });
      await queryInterface.removeConstraint('Attendances', 'fk_attendance_student', { transaction: t });
      await queryInterface.removeConstraint('Attendances', 'fk_attendance_subject', { transaction: t });
      await queryInterface.removeConstraint('Attendances', 'fk_attendance_faculty', { transaction: t });
      await queryInterface.removeConstraint('Timetables', 'fk_timetable_class', { transaction: t });
      await queryInterface.removeConstraint('Timetables', 'fk_timetable_subject', { transaction: t });
      await queryInterface.removeConstraint('Timetables', 'fk_timetable_faculty', { transaction: t });

      await t.commit();

    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
};
