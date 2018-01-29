require("dotenv").config();
const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.clarifaiAPI
});

module.exports = controller => {
  controller.hears(
    ["http*"],
    "direct_message,direct_mention",
    (bot, message) => {
      let url = message.text.substr(1).slice(0, -1);

      app.models.predict("c0c0ac362b03416da06ab3fa36fb58e3", url).then(
        function(response) {
          let output = response.outputs[0].data.regions[0].data.face;
          let age = output.age_appearance.concepts[0].name || null;
          let gender = output.gender_appearance.concepts[0].name || null;
          let multicultural =
            output.multicultural_appearance.concepts[0].name || null;
          let result =
            "You seem to be " +
            age +
            " years of age and of the " +
            gender +
            " gender. Additionally, you seem to be " +
            multicultural;
          bot.reply(message, result, message.team);
        },
        function(err) {
          console.log(err.status);
        }
      );
    }
  );
};
