import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: String,
  popularity: Number,
  image: String,
});

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
