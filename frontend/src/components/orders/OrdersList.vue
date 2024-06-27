<script>

import DataTable from 'datatables.net-vue3'
import { Const } from '../../utils/constants'
// import DataTablesCore from 'datatables.net'
import DataTableBs5 from 'datatables.net-bs5'
DataTable.use(DataTableBs5)
import moment from 'moment'
import axios from 'axios'
import Toastify from 'toastify-js'
import { ref } from 'vue'
import _ from 'lodash'
import Litepicker from 'litepicker';

export default {
  components: {
    DataTable
  },
  data() {
    return {
      dt: null,
      table: ref(),
      customers: [],
      selectedMarketplace: "",
      customer: "",
      marketplaces: [
        { value: "", title: "All" },
        { value: "amazon", title: "Amazon" },
        { value: "houzz", title: "Houzz" },
        { value: "walmart", title: "Walmart" },
        { value: "ebay", title: "Ebay" },

      ],
      picker: null,
      endDate: '',
      startDate: '',
      order: null,
      formatter: new Intl.NumberFormat('en-US',
        { style: 'currency', currency: 'USD' }),
      // Formats as USD currency: "$4,999.99"
      isLoading: false,
      formData: {
        paymentMethod: '',
        paymentAmount: '',
        orderId: ''
      },
      paymentMethods: null,
      options: {
        responsive: true,
        serverSide: true,
        select: true,
        bLengthChange: false,
        bInfo: false,
        destroy: true,
        paging: true,
        searching: false,
        ordering: false,
        pageLength: 20,
        "ajax": {
          url: `${Const.BASE_URL}orders/list`,
          type: "get",
          headers: {
            'access-token': localStorage.getItem('accessToken')
          }, data: (d) => {
            delete d.columns;


            if (this.selectedMarketplace && this.selectedMarketplace != "")
              d.marketplace = this.selectedMarketplace;

            if (this.customer && this.customer != "")
              d.customer = this.customer;

            // if (this.pendingPayment && this.pendingPayment != "")
            //   d.pendingPayment = this.pendingPayment;

            if (this.startDate && this.startDate != "") {
              d.startDate = this.startDate;
              d.endDate = this.endDate;
            }


            return d;
          },
          error: function () {
            console.log("Error loading data")
          },


          // dataFilter: function (response) {
          //   console.log("Server data ", response)
          //   return response;
          // },
        }
      },
      columns: [
        {
          title: 'Date',
          data: null,
          render: (data, type, row) => {
            return `${moment(row.orderDate).format('MM/DD/YYYY')}`
          }
        },
        {
          title: 'Market Place',
          data: null,
          render: (data, type, row) => {
            return `${row.marketPlace}`
          }
        },
        {
          title: 'Status',
          data: null,
          render: (data, type, row) => {
            return `${row.status.code} - ${row.status.description}`
          }
        },

        {
          data: null,
          render: '#customer',
          title: 'Customer'

        },
        // {
        //   title: 'Customer',
        //   data: null,
        //   render: (data, type, row) => {

        //     var customer = `${row.customer.name}`
        //     if (!row.customer.quickbooksCustomerId)
        //       customer = `<a href="" data-bs-toggle="modal" data-bs-target="#addPaymentToQuickbooksModal"
        //                   @click="setOrder(${row})">${row.customer.name}</a>`

        //     return `${customer}`
        //   }
        // },
        {
          title: 'Amount',
          data: null,
          className: 'text-end',
          render: (data, type, row) => {
            // return `<RouterLink to="/crm/orders/${row.orderID}">${row.orderAmount}</RouterLink>`
            return ` ${this.formatter.format(row.orderAmount)} `
          }
        },
        {
          title: 'Tax',
          data: null,
          className: 'text-end',
          render: (data, type, row) => {
            return `${this.formatter.format(row.taxAmount)}`
          }
        },
        {
          data: null,
          render: '#action',
          title: 'Status'

        },
        {
          title: 'Action',
          data: null,
          className: 'text-end',
          render: (data, type, row) => {
            // return `<RouterLink to="/crm/orders/${row.orderID}">${row.orderAmount}</RouterLink>`
            return `
            <router-link :to="{ path: /crm/orders/${row.orderID}', query: { value: ${row.orderID} }}"
             custom 
             v-slot="{ navigate, href }">
            <a href="/crm/orders/${row.orderID}"
            @click.stop="navigate" 
            >View</a>
            </router-link>`
          }
        },
      ]
    }
  },
  mounted() {

    this.dt = this.$refs.table.dt;
    // Initialize Litepicker in the mounted hook
    this.picker = new Litepicker({
      element: this.$refs.dateRange,
      format: "YYYY-MM-DD",
      singleMode: false,
      setup: (picker) => {
        picker.on('selected', (date1, date2) => {
          this.startDate = date1.format('YYYY-MM-DD');
          this.endDate = date2.format('YYYY-MM-DD');
          this.getInvoices()
        });
      },

    });

  },
  beforeUnmount() {
    this.picker.destroy();
  },

  created() {
    this.getPaymentMethods()
  },
  methods: {

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
    setOrder(order) {
      this.order = order
    },
    addInvoice(orderId) {

      let config = {
        method: 'post',
        url: `${Const.BASE_URL}quickbooks/invoice/create`,
        data: {
          orderId: orderId
        }, headers: {
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
            setTimeout(() => {
              window.location.reload()
            }, 500)

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
            setTimeout(() => {
              window.location.reload()
            }, 500)
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
            setTimeout(() => {
              window.location.reload()
            }, 500)
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
    //filter functions

    search: _.debounce((loading, search, vm) => {
      let config = {
        method: 'get',
        url: `${Const.BASE_URL}customers/list`,
        params: {
          search: {
            value: search
          }
        },
        headers: { 'access-token': localStorage.getItem('accessToken') },
      }
      axios
        .request(config)
        .then((response) => {
          if (response.data.status == 200)
            vm.customers = response.data.data
        })
        .catch((error) => {
          console.log(error)
        })
    }, 350),
    searchCustomer(search, loading) {
      this.search(loading, search, this);
    },
    onMarketplaceChanged(event) {
      this.selectedMarketplace = ""
      if (event)
        this.selectedMarketplace = event.value
      this.getInvoices()
    },
    onCustomerSelected(event) {
      this.customer = ""
      console.log(event)
      if (event)
        this.customer = event.customerID
      this.getInvoices()
    },
    async getInvoices() {
      this.dt = this.$refs.table.dt;
      this.dt.draw()
    },

    //end of filter functions

  },
  props: []
}
</script>

<template>

  <div class="page-header d-print-none p-0 m-1">
    <div class="container-xl p-0">
      <div class="row g-2 align-items-center m-0 p-0">
        <div class="col m-0">
          <h2 class="page-title">
            Marketplace Orders
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

  <div class="page-body mt-1">
    <div class="container-xl">
      <div class="row row-cards">
        <div class="col-12">
          <div class="card p-1">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <label class=" form-label text-weight-700">Date</label>
                  <input type="text" readOnly ref="dateRange" id="dateRange" name="dateRange"
                    class="form-control mb-2" />

                </div>

                <div class="col-md-3">
                  <label class=" form-label text-weight-700 ">Customer</label>

                  <v-select class="form-controls" :filterable="false" :options="customers" @search="searchCustomer"
                    label="name" @update:modelValue="onCustomerSelected">
                    <template v-slot:no-options> Search customer </template>
                    <!-- <template v-slot:option="option"></template> -->
                  </v-select>
                </div>
                <div class="col-md-3">
                  <label class=" form-label text-weight-700 ">Market place</label>
                  <v-select class="form-controls" :options="marketplaces" label="title"
                    @update:modelValue="onMarketplaceChanged"></v-select>
                </div>




              </div>

              <div class="table-responsive">
                <DataTable :columns="columns" :options="options" width="100%" ref="table"
                  class="table card-table table-vcenter   datatable">

                  <template #customer="props">
                    <div v-if="!props.rowData.customer.quickbooksCustomerId" class="button-container">
                      <a href="" data-bs-toggle="modal" data-bs-target="#addToQuickbooksModal"
                        title="Create customer in quickbooks" data-bs-placement="top"
                        @click="setOrder(props.rowData)">{{ props.rowData.customer.name }}</a>

                    </div>
                    <p class="p-0 m-0" v-if="props.rowData.customer.quickbooksCustomerId">{{
                      props.rowData.customer.name }}</p>
                  </template>


                  <template #action="props">

                    <div v-if="props.rowData.customer.quickbooksCustomerId">


                      <div v-if="props.rowData.invoiceNumber != null && props.rowData.paymentAmount == null"
                        class="button-container">
                        <a href="" data-bs-toggle="modal" data-bs-target="#addPaymentToQuickbooksModal"
                          @click="setOrder(props.rowData)">Process Payment</a>

                      </div>
                      <div v-if="props.rowData.invoiceNumber == null" class="button-container">
                        <a href="" data-bs-toggle="modal" data-bs-target="#addInvoiceToQuickbooksModal"
                          @click="setOrder(props.rowData)">Create Invoice {{ props.rowData.invoiceNumber }}</a>

                      </div>
                      <p class="p-0 m-0" v-if="props.rowData.paymentAmount != null">Payment Processed</p>
                    </div>
                  </template>


                </DataTable>

              </div>
            </div>
          </div>
        </div>
      </div>
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

        <div v-if="order != null" class="modal-body">
          <table class="table">
            <tr>
              <td><strong>Name</strong></td>
              <td>{{ order.customer.name }}</td>
            </tr>
            <tr>
              <td><strong>Phone number</strong></td>
              <td>{{ order.customer.phone }}</td>
            </tr>
            <tr>
              <td> <strong>Email</strong> </td>
              <td>{{ order.customer.email }}</td>
            </tr>
            <tr>
              <td> <strong>Address</strong></td>
              <td>{{ order.customer.address }}<br>
                {{ order.customer.city }},{{ order.customer.state }}<br>
                {{ order.customer.zip }}
              </td>
            </tr>
          </table>



        </div>
        <div v-if="order != null" class="modal-footer">
          <button ref="closeModal" type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
          <button @click="addCustomerToQuickbooks(order.customer.customerID)" class="btn btn-primary"
            :disabled="isLoading">
            <span v-if="isLoading">Adding customer...</span>
            <span v-if="!isLoading">Add To Quickbooks</span>
          </button>
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
              <td>{{ order.customer.name }}</td>
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
                <td>{{ order.customer.name }}</td>
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
              <!-- <div class="col-md-12 mb-3">
              <label for="phone" class="form-label">Payment reference</label>
              <input
                type="text"
                class="form-control"
                id="paymentRefNum"
                v-model="formData.paymentRefNum"
              />
            </div> -->
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

</template>

<style>
/* @import 'bootstrap'; */
/* @import 'datatables.net-bs5'; */
</style>
