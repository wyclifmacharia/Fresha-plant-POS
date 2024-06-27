<script>
import { Const } from '../../utils/constants'
import axios from 'axios'
import DataTable from 'datatables.net-vue3'
import DataTableBs5 from 'datatables.net-bs5'
import Toastify from 'toastify-js'
import Shimmer from '../widgets/Shimmer.vue'
DataTable.use(DataTableBs5)

export default {
  components: {
    Shimmer
  },
  data() {
    return {
      imageUrl: '',
      emailPreview: null,
      emailForm: {
        vendorId: '',
        templateId: '',
      },
      emailTemplates: null,
      vendors: null,
      customer: null,
      isOrderLoading: false,
      isLoading: false,
      isGettingPreview: false,
      formData: {
        paymentMethod: '',
        paymentAmount: '',
        orderId: ''
      },
      paymentMethods: null,
      orderStatuses: null,
      order: null,
      orderId: '',
      formatter: new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }),
    }
  },
  created() {
    this.orderId = this.$router.currentRoute.value.params.orderId;

    this.$watch(
      () => this.$router.currentRoute.value.params.orderId,
      () => {
        this.getOrderDetails()
        this.getPaymentMethods()
        this.getOrderStatuses()
        this.getEmailTemplates()
        this.getVendors()
      },
      { immediate: true }
    )
  },

  methods: {
    setImageUrl(imageUrl) {
      this.imageUrl = imageUrl
    },
    // email functions 
    getEmailPreview() {
      console.log('get email preview')
      if (this.emailForm.vendorId == '')
        return
      if (this.emailForm.templateId == '')
        return


      this.emailForm.orderId = this.order.orderID
      let config = {
        method: 'post',
        url: `${Const.BASE_URL}templates/email/preview`,
        data: this.emailForm,
        headers: {
          'access-token': localStorage.getItem('accessToken')
        },
      }

      this.isGettingPreview = true
      axios
        .request(config)
        .then((response) => {
          console.log(response.data)
          this.isGettingPreview = false
          if (response.data.status == 200) {
            // this.showToast(response.data.message, false);

            this.emailPreview = response.data.data
            return
          }
          this.showToast(`${response.data.message}: ${response.data.error}`, true);

        })
        .catch((error) => {
          this.isGettingPreview = false
          this.showToast(error.message, true);
          console.log(error)
        })
    },
    sendEmailToVendor() {
      if (this.emailForm.vendorId == '')
        return
      if (this.emailForm.templateId == '')
        return
      console.log("Send email")
      this.emailForm.orderId = this.order.orderID

      let config = {
        method: 'post',
        url: `${Const.BASE_URL}templates/email/send`,
        data: this.emailForm,
        headers: {
          'access-token': localStorage.getItem('accessToken')
        },
      }

      this.isLoading = true
      axios
        .request(config)
        .then((response) => {
          console.log(response.data)
          this.isLoading = false
          if (response.data.status == 200) {
            this.showToast(response.data.message, false);
            this.$refs.closeModal.click();

            this.emailForm = {
              vendor: '',
              emailTemplate: '',
            }
            this.getOrderDetails()
            return
          }
          this.showToast(`${response.data.message}: ${response.data.error}`, true);

        })
        .catch((error) => {
          this.isLoading = false
          this.showToast(error.message, true);
          console.log(error)
        })
    },

    async getEmailTemplates() {
      try {

        axios
          .get(`${Const.BASE_URL}templates/email/list`
            , {
              headers: {
                'access-token': localStorage.getItem('accessToken')
              }
            }
          )
          .then((response) => {
            var results = response.data
            if (results.status == 200) {

              this.emailTemplates = results.data ? results.data : ''

            }

          }).catch((e) => {
            console.log(e)
          })
      } catch (error) {
        console.log(error)
      }
    },
    async getVendors() {
      try {

        axios
          .get(`${Const.BASE_URL}vendors/list`,
            {
              headers: {
                'access-token': localStorage.getItem('accessToken')
              },
            }
          )
          .then((response) => {
            var results = response.data
            if (results.status == 200) {

              this.vendors = results.data ? results.data : ''

            }

          }).catch((e) => {
            console.log(e)
          })
      } catch (error) {
        console.log(error)
      }
    },
    // end of email functions 
    async getOrderDetails() {
      try {
        this.isOrderLoading = true

        axios
          .get(`${Const.BASE_URL}orders/list/${this.orderId}`,
            {
              headers: {
                'access-token': localStorage.getItem('accessToken')
              },
            }
          )
          .then((response) => {
            this.isOrderLoading = false
            var results = response.data
            if (results.status == 200) {

              this.order = results.data ? results.data : ''

              //process the request and populate the data
              // console.log([this.order.items])
            }

          })
          .catch((e) => {
            console.log(e)
            this.isOrderLoading = false
          })
      } catch (error) {
        this.isOrderLoading = false
        console.log(error)
      }
    },
    addToQuickbooks(customer) {
      this.customer = customer
      console.log(customer)
    },
    addCustomerToQuickbooks(customerId) {

      let config = {
        method: 'post',
        url: `${Const.BASE_URL}quickbooks/customer/create`,
        data: {
          customerId: customerId
        },
        headers: {
          'access-token': localStorage.getItem('accessToken')
        },
      }

      this.isLoading = true
      axios
        .request(config)
        .then((response) => {
          console.log(response.data)
          this.isLoading = false
          if (response.data.status == 200) {
            this.showToast(response.data.message, false);
            this.$refs.closeModal.click();
            this.getOrderDetails()
            return
          }
          this.showToast(`${response.data.message}: ${response.data.error}`, true);

        })
        .catch((error) => {
          this.isLoading = false
          this.showToast(error.message, true);
          console.log(error)
        })


    },
    async getOrderStatuses() {
      let config = {
        method: 'get',
        url: `${Const.BASE_URL}orders/status/list`,
        headers: {
          'access-token': localStorage.getItem('accessToken')
        },
      }

      axios
        .request(config)
        .then((response) => {
          this.orderStatuses = response.data ? response.data.data : []

        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getPaymentMethods() {
      let config = {
        method: 'get',
        url: `${Const.BASE_URL}quickbooks/payment/methods/list`,
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
    showToast(message, isDanger) {
      Toastify({
        text: message,
        // className: className,
        style: {
          background: isDanger ? "#d63939" : "#2fb344",
        }
      }).showToast();
    },
    addInvoice(orderId) {

      let config = {
        method: 'post',
        url: `${Const.BASE_URL}quickbooks/invoice/create`,
        data: {
          orderId: orderId
        },
        headers: {
          'access-token': localStorage.getItem('accessToken')
        },
      }

      this.isLoading = true
      axios
        .request(config)
        .then((response) => {
          console.log(response.data)
          this.isLoading = false
          if (response.data.status == 200) {
            this.showToast(response.data.message, false);
            this.$refs.closeModal.click();
            this.getOrderDetails()

            return
          }
          this.showToast(`${response.data.message}: ${response.data.error}`, true);

        })
        .catch((error) => {
          console.log(error)
          this.isLoading = false
          this.showToast(error.message, true);
          console.log(error)
        })


    },
    addPayment() {

      // console.log(this.order.orderID)
      this.formData.orderId = this.order.orderID

      let config = {
        method: 'post',
        url: `${Const.BASE_URL}quickbooks/payment/create`,
        data: this.formData,
        headers: {
          'access-token': localStorage.getItem('accessToken')
        },
      }

      this.isLoading = true
      axios
        .request(config)
        .then((response) => {
          console.log(response.data)
          this.isLoading = false
          if (response.data.status == 200) {
            this.showToast(response.data.message, false);
            this.$refs.closeModal.click();

            this.formData = {
              paymentMethod: '',
              paymentAmount: '',
            }
            this.getOrderDetails()
            return
          }
          this.showToast(`${response.data.message}: ${response.data.error}`, true);

        })
        .catch((error) => {
          this.isLoading = false
          this.showToast(error.message, true);
          console.log(error)
        })
    },
    updateOrderStatus(orderId, status) {

      let config = {
        method: 'post',
        url: `${Const.BASE_URL}orders/update/status`,
        data: {
          status: status.code,
          orderId: orderId
        },
        headers: {
          'access-token': localStorage.getItem('accessToken')
        },
      }

      this.isLoading = true
      axios
        .request(config)
        .then((response) => {
          console.log(response.data)
          this.isLoading = false
          if (response.data.status == 200) {
            this.showToast(response.data.message, false);
            this.getOrderDetails()
            return
          }
          this.showToast(`${response.data.message}: ${response.data.error}`, true);

        })
        .catch((error) => {
          this.isLoading = false
          this.showToast(error.message, true);
          console.log(error)
        })
    }


  },
  props: []
}
</script>

<template>

  <!-- Page header -->
  <div class="page-header d-print-none p-0 m-1">
    <div class="container-xl p-0">
      <div class="row g-2 align-items-center m-0 p-0">
        <div class="col m-0">
          <h2 class="page-title">
            Order Details
          </h2>
        </div>
        <!-- Page title actions -->
        <div class="col-auto ms-auto d-print-none">
          <button type="button" class="btn btn-outline-dark" onclick="javascript:window.print();">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24"
              stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
              <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
              <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
            </svg>
            Print
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Page body -->
  <div class="page-body mt-1">
    <div class="container-xl">
      <div class="card card-lg">

        <Shimmer v-if="isOrderLoading"></Shimmer>

        <div v-if="!isOrderLoading" class="card-body mt-0 pt-2">
          <div class="row">
            <div class="col-2">
              <!-- start of order status  -->
              <div class=" col-lg-auto ms-lg-auto  ">
                <div class=" ">
                  <ul class="navbar-nav">
                    <li class="nav-item dropdown ">
                      <a class=" btn btn-outline-default " href="#navbar-third" data-bs-toggle="dropdown"
                        title="Update Order Status" data-bs-placement="top" data-bs-auto-close="outside" role="button"
                        aria-expanded="false">
                        <span class="nav-link-title  ">
                          {{ order?.status.code }} - {{ order?.status.description }}
                        </span>
                      </a>
                      <div v-if="orderStatuses" class="dropdown-menu">

                        <a v-for="(status) in orderStatuses" v-bind:key="status.code" class="dropdown-item"
                          href="javascript:void()" @click="updateOrderStatus(order.orderID, status)">
                          {{ status.code }} - {{ status.description }}
                        </a>

                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- start of order status  -->

            </div>
            <div class="col-2">
              <button data-bs-toggle="modal" data-bs-target="#sendEmailToVendorModal" @click="sendEmailToVendor()"
                class="btn btn-outline-default  " title="Send Email To Vendor" data-bs-placement="top">Send Email To
                Vendor</button>
            </div>
            <div class="col-8">
              <div class="row text-center align-items-center flex-row-reverse mb-5">

                <div class="col-3 col-lg-auto ms-lg-auto ">
                  <button v-if="order?.paymentAmount" class="btn">{{ order?.paymentMethod }}
                    <span class="badge bg-blue ms-2">${{ order?.paymentAmount }}</span></button>

                  <!-- if customer is created and invoice created, show option to make payment -->

                  <button v-if="order?.invoiceNumber && !order?.paymentAmount" class="btn   btn-outline-success"
                    data-bs-toggle="modal" data-bs-target="#addPaymentToQuickbooksModal">Process
                    Payment In Quickbooks</button>

                  <button v-if="order?.customer?.quickbooksCustomerId && !order?.invoiceNumber" data-bs-toggle="modal"
                    data-bs-target="#addInvoiceToQuickbooksModal" class="btn btn-outline-success">
                    Create Invoice In Quickbooks</button>

                  <button v-if="!order?.customer?.quickbooksCustomerId" data-bs-toggle="modal"
                    data-bs-target="#addToQuickbooksModal" @click="addToQuickbooks(order?.customer)"
                    class="btn   btn-outline-success  ">Add Customer To Quickbooks</button>

                </div>





              </div>
            </div>
          </div>




          <div class="row">
            <div class="col-6">
              <p class="h5">Customer</p>

              <!-- check if customer is already created and invoice is null,  show button to add invoice to quick books -->



              <address>
                {{ order?.customer?.name }}
                <br>
                {{ order?.customer?.phone }}<br>
                {{ order?.customer?.city }},{{ order?.customer?.state }} <br>
                {{ order?.customer?.address }}
              </address>
            </div>
            <div class="col-6 text-end">
              <p class="h5">Shipping Address</p>

              <address>
                {{ order?.shipping?.address }}<br>
                {{ order?.shipping?.city }}, {{ order?.shipping?.country }} <br>
                {{ order?.shipping?.state }}, {{ order?.shipping?.zipCode }}<br>
                {{ order?.shipping?.shippingMethod }}
              </address>
            </div>
            <div class="col-12 my-1">
              <h3>Invoice#</h3>
            </div>
          </div>

          <table v-if="order != null" class="table table-transparent table-responsive">
            <thead>
              <tr>
                <th class="text-center"></th>
                <th>Product</th>
                <th class="text-center" style="width: 1%">Qty</th>
                <th class="text-end" style="width: 1%">Tax</th>
                <th class="text-end" style="width: 1%">Amount</th>
              </tr>
            </thead>
            <tr v-for="(item) in order.items" v-bind:key="item.itemSKU">
              <td>
                <img :src="item.imageUrl" height="60px" width="60px" data-bs-toggle="modal"
                  data-bs-target="#imagePreviewModal" @click="setImageUrl(item.imageUrl)">

              </td>

              <td>
                <p class="strong mb-0">{{ item?.itemSKU }}</p>
                <div class="text-muted pt-0">{{ item?.description }}</div>
              </td>
              <td class="text-center">
                {{ item?.quantity }}
              </td>
              <td class="text-end">{{ this.formatter.format(item?.tax) }}</td>
              <td class="text-end">{{ this.formatter.format(item?.price) }}</td>
            </tr>

            <tr>
              <td colspan="4" class="strong text-end">Subtotal</td>
              <td class="text-end">{{ this.formatter.format(parseFloat(order.orderAmount) - parseFloat(order.taxAmount)
              ) }} </td>
            </tr>

            <tr>
              <td colspan="4" class="strong text-end">Vat</td>
              <td class="text-end"> {{ this.formatter.format(parseFloat(order.taxAmount)) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="strong text-end">Shipping Cost</td>
              <td class="text-end">{{ this.formatter.format(order?.shipping?.shippingCost) }}</td>
            </tr>
            <tr>
              <td colspan="4" class="strong text-end ">Total Due</td>
              <td class="text-end">{{ this.formatter.format(order.orderAmount) }}</td>
            </tr>
          </table>
          <!-- <p class="text-muted text-center mt-5">Thank you very much for doing business with us. We look forward to
            working with
            you again!</p> -->
        </div>
      </div>
    </div>
  </div>



  <!-- add invoice modal  -->
  <div class="modal fade" id="addInvoiceToQuickbooksModal" tabindex="-1" aria-labelledby="editUser" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">

      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create invoice in Quickbooks</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div v-if="order != null" class="modal-body">
          <table class="table">
            <tr>
              <td><strong>Marketplace</strong></td>
              <td>{{ order.marketPlace }}</td>
            </tr>

            <tr>
              <td><strong>Customer</strong></td>
              <td>{{ order?.customer?.name }}</td>
            </tr>
            <tr>
              <td> <strong>Status</strong> </td>
              <td> {{ order.status.code }} - {{ order.status.description }}</td>
            </tr>
            <tr>
              <td> <strong>Invoice Amount</strong></td>
              <td>{{ this.formatter.format(order.orderAmount) }}<br>
              </td>

            </tr>
            <tr>

              <td> <strong>Tax</strong></td>
              <td>{{ this.formatter.format(order.taxAmount) }}<br>
              </td>
            </tr>
          </table>


        </div>
        <div v-if="order != null" class="modal-footer">
          <button ref="closeModal" type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
          <button @click="addInvoice(order.orderID)" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading">Posting invoice...</span>
            <span v-if="!isLoading">Add Invoice To Quickbooks</span>
          </button>
        </div>
      </div>
    </div>

  </div>


  <!-- add payment modal  -->
  <div class="modal fade" id="addPaymentToQuickbooksModal" tabindex="-1" aria-labelledby="editUser" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <form @submit.prevent="addPayment">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create invoice in Quickbooks</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div v-if="order != null" class="modal-body">
            <table class="table">
              <tr>
                <td><strong>Marketplace</strong></td>
                <td>{{ order.marketPlace }}</td>
              </tr>

              <tr>
                <td><strong>Customer</strong></td>
                <td>{{ order?.customer?.name }}</td>
              </tr>
              <tr>
                <td> <strong>Status</strong> </td>
                <td> {{ order.status.code }} - {{ order.status.description }}</td>
              </tr>
              <tr>
                <td> <strong>Invoice Amount</strong></td>
                <td>{{ this.formatter.format(order.orderAmount) }}<br>
                </td>

              </tr>
              <tr>

                <td> <strong>Tax</strong></td>
                <td>{{ this.formatter.format(order.taxAmount) }}<br>
                </td>
              </tr>
            </table>

            <div class="row">
              <div class="col-md-12 mb-3">
                <label for="name" class="form-label">Payment method</label>
                <select id="paymentMethod" v-model="formData.paymentMethod" class="form-control">
                  <option v-for="option in paymentMethods" :key="option">{{ option }}</option>
                </select>
              </div>

              <div class="col-md-12 mb-3">
                <label for="phone" class="form-label">Payment amount</label>
                <input type="number" class="form-control" id="paymentAmount" v-model="formData.paymentAmount"
                  required />
              </div>

            </div>
          </div>
          <div v-if="order != null" class="modal-footer">
            <button ref="closeModal" type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading">Posting payment...</span>
              <span v-if="!isLoading">Post Payment To Quickbooks</span>
            </button>
          </div>

        </div>
      </form>
    </div>

  </div>

  <!-- add customer modal  -->
  <div class="modal fade" id="addToQuickbooksModal" tabindex="-1" aria-labelledby="editUser" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">

      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add To Quickbooks</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div v-if="customer != null" class="modal-body">
          <table class="table">
            <tr>
              <td><strong>Name</strong></td>
              <td>{{ customer.name }}</td>
            </tr>
            <tr>
              <td><strong>Phone number</strong></td>
              <td>{{ customer.phone }}</td>
            </tr>
            <tr>
              <td> <strong>Email</strong> </td>
              <td>{{ customer.email }}</td>
            </tr>
            <tr>
              <td> <strong>Address</strong></td>
              <td>{{ customer.address }}<br>
                {{ customer.city }},{{ customer.state }}<br>
                {{ customer.zip }}
              </td>
            </tr>
          </table>



        </div>
        <div v-if="customer != null" class="modal-footer">
          <button ref="closeModal" type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
          <button @click="addCustomerToQuickbooks(customer.customerID)" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading">Adding customer...</span>
            <span v-if="!isLoading">Add To Quickbooks</span>
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- send email template  -->
  <div class="modal fade" id="sendEmailToVendorModal" tabindex="-1" aria-labelledby="editUser" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <!-- <form @submit.prevent="sendEmailToVendor"> -->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Send Email To Vendor</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div v-if="order != null" class="modal-body">

          <div class="row">
            <div class="col-md-12 mb-3">
              <label for="name" class="form-label  text-weight-700">Select Vendor</label>
              <select id="paymentMethod" v-model="emailForm.vendorId" class="form-control">
                <option v-for="option in vendors" :value="option.vendorID" :key="option">{{ option.name }}</option>
              </select>
            </div>
            <div class="col-md-12 mb-3">
              <label for="name" class="form-label text-weight-700">Email Template</label>
              <select id="paymentMethod" v-model="emailForm.templateId" @change="getEmailPreview" class="form-control">
                <option v-for="option in emailTemplates" :value="option.templateID" :key="option">{{ option.title }}
                </option>
              </select>
            </div>

            <div class="col-md-12 mb-3">
              <label for="phone" class="form-label  text-weight-700">Email Preview</label>
              <div class="card">
                <div class="card-body">
                  <div v-if="isGettingPreview" class="progress">
                    <div class="progress-bar progress-bar-indeterminate bg-green"></div>
                  </div>

                  <p v-if="!isGettingPreview && emailPreview != null" v-html="emailPreview.data"></p>
                </div>
              </div>

            </div>

          </div>
        </div>
        <div v-if="order != null" class="modal-footer">
          <button ref="closeModal" type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
          <button @click="sendEmailToVendor" class="btn btn-primary" :disabled="isLoading">
            <span v-if="isLoading">Sending Email...</span>
            <span v-if="!isLoading">Send Email</span>
          </button>
        </div>

      </div>
      <!-- </form> -->
    </div>

  </div>

  <!-- image preview modal  -->
  <div class="modal fade" id="imagePreviewModal" tabindex="-1" aria-labelledby="imagePreviewModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-body">

          <img :src="imageUrl">

        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
