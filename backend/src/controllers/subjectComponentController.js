import { SubjectComponent } from '../model/SubjectComponent.js';

// ======================
// CREATE COMPONENT
// ======================
export const createComponent = async (req, res) => {
  try {
    const { subject_id, type, max_marks, min_marks } = req.body;

    // Required validation
    if (!subject_id || !type || !max_marks || !min_marks) {
      return res.status(400).json({
        success: false,
        message: "subject_id, type, max_marks, min_marks are required"
      });
    }

    // Type validation – match your model's ENUM values
    const validTypes = ['INTERNAL', 'EXTERNAL', 'ASSIGNMENT', 'ATTENDANCE'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid component type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    // Marks validation
    if (min_marks > max_marks) {
      return res.status(400).json({
        success: false,
        message: "Min marks cannot be greater than max marks"
      });
    }

    // Unique check: one component of a given type per subject
    const existing = await SubjectComponent.findOne({
      where: { subject_id, type }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A component of type '${type}' already exists for this subject`
      });
    }

    const component = await SubjectComponent.create({
      subject_id,
      type,
      max_marks,
      min_marks
    });

    res.status(201).json({
      success: true,
      message: "Component created successfully",
      data: component
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// GET ALL COMPONENTS FOR A SUBJECT
// ======================
export const getComponentsBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params;

    const components = await SubjectComponent.findAll({
      where: { subject_id },
      order: [['type', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: components
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// UPDATE COMPONENT
// ======================
export const updateComponent = async (req, res) => {
  try {
    const { component_id } = req.params;
    const { max_marks, min_marks, type } = req.body;

    const component = await SubjectComponent.findByPk(component_id);
    if (!component) {
      return res.status(404).json({ success: false, message: "Component not found" });
    }

    // If type is being updated, validate it
    if (type) {
      const validTypes = ['INTERNAL', 'EXTERNAL', 'ASSIGNMENT', 'ATTENDANCE'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid component type. Must be one of: ${validTypes.join(', ')}`
        });
      }

      // Check for uniqueness if type is changing
      if (type !== component.type) {
        const existing = await SubjectComponent.findOne({
          where: {
            subject_id: component.subject_id,
            type
          }
        });
        if (existing) {
          return res.status(400).json({
            success: false,
            message: `A component of type '${type}' already exists for this subject`
          });
        }
      }
    }

    // Marks validation (if both provided)
    const newMax = max_marks !== undefined ? max_marks : component.max_marks;
    const newMin = min_marks !== undefined ? min_marks : component.min_marks;
    if (newMin > newMax) {
      return res.status(400).json({
        success: false,
        message: "Min marks cannot be greater than max marks"
      });
    }

    // Perform update
    await component.update({
      max_marks: newMax,
      min_marks: newMin,
      type: type || component.type
    });

    res.status(200).json({
      success: true,
      message: "Component updated successfully",
      data: component
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// DELETE COMPONENT
// ======================
export const deleteComponent = async (req, res) => {
  try {
    const { component_id } = req.params;

    const component = await SubjectComponent.findByPk(component_id);
    if (!component) {
      return res.status(404).json({
        success: false,
        message: "Component not found"
      });
    }

    await component.destroy();

    res.status(200).json({
      success: true,
      message: "Component deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};