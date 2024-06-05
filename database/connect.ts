import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL as string, {
    /**
        host: "",
        port: 5432,
        database: "",
        username: "",
        password: "",
    */
});

export default sql;
