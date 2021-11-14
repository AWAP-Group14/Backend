//database login info
const {Client} = require('pg')

const client = new Client({
  host: "ec2-54-159-244-207.compute-1.amazonaws.com",
  user: "znksgzjcdollnm",
  port: 5432,
  password: "706341341ecba7ca41175111cf21552623c45a5766aaed7948bf995fe45529ec",
  database:"d9m0o3v2ojr57k",
  ssl: { rejectUnauthorized: false }

})
client.connect();

client.query('Select * from customer', (err, res)=>{
  if (!err) {
      console.log(res.rows);    
  } else {
    console.log(err.message);
  }

  
})
module.exports = client;