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
      indexes: [
        {
          unique: true, // 중복 방지
          fields: ["user_id", "video_id"], // userId와 videoId 조합을 고유하게 설정
        },
      ],
    },
  );
  return Notes;
};
