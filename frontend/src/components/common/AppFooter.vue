<script>
export default {
  components: {},
  data() {
    return {
      year: new Date().getFullYear()
    }
  },
  props: []
}
</script>

<template>
  <footer class="footer footer-transparent d-print-none">
    <div class="container-xl">
      <div class="row text-center align-items-center flex-row-reverse">
        <div class="col-12 col-lg-auto mt-3 mt-lg-0">
          <ul class="list-inline list-inline-dots mb-0">
            <li class="list-inline-item">
              Copyright &copy; {{ this.year }}
              <a href="/" class="link-secondary">Fresha Plant POS.</a>
            </li>
            <li class="list-inline-item">v1.0.0</li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
