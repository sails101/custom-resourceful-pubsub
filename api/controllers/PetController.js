/**
 * PetController
 *
 * @description :: Server-side logic for managing pets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


  /**
   * Find all the pets in the database and subscribe the
   * requesting user agent to events published to each of
   * them.
   */

  find: function (req, res) {

    // Find some pets
    Pet.find().exec(function (err, pets) {
      if (err) return res.negotiate(err);

      // Subscribe to the pets we found
      Pet.subscribe(req, pets);

      // Send back them pets
      return res.ok(pets);
    });
  },


  /**
   * Indicate that a particular pet has barked.
   */
  bark: function (req, res) {

    // Update the `hasBarked` status of our pet.
    Pet.update(req.param('id'), {
      hasBarked: true
    })
    .exec(function (err) {
      if (err) return res.negotiate(err);
      // looks at err.status and calls either:
      //   • res.badRequest()
      //   • res.serverError()
      //   • res.notFound()
      //   • res.forbidden()
      //
      // (see http://sailsjs.org/#/documentation/reference/res/res.negotiate.html)

      // Let everyone know that this particular pet has barked.
      Pet.publishUpdate(req.param('id'), {
        hasBarked: true
      });

      // It worked, the pet barked.
      return res.ok();
    });
  }

};

