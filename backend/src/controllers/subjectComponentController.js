import { SubjectComponent } from '../model/SubjectComponent.js';

export const createComponent = async (req, res) => {
  try {
    const { subject_id, component_name, type, max_marks, min_marks } = req.body;

    // Required validation
    if (!subject_id || !component_name || !type || !max_marks || !min_marks) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Type validation
    const validTypes = ['EXAM', 'ASSIGNMENT', 'ATTENDANCE', 'QUIZ'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid component type"
      });
    }

    // Marks validation
    if (min_marks > max_marks) {
      return res.status(400).json({
        success: false,
        message: "Min marks cannot be greater than max marks"
      });
    }

    // Unique check (IMPORTANT 🔥)
    const existing = await SubjectComponent.findOne({
      where: { subject_id, component_name, type }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Component already exists for this subject with same type"
      });
    }

    const component = await SubjectComponent.create({
      subject_id,
      component_name,
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

//
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


export const updateComponent = async (req, res) => {
  try {
    const { component_id } = req.params;
    const { max_marks, min_marks, type } = req.body;

    const component = await SubjectComponent.findByPk(component_id);

    if (!component) {
      return res.status(404).json({ success: false, message: "Component not found" });
    }

    if (type) {
      const validTypes = ['EXAM', 'ASSIGNMENT', 'ATTENDANCE', 'QUIZ'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          message: "Invalid component type"
        });
      }
    }

    // Marks validation
    if (min_marks > max_marks) {
      return res.status(400).json({
        success: false,
        message: "Min marks cannot be greater than max marks"
      });
    }

    await component.update({
      max_marks,
      min_marks,
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
