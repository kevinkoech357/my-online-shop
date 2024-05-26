import User from '../models/userModel.mjs';

// Define a adminGetUserDetails function that returns a JSON
// response with the specified user details

const adminGetUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'User details successfully retrieved.', details: user });
  } catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

// Define adminGetAllUsers functions that allows admin to get
// all registered users

const adminGetAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();

    if (!allUsers) {
      return res.status(200).json({ success: true, message: 'No users available.' });
    }

    return res.status(200).json({ success: true, message: 'All users successfully retrieved', users: allUsers });
  } catch (error) {
    console.error('Error retrieving user details:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

// Define adminSuspendAccount function that allows registered and authenticated
// Users to suspend/deactivate their accounts
// Can also be used by Admin

const adminSuspendAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.active = false;
    await user.save();

    res.status(200).json({ success: true, message: 'Account successfully deactivated.' });
  } catch (error) {
    console.error('Error suspending account:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

// Define adminRecoverAccount function that allows registered users with suspended/deactivated
// accounts to restore them
// Can also be used by Admin

const adminRecoverAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.active = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Account successfully recovered.' });
  } catch (error) {
    console.error('Error suspending account:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

// Define adminDeleteAccount function that allows registered and authenticated
// Users to delete their accounts
// Can also be used by Admin

const adminDeleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Account successfully deleted.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

export { adminGetUserDetails, adminGetAllUsers, adminSuspendAccount, adminRecoverAccount, adminDeleteAccount };
