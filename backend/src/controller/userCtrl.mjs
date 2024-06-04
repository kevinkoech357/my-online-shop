import User from '../models/userModel.mjs';
import { hashData, verifyData } from '../utils/hashData.mjs';
import { sendOTP } from './OTPCtrl.mjs';
import capitalizeFirstLetter from '../utils/capitalizeName.mjs';
import validatePhone from '../utils/validatePhone.mjs';
import validateEmail from '../utils/validateEmail.mjs';

// Define a getUserDetails function that returns a JSON
// response with the specified user details

const getUserDetails = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, message: 'User details successfully retrieved.', details: user });
  } catch (error) {
    next(error);
  }
};

// Define updateUserDetails function that allows registered and authenticated
// Users to update their details such as firstname, lastname, phone and/or password

const updateUserDetails = async (req, res, next) => {
  const { _id } = req.user;
  const { firstname, lastname, phone, previousPassword, password } = req.body;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (previousPassword) {
      const passwordMatch = await verifyData(user.password, previousPassword);

      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: "Password mismatch. If you've forgotten your previous password, request a request link to your email account." });
      }

      if (password) user.password = await hashData(password);
    }

    if (phone) {
      // Validate phone
      await validatePhone(phone);
      user.phone = phone;
    }

    if (firstname) user.firstname = await capitalizeFirstLetter(firstname);
    if (lastname) user.lastname = await capitalizeFirstLetter(lastname);

    await user.save();
    res.status(200).json({ success: true, message: 'User details successfully updated.', details: user });
  } catch (error) {
    next(error);
  }
};

// Define changeEmail function that allows registered and authenticated
// Users to change their emails if need be
const changeEmail = async (req, res, next) => {
  const { _id } = req.user;
  const { email } = req.body;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Validate email
    await validateEmail(email);

    // Send OTP after successfully registering the user
    await sendOTP({
      email,
      subject: 'Verify your New Email Addresss',
      message: 'Please use the following OTP to verify your new email:'
    });

    // Update user's email and set verified to false
    user.email = email;
    user.verified = false;
    await user.save();

    res.status(200).json({ success: true, message: 'Email successfully updated. Verify OTP.', details: user });
  } catch (error) {
    next(error);
  }
};

// Define suspendAccount function that allows registered and authenticated
// Users to suspend/deactivate their accounts
// Can also be used by Admin

const suspendAccount = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.active = false;
    await user.save();

    req.session.destroy(); // Destroy session after suspending account

    res.status(200).json({ success: true, message: 'Account successfully deactivated.' });
  } catch (error) {
    next(error);
  }
};

// Define deleteAccount function that allows registered and authenticated
// Users to delete their accounts
// Can also be used by Admin

const deleteAccount = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await User.findByIdAndDelete(_id);
    req.session.destroy(); // Destroy session after deleting account

    res.status(200).json({ success: true, message: 'Account successfully deleted.' });
  } catch (error) {
    next(error);
  }
};

export { getUserDetails, updateUserDetails, changeEmail, suspendAccount, deleteAccount };
