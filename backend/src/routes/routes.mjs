import adminRouter from "./adminRoute.mjs";
import authRouter from "./authRoute.mjs";
import blogRouter from "./blogRoute.mjs";
import brandRouter from "./brandRoute.mjs";
import locationRouter from "./locationRoute.mjs";
import newsletterRouter from "./newsletterRoute.mjs";
import orderRouter from "./orderRoute.mjs";
import productCategoryRouter from "./productCategoryRoute.mjs";
import productRouter from "./productRoute.mjs";
import userRouter from "./userRoute.mjs";

export default {
	admin: adminRouter,
	auth: authRouter,
	blog: blogRouter,
	brands: brandRouter,
	locations: locationRouter,
	newsletter: newsletterRouter,
	orders: orderRouter,
	"prod-categories": productCategoryRouter,
	products: productRouter,
	user: userRouter,
};
