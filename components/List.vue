<template>
  <div id="list">
    <p v-if="$fetchState.pending">Fetching Dogs...</p>
    <p v-else-if="$fetchState.error">An error occurred.</p>
    <div class="show-dogs" v-else>
      <div class="dog" v-for="(image, key) in dogs" :key="key">
        <img :src="image" :alt="image"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  computed: {
    dogs () {
      return this.$store.state.dogs.dogs
    }
  },
  watch: {
    '$store.state.filters.activeFilter' (activeFilter) {
      if (activeFilter) {
        this.filterDogsByBreed(activeFilter)
      } else {
        this.loadRandomDogs()
      }
    },
    '$store.state.filters.activeSubFilter' (activeSubFilter) {
      if (activeSubFilter) {
        this.filterDogsBySubBreed(this.$store.state.filters.activeFilter, activeSubFilter)
      } else {
        this.loadRandomDogs()
      }
    }
  },
  async fetch() {
    let env = this;
    await axios.get('https://dog.ceo/api/breeds/image/random/25')
      .then(({data}) => {
        env.setDogs(Object.values(data.message));
      });
  },
  methods: {
    setDogs (dogs) {
      this.$store.commit('dogs/set', dogs)
    },
    loadRandomDogs () {
      let env = this;
      axios.get('https://dog.ceo/api/breeds/image/random/25')
        .then(({data}) => {
          env.setDogs(Object.values(data.message));
        });
    },
    filterDogsByBreed (filter) {
      let env = this;
      axios.get('https://dog.ceo/api/breed/'+filter+'/images')
        .then(({data}) => {
          env.setDogs(Object.values(data.message));
        });
    },
    filterDogsBySubBreed (filter, subfilter) {
      let env = this;
      axios.get('https://dog.ceo/api/breed/'+filter+'/'+subfilter+'/images')
        .then(({data}) => {
          env.setDogs(Object.values(data.message));
        });
    }
  }
}
</script>

<style>
.show-dogs {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 35px;
}

.dog {
  display: flex;
  flex: 1 1 19%;
  padding: 20px;
  margin: 5px;
  max-width: 332px;
  max-height: 300px;
  background: white;
  border: 1px solid gray;
}

.dog img {
  width: 100%;
  height: 100%;
}

.dog:hover {
  background: lightgray;
  cursor: pointer;
}

@media all and (max-width: 1580px) {
  .dog {
    flex: 1 1 25%;
  }
}

@media all and (max-width: 1180px) {
  .dog {
    flex: 1 1 33%;
  }
}

@media all and (max-width: 850px) {
  .dog {
    flex: 1 1 50%;
  }
}

@media all and (max-width: 600px) {
  .dog {
    flex: 1 1 100%;
  }
}
</style>
