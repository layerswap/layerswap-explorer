import axios from "axios";

export const InitializeUnauthInstance = (baseURL?: string) => {

    const instance = axios.create({
        baseURL: baseURL || "",
        headers: {
            "Content-Type": "application/json",
        },
    });

    instance.interceptors.request.use(
        async (config) => {
            const apiKey = process.env.NEXT_PUBLIC_API_KEY

            if (apiKey) {
                config.headers["X-LS-APIKEY"] = apiKey
            } else {
                throw new Error("NEXT_PUBLIC_API_KEY is not set up in env vars")
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
}


export default InitializeUnauthInstance;