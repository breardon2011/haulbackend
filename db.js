import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'haul.sqlite', // Set the path to your SQLite database file
    define: {
      timestamps: false, // Disable timestamps if not needed
    },
    dialectOptions: {
      foreignKeys: {
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
      },
    },
  });


