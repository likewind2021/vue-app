<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'helloWorld',
  data() {
    return {
      msg: "Hello World! ahui",
    }
  },
};
</script>

<style scoped>
h1 {
  color: #42b893;
}
</style>
