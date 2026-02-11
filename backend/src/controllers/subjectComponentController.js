import { SubjectComponent } from '../model/SubjectComponent.js';
export const createComponent = async (req, res) => {
  try {
    const { subject_id, component_name, max_marks, min_marks } = req.body;

    // Validation
    if (min_marks > max_marks) {
      return res.status(400).json({
        message: "Min marks cannot be greater than max marks"
      });
    }

    const existing = await SubjectComponent.findOne({
      where: { subject_id, component_name }
    });

    if (existing) {
      return res.status(400).json({
        message: "Component already exists for this subject"
      });
    }

    const component = await SubjectComponent.create({
      subject_id,
      component_name,
      max_marks,
      min_marks
    });

    res.status(201).json({
      message: "Component created successfully",
      component
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//
export const getComponentsBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params;

    const components = await SubjectComponent.findAll({
      where: { subject_id }
    });

    res.status(200).json(components);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateComponent = async (req, res) => {
  try {
    const { component_id } = req.params;
    const { max_marks, min_marks } = req.body;

    if (min_marks > max_marks) {
      return res.status(400).json({
        message: "Min marks cannot be greater than max marks"
      });
    }

    const component = await SubjectComponent.findByPk(component_id);

    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    await component.update({ max_marks, min_marks });

    res.status(200).json({
      message: "Component updated successfully",
      component
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComponent = async (req, res) => {
  try {
    const { component_id } = req.params;

    const component = await SubjectComponent.findByPk(component_id);

    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }

    await component.destroy();

    res.status(200).json({
      message: "Component deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
