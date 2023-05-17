const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

console.log(process.env.DB_USER);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('db ' + connection.state);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM task_table;";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async insertNewName(task_name) {
    try {
      const task_date = new Date();
      const task_id = await new Promise((resolve, reject) => {
        const query = "INSERT INTO task_table (task_name, task_date) VALUES (?,?)";
        connection.query(query, [task_name, task_date], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });
      return {
        task_id: task_id,
        task_name: task_name,
        task_date: task_date
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteRowById(task_id) {
    try {
      if (isNaN(task_id)) {
        throw new Error('Invalid task_id');
      }
  
      task_id = parseInt(task_id, 10);
      const response = await new Promise((resolve, reject) => {
        if (!connection) {
          reject(new Error('No database connection'));
          return;
        }
        const query = 'DELETE FROM task_table WHERE task_id = ?;';
        connection.query(query, [task_id], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result ? result.affectedRows : 0);
          }
        });
      });
  
      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }  

  async updateNameById(task_id, task_name) {
    try {
      task_id = parseInt(task_id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE task_table SET task_name = ? WHERE task_id = ?;";
        connection.query(query, [task_name, task_id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async searchByName(task_name) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM task_table WHERE task_name = ?;";
        connection.query(query, [task_name], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

module.exports = DbService;
