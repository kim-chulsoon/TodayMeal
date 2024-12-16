// Notes.js
module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define(
    "Notes",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      video_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ingredients: {
        type: DataTypes.TEXT,
      },
      recipe: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "Notes",
      timestamps: true,
    },
  );
  return Notes;
};
