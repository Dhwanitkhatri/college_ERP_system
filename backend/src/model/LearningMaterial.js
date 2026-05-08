import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const LearningMaterial = sequelize.define('LearningMaterial', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    file_path: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    file_type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'File size in KB'
    },
    subject_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'subjects',
            key: 'subject_id'
        }
    },
    faculty_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'faculty',
            key: 'faculty_id'
        }
    },
    class_pk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'classes',
            key: 'id'
        }
    },
    course_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'courses',
            key: 'course_id'
        }
    }
}, {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updated_at'
});