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
    const reviewCollection = client.db("reviews").collection("review");
    const historyCollection = client.db("histories").collection("history");

    // Load all book api
    app.get("/books", async (req, res) => {
      const query = {};
      const cursor = booksCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // load single book api
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await booksCollection.findOne(query);
      res.send(result);
    });

    // Load user email spacific data
    app.get("/book", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const cursor = booksCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // Load book by text
    app.get("/bookbytext", async (req, res) => {
      const text = req.query.search;
      const query = {};
      const cursor = booksCollection.find();
      const books = await cursor.toArray();
      res.send(books);
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

    // Load reviews data api
    app.get("/reviews", async (req, res) => {
      const query = {};
      const page = parseInt(req.query.page);
      const cursor = reviewCollection.find(query);
      const reviews = await cursor
        .skip(page * 3)
        .limit(3)
        .toArray();
      res.send(reviews);
    });
    // Post review api
    app.post("/review", async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    });
    // Count Reviews
    app.get("/reviewCount", async (req, res) => {
      const count = await reviewCollection.estimatedDocumentCount();
      res.send({ count });
    });

    // Load History API
    app.get("/history", async (req, res) => {
      const query = {};
      const cursor = historyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // POST History API
    app.post("/history", async (req, res) => {
      const newHistory = req.body;
      const result = await historyCollection.insertOne(newHistory);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Books store running");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
