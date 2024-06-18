import sequelize from '../dbConnection.js'; // Adjust the import path as needed
import { DataTypes } from 'sequelize';

const User = sequelize.define('User',{
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    timestamps: false
})


export default User

/* {
  "user": {
    "token": "jwt.token.here",
  }
} */