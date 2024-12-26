interface Config {
	[key: string]: string | undefined
}

const config: Config = {
	apiKey: "AIzaSyDoENk3zmbPp4YMujXbZdE_9T0vrsd2Mlw",
	authDomain: "fir-auth-9ae01.firebaseapp.com",
	projectId: "fir-auth-9ae01",
	storageBucket: "fir-auth-9ae01.firebasestorage.app",
	messagingSenderId: "114908306047",
	appId: "1:114908306047:web:21fc116ca8a22844eb7d4a",
}

// console.log("config", config)

Object.keys(config).forEach((key) => {
	const configValue = config[key] + ""
	if (configValue.charAt(0) === '""') {
		config[key] = configValue.substring(1, configValue.length - 1)
	}
})

export const FIREBASE_CONFIG = config
