<template>
  <div id="wrapper">
    <button class="alt" @click="devButton('open')">Open browser</button>
    <button class="alt" @click="devButton('close')">Close browser</button>
  </div>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
import db from "./modules/store/dbController";
import utils from "./modules/utils";
import dev from "./modules/dev";
export default {
  name: "landing-page",
  methods: {
    devButton(command) {
      switch (command) {
        case "open":
          dev.Run();
          break;
        case "close":
          dev.Close();
          break;
        default:
          dev.Run();
          break;
      }
    }
  },
  mounted: function() {}
};
</script>

<style>

</style>
