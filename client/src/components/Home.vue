<template>
  <section>
    <div class='container'>
      <div>
        <p class="is-large message-header"> Find Nearest Outlet </p>
      </div>
      <br>
      <article class='message is-danger' v-if='inputErrorCode === 1'>
        <div class='message-header'>
          <p >{{inputErrorMessage}}</p>
        </div>
      </article>
      <div class='control has-icons-left has-icons-right'>
        <input class='input is-medium' type='text' v-model='address' placeholder='Plese enter your address' >
        <span class='icon is-left has-text-info'>
          <i class='fas fa-map-marked-alt'></i>
        </span>
      </div>
      <br>
      <button class='button is-dark' v-on:click='getOutletFromAddress'>Search Location</button>
      <br>
      <hr>
        OR
      <hr>
      <br>
      <button class='button is-primary' v-on:click='getLocation'>Get Location</button>
      <br>
      <br>
      <article class='message is-primary' v-if='searched === 1'>
        <div class='message-header'>
          <p>{{searchResponse}}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      address: '',
      inputErrorMessage: '',
      inputErrorCode: 0,
      searchResponse: '',
      searched: 0
    };
  },
  methods: {
    async getOutletFromAddress() {

      if(this.address.length === 0) {
        this.inputErrorCode = 1;
        this.searched = 0;
        this.inputErrorMessage = 'Please enter address to search';
        return;
      } 
      
      this.inputErrorCode = 0;
      this.searched = 1;

      const response = await axios.get('api/outlet/address', {
        params : {
          address: this.address
        }
      });

      if(response.status == 200) {
        this.searchResponse = response.data.location;
      } else {
        this.searchResponse = 'Not Found!!';
      }
    },
    async getOutletFromGeoLocation(latitude, longitude) {
      
      if(this.latitude || this.latitude) {
        this.inputErrorCode = 1;
        this.searched = 0;
        this.inputErrorMessage = 'Invalid location';
        return;
      } 
      
      this.inputErrorCode = 0;
      this.searched = 1;

      const response = await axios.get('api/outlet/location', {
        params : {
          lat: latitude,
          long: longitude
        }
      }).catch(() => {
        this.searchResponse = 'Not Found!!';
      })

      if(response && response.status == 200) {
        this.searchResponse = response.data.location;
      } else {
        this.searchResponse = 'Not Found!!';
      }
    },
    async getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.getOutletFromGeoLocation(position.coords.latitude, position.coords.longitude);
        });
      } else { 
        this.inputErrorMessage = 'Geolocation is not supported by this browser.';
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
/* h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>
