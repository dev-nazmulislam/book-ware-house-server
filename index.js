const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// used middleware
app.use(cors());
app.use(express.json());

// Database Connect with user & password
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ba72u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const booksCollection = client.db("storeBooks").collection("books");

    // Load all book api
    app.get("/books", async (req, res) => {
      const query = {};
      const cursor = booksCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // load single book api
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await booksCollection.findOne(query);
      res.send(result);
    });

    // POST Book API
    app.post("/book", async (req, res) => {
      const newBook = req.body;
      const result = await booksCollection.insertOne(newBook);
      res.send(result);
    });

    // DELETE book api
    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await booksCollection.deleteOne(query);
      res.send(result);
    });

    // update single proparty of book
    app.put("/book/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBook = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          stockQuantity: updatedBook.stockQuantity,
        },
      };
      const result = await booksCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    // update Multiple proparty of book
    app.put("/bookupdate/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBook = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: updatedBook,
      };
      const result = await booksCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Books store running");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
