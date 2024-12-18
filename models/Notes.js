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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      videoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "video_id",
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
