module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      user_pw: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(20),
      },
      birthdate: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      tableName: "User", // 테이블명 지정
      timestamps: true,
    },
  );

  return User;
};
