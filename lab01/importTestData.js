const csv = require('csv-parse');
const fs  = require('fs');

function writeToDatabase(records) {
  records.forEach((record, i) => {
    console.log(`ID: ${record.id} Email: ${record.email} Name: ${record.name} Phone: ${record.phone}`);
  });
  return ;
}

async function importCsv(csvFilename) {
  const parser = csv.parse({ columns: true, delimiter: ',' }, async function (err, records) {
    if (e) {
      console.error('Error parsing CSV:', e);
      return;
    }
    try {
      console.log(`Call write to Firestore`);
      await writeToDatabase(records);
      console.log(`Wrote ${records.length} records`);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }); 

  await fs.createReadStream(csvFilename).pipe(parser);
}

if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}
async function writeToFirestore(records) {
  const db = new Firestore({  
    // projectId: projectId
  });
  const batch = db.batch()

  records.forEach((record)=>{
    console.log(`Write: ${record}`)
    const docRef = db.collection("customers").doc(record.email);
    batch.set(docRef, record, { merge: true })
  })

  batch.commit()
    .then(() => {
       console.log('Batch executed')
    })
    .catch(err => {
       console.log(`Batch error: ${err}`)
    })
  return
}
importCsv(process.argv[2]).catch(e => console.error(e));
