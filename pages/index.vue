<template>
  <div class="container">
    <h1>Dog API</h1>
    <Filters />
    <List />
  </div>
</template>

<script>
export default {}
</script>

<style>
  .container {
    width: 94%;
    margin: 0 auto;
    animation: 1s appear;
  }

  h1 {
    text-align: center;
    margin: 10px 0;
  }

  @keyframes appear {
    0% {
      opacity: 0;
    }
  }
</style>
