/* eslint-disable no-undef */
const { expect } = require('chai');
const request = require('supertest');
const getDb = require('../src/services/db');
const app = require('../src/app');

describe('create album', () => {
  let db;
  let artists;

  beforeEach(async () => {
      db = await getDb();
      artist = await db.query('INSERT into Artist (name, genre) VALUES (?,?)', [
        'Tame Impala',
        'Rock',
      ]);
      [artists] = await db.query('SELECT * from Artist');
    });


  afterEach(async () => {
    await db.query('DELETE FROM Album');
    await db.query('DELETE FROM Artist');
    await db.close();
  });

  describe('/artist/:artistId/album', () => {
    describe('POST', () => {
      it('creates a new album in the database', async () => {
        const artist = artists[0];
        const res = await request(app).post(`/artist/${artist.id}/album`).send({
          name: 'Star',
          year: 2020,

        });

        expect(res.status).to.equal(201);

        const [[albumEntries]] = await db.query(
          `SELECT * FROM Album WHERE name = 'Star'`
        );

        expect(albumEntries.name).to.equal('Star');
        expect(albumEntries.year).to.equal(2020);
        expect(albumEntries.artistId).to.equal(1);
      });
    });
  });
});