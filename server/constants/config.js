
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:4173', 'http://192.168.1.26:5173', process.env.CLIENT_URL,],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}

const USER_TOKEN = "user-token"


export { corsOptions, USER_TOKEN }