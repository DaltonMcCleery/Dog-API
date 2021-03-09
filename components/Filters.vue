<template>
  <div id="filters">
    <p v-if="$fetchState.pending">Fetching breeds...</p>
    <p v-else-if="$fetchState.error">An error occurred.</p>
    <div class="show-filters" v-else>
      <div class="title">
        <h2>Breeds</h2>
        <button id="reset-button" @click="reset" v-if="activeFilter">Reset</button>
      </div>

      <div id="select-filters" :class="(activeSubFilters.length > 0) ? 'has-sub' : ''">
        <div class="select">
          <select class="primary-filter" @change="filterByBread($event)">
            <option :value="null">Filter by Breed</option>
            <option v-for="(filter, key) in filters" :key="key" :value="filter">{{ capitalize(filter) }}</option>
          </select>
        </div>
        <div v-if="activeSubFilters.length > 0" class="select">
          <select class="secondary-filter" @change="filterBySubBread($event)">
            <option :value="null">Filter by Sub-Breed</option>
            <option v-for="(filter, key) in activeSubFilters" :key="key" :value="filter">{{ capitalize(filter) }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      activeSubFilters: []
    };
  },
  computed: {
    activeFilter () {
      return this.$store.state.filters.activeFilter
    },
    filters () {
      return this.$store.state.filters.filters
    },
    activeSubFilter () {
      return this.$store.state.filters.activeSubFilter
    },
    subfilters () {
      return this.$store.state.filters.subfilters
    }
  },
  async fetch() {
    let env = this;
    await axios.get('https://dog.ceo/api/breeds/list/all')
      .then(({data}) => {
        (Object.keys(data.message)).forEach(function (key) {
          env.addFilter(key)
          if ((data.message[key]).length > 0) {
            // Has sub-breed, save in separate list for API fetching
            env.addSubFilter(key)
          }
        })
      });
  },
  methods: {
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    addFilter (filter) {
      this.$store.commit('filters/add', filter)
    },
    addSubFilter (subfilter) {
      this.$store.commit('filters/addSub', subfilter)
    },
    filterByBread (event) {
      let breed = event.target.value;
      this.$store.commit('filters/toggle', breed)
      if (!this.subfilters.includes(breed)) {
        // Reset sub-filter toggle
        this.$store.commit('filters/toggleSub', null);
        this.activeSubFilters = [];
      } else {
        this.loadSubBreeds()
      }
    },
    filterBySubBread (event) {
      this.$store.commit('filters/toggleSub', event.target.value)
    },
    loadSubBreeds () {
      let env = this;
      axios.get('https://dog.ceo/api/breed/'+this.activeFilter+'/list')
        .then(({data}) => {
          if ((data.message).length > 0) {
            env.activeSubFilters = data.message;
          } else {
            env.activeSubFilters = [];
          }
        });
    },
    reset () {
      this.activeSubFilters = [];
      this.$store.commit('filters/toggle', null);
      this.$store.commit('filters/toggleSub', null);
      document.querySelector('select.primary-filter').selectedIndex = null;
    }
  }
}
</script>

<style>
#filters {
  padding: 20px;
  max-width: 1740px;
  margin: 0 auto;
}

.title {
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  justify-content: space-between;
}

#reset-button {
  color: darkslategray;
  border: none;
  text-transform: uppercase;
}

#reset-button:hover {
  cursor: pointer;
  color: indianred;
}

#select-filters {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#select-filters.has-sub .select {
  flex-basis: 49%;
}

.select {
  display: inline-flex;
  cursor: pointer;
  outline: 0;
  position: relative;
  width: 100%;
}

.select:after {
  border: 3px solid gray;
  border-radius: 2px;
  border-right: 0;
  border-top: 0;
  content: " ";
  display: block;
  height: .625em;
  margin-top: -.4375em;
  pointer-events: none;
  position: absolute;
  top: 47%;
  transform: rotate(-45deg);
  transform-origin: center;
  width: .625em;
  right: 1.125em;
  z-index: 4;
  transition: all .2s linear;
}

select {
  display: inline-flex;
  padding: 10px 35px 10px 10px;
  font-size: 1.125rem;
  letter-spacing: 0;
  min-width: 200px;
  justify-content: center;
  border: 1px solid gray;
  color: gray;
  width: 100%;
  -moz-appearance: none;
  -webkit-appearance: none;
}

@media all and (max-width: 1024px) {
  .show-filters {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  #select-filters {
    display: flex;
    flex-direction: column;
  }

  .select {
    margin-bottom: 10px;
  }
}

</style>
