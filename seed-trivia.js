const fs = require('fs');
const path = require('path');

// Your Render URL
const RENDER_URL = 'https://my-strapi-project-9jpw.onrender.com';

async function seedTrivia() {
  try {
    // Read the local database
    const dbPath = path.join(__dirname, '.tmp', 'data.db');
    
    if (!fs.existsSync(dbPath)) {
      console.error('Local database not found. Make sure Strapi ran locally at least once.');
      process.exit(1);
    }

    // Use sqlite3 to read the local data
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(dbPath);

    // Get trivia questions from local DB
    db.all('SELECT * FROM trivia_questions', [], async (err, rows) => {
      if (err) {
        console.error('Error reading local database:', err);
        db.close();
        return;
      }

      console.log(`Found ${rows.length} trivia questions locally\n`);

      if (rows.length === 0) {
        console.log('No trivia questions found in local database.');
        db.close();
        return;
      }

      // Push each question to Render
      for (const row of rows) {
        try {
          const response = await fetch(`${RENDER_URL}/api/trivia-questions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: {
                questions: row.questions,
                answers: typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers,
                correctIndex: row.correct_index,
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`✓ Added: ${row.questions}`);
          } else {
            const error = await response.text();
            console.error(`✗ Failed: ${row.questions}`);
            console.error(`  Error: ${error}\n`);
          }
        } catch (error) {
          console.error(`✗ Failed: ${row.questions}`);
          console.error(`  Error: ${error.message}\n`);
        }
      }

      db.close();
      console.log('\n✅ Seeding complete!');
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

seedTrivia();
