require("dotenv").config();
const Agenda = require("agenda");
const readModbus = require("../utils/readModbus");

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_ADDRESS,
    collection: process.env.MONGODB_COLLECTION,
  },
});
(async function () {
  await agenda.start();
  let jobs = await agenda.jobs();
  console.log("ehe");
  jobs.forEach(async (job, index) => {
    console.log("eheh");
    try {
      await job.remove();
    } catch (err) {
      console.log(err);
    }
    console.log(job);
    agenda.define(job.attrs.name, readModbus);
    agenda.every(job.attrs.repeatInterval, job.attrs.name, job.attrs.data);
  });
})();
module.exports = agenda;
