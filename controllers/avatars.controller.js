const uploadAvatarController = async (req, res, next) => {
  return res.status(200).json({ message: 'avatar uploaded' });
};

module.exports = uploadAvatarController;