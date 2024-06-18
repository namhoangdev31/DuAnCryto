import { DataTypes } from 'sequelize'
import sequelize from '../dbConnection.js'

const Comment = sequelize.define('Comment',{
    body: {
        type: DataTypes.TEXT,
    }
})

export default Comment