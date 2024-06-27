<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add payment</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12 mb-3">
              <label for="name" class="form-label">Payment method</label>
              <select class="form-control">
                <option v-for="option in paymentMethods" :key="option">{{ option }}</option>
              </select>
            </div>

            <div class="col-md-12 mb-3">
              <label for="phone" class="form-label">Payment amount</label>
              <input type="number" class="form-control" id="totalAmount" v-model="formData.totalAmount" required />
            </div>
            <div class="col-md-12 mb-3">
              <label for="phone" class="form-label">Payment reference</label>
              <input type="text" class="form-control" id="paymentRefNum" v-model="formData.paymentRefNum" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading">Submitting...</span>
            <span v-if="!loading">Submit</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { Const } from '@/utils/constants'
import axios from 'axios'

export default {
  props: ['orderId'],
  created() {
    this.getPaymentMethods()
    console.log("OrderId: ", this.orderId)
  },
  data() {
    return {
      paymentMethods: [],
      formData: {
        paymentMethod: '',
        totalAmount: '',
        paymentRefNum: '',
        orderId: ''
      },
      loading: false,
      formSubmitted: false
    }
  },

  methods: {
    async getPaymentMethods() {
      let config = {
        method: 'get',
        url: `${Const.BASE_URL}quickbooks/payment/methods/list`
        ,
        headers: {
          'access-token': localStorage.getItem('accessToken')
        },
      }

      axios
        .request(config)
        .then((response) => {
          this.paymentMethods = response.data ? response.data : []
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async handleSubmit() {
      try {
        this.formData.orderId = this.orderId
        var config = {
          method: 'post',
          url: `${Const.BASE_URL}quickbooks/payment/create`,
          data: this.formData,
          headers: {
            'access-token': localStorage.getItem('accessToken')
          },
        }


        this.loading = true
        await axios.request(config)
        this.resetForm()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    resetForm() {
      this.formData = {
        paymentMethod: '',
        totalAmount: '',
        paymentRefNum: '',
        orderId: ''
      }

      this.formSubmitted = true
    }
  }
}
</script>

<style>
.form {
  display: flex;
  flex-direction: column;
}
</style>
