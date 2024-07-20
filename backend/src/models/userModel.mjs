import mongoose from "mongoose";

// Define userSchema for the User Model
const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
			trim: true,
		},
		lastname: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		phone: {
			type: Number,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
		verified: {
			type: Boolean,
			default: false,
		},
		active: {
			type: Boolean,
			default: false,
		},
		cart: {
			type: Array,
			default: [],
		},
		primaryAddress: {
			county: String,
			town: String,
		},
		secondaryAddresses: [
			{
				county: String,
				town: String,
			},
		],
		wishlist: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
	},
	{ timestamps: true },
);

userSchema.set("toJSON", {
	transform: (_doc, ret) => {
		delete ret.password;
		return ret;
	},
});

const User = mongoose.model("User", userSchema);

export default User;
