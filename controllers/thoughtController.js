const { Thought, thought } = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
},
getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-_v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought))
},
createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
},
deleteThought(req,res) {
  Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((thought) => 
      !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : Reaction.deleteMany({ _id: { $in: thought.reactions } })
        )
        .then(() => res.json({ message: 'Thought and reactions deleted!' }))
        .catch((err) => res.status(500).json(err));
},
updateThought(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $set: req.body },
    { runValidators: true, new: true }
  )
    .then((thought) => 
      !thought
        ? res.status(404).json({ message: 'No thought with this id!' })
        : res.json(thought) 
    )
    .catch((err) => res.status(500).json(err));
},
addReaction(req, res) {
  console.log('You are adding a reaction');
  console.log(req.body);
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $addToSet: { reactions: req.body } },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res
            .status(404)
            .json({ message: 'No reaction found with that ID :(' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
},

// Remove reaction from a thought
removeReaction(req, res) {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { runValidators: true, new: true }
  )
    .then((thought) =>
      !thought
        ? res
            .status(404)
            .json({ message: 'No reaction found with that ID :(' })
        : res.json(thought)
    )
    .catch((err) => res.status(500).json(err));
}
};
