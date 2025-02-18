const validateTask = (req, res, next) => {
    const { title, status } = req.body;
  
    if (!title || !status) {
      return res.status(400).json({ error: 'Title and status are required' });
    }
  
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
  
    next();
  };
  
  module.exports = { validateTask };
  