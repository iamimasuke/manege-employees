const express = require('express');
const mysql = require('mysql');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


// Specify the directory where your EJS templates are located
app.set('views', __dirname + '/views');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3090',
  database: 'emp',
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
});


app.get('/', (req, res) => {
  connection.query('SELECT * FROM emplist', (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    } else {
        res.status(200).render("top", {list:results})

    }
  });
});


app.get('/personal/:id', (req, res) => {
  connection.query('SELECT * FROM emplist id', (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    } else {
      const id = parseInt(req.params.id);
      const employee = results.find(e => e.id === id);
      if (!employee) {
          res.status(404).send('Employee not found');
          return;
  }
  res.render('personal', { employee });
}
});
});


app.post('/ed/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, position, serviceYears, attendanceRate, affiliation } = req.body;

  // Validate the data if necessary

  connection.query(
    'UPDATE emplist SET name = ?, position = ?, serviceYears = ?, attendanceRate = ?, affiliation = ? WHERE id = ?',
    [name, position, serviceYears, attendanceRate, affiliation, id],
    (error, results) => {
      if (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data');
      } else {
        res.redirect('/personal/' + id);
      }
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query('SELECT * FROM emplist id', (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    } else {
      const id = parseInt(req.params.id);
      const employee = results.find(e => e.id === id);
      if (!employee) {
          res.status(404).send('Employee not found');
          return;
  }
  res.render('edit', { employee });
}
});
});

/*
app.post('/save', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, position, serviceYears, attendanceRate, affiliation } = req.body;

  // Validate the data if necessary

  connection.query(
    'INSERT INTO `emplist` (`id`, `name`, `position`, `serviceYears`, `attendanceRate`, `affiliation`) VALUES (NULL, ?, ?, ?, ?, ?)',
    [name, position, serviceYears, attendanceRate, affiliation],
    (error, results) => {
      if (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data');
      } else {
        res.redirect('/');
      }
    }
  );
});
*/
app.post('/save', (req, res) => {
  const { name, position, serviceYears, attendanceRate, affiliation } = req.body;

  // Validate the data if necessary

  connection.query(
    'INSERT INTO `emplist` (`name`, `position`, `serviceYears`, `attendanceRate`, `affiliation`) VALUES (?, ?, ?, ?, ?)',
    [name, position, serviceYears, attendanceRate, affiliation],
    (error, results) => {
      if (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data');
      } else {
        res.redirect('/');
      }
    }
  );
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
