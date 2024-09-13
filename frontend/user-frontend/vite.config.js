import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	server: {
		host: "127.0.0.1",
		port: 5173,
		proxy: {
			// Proxy all API requests starting with /api to backend
			"/api": {
				target: "http://127.0.0.1:7000", // Backend running on this port
				changeOrigin: true,
				secure: false,
			},
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules")) {
						if (id.includes("react")) {
							return "vendor-react";
						}
						if (id.includes("@chakra-ui")) {
							return "vendor-chakra";
						}
						if (id.includes("@emotion")) {
							return "vendor-emotion";
						}
						return "vendor"; // all other node_modules
					}
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
});
