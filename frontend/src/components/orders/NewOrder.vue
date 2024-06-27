<script>
import { Const } from "../../utils/constants";
import moment from "moment";
import axios from "axios";
import Toastify from "toastify-js";
import { ref } from "vue";
import _ from "lodash";
import SearchAutocomplete from "../common/AutoComplete.vue";

export default {
  components: { SearchAutocomplete },
  data() {
    return {
      formData: {
        product: "",
      },
    };
  },
  created() {},
  methods: {},

  props: [],
};
</script>

<template>
  <div class="page-header d-print-none p-0 m-1">
    <div class="container-xl p-0">
      <div class="row g-2 align-items-center m-0 p-0">
        <div class="col m-0">
          <h2 class="page-title">New Sale</h2>
        </div>
        <!-- Page title actions -->
        <div class="col-auto ms-auto d-print-none">
          <button
            type="button"
            class="btn btn-outline-dark"
            onclick="javascript:window.print();"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"
              />
              <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
              <path
                d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"
              />
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
              <div class="col-md-12 mb-3">
                <SearchAutocomplete

                  :items="[
                    'Apple',
                    'Banana',
                    'Orange',
                    'Mango',
                    'Pear',
                    'Peach',
                    'Grape',
                    'Tangerine',
                    'Pineapple',
                  ]"
                /> 
              </div>

              <div class="table-responsive">
                <table class="table table-vcenter card-table table-striped">
                  <!-- <tr v-for="i in 10" :key="i">
                    <td>Item</td>
                    <td>1</td>
                    <td class="w-1">123</td>
                  </tr> -->
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- processing receipt modal  -->
  <div
    class="modal fade"
    id="addToQuickbooksModal"
    tabindex="-1"
    aria-labelledby="editUser"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add To Quickbooks</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
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
              <td><strong>Email</strong></td>
              <td>{{ order.customer.email }}</td>
            </tr>
            <tr>
              <td><strong>Address</strong></td>
              <td>
                {{ order.customer.address }}<br />
                {{ order.customer.city }},{{ order.customer.state }}<br />
                {{ order.customer.zip }}
              </td>
            </tr>
          </table>
        </div>
        <div v-if="order != null" class="modal-footer">
          <button
            ref="closeModal"
            type="button"
            class="btn me-auto"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            @click="addCustomerToQuickbooks(order.customer.customerID)"
            class="btn btn-primary"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Adding customer...</span>
            <span v-if="!isLoading">Add To Quickbooks</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <template id="autocomplete">
    <div class="autocomplete">
      <input
        type="text"
        @input="onChange"
        v-model="search"
        @keyup.down="onArrowDown"
        @keyup.up="onArrowUp"
        @keyup.enter="onEnter"
      />
      <ul
        id="autocomplete-results"
        v-show="isOpen"
        class="autocomplete-results"
      >
        <li class="loading" v-if="isLoading">Loading results...</li>
        <li
          v-else
          v-for="(result, i) in results"
          :key="i"
          @click="setResult(result)"
          class="autocomplete-result"
          :class="{ 'is-active': i === arrowCounter }"
        >
          {{ result }}
        </li>
      </ul>
    </div>
  </template>
</template>
