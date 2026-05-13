import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const useSSL =
  process.env.DB_SSL === "true" ||
  process.env.USE_DB_SSL === "true" ||
  Boolean(process.env.DB_HOST?.includes(".neon.tech"));

const dialectOptions = useSSL
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

let sequelize;

if (process.env.NEON_DATABASE_URL) {
  // Using Neon Database via connection string
  sequelize = new Sequelize(process.env.NEON_DATABASE_URL, {
    dialectOptions,
    logging: false,
  });
} else {
  // Using PostgreSQL via host/port environment variables
  sequelize = new Sequelize(
    process.env.DB_NAME || "upboskills",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
      dialectOptions,
    }
  );
}

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

export { sequelize };
