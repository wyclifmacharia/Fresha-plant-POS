<script>

import { Const } from '../../utils/constants'
import axios from 'axios';
export default {
    components: {
    },
    data() {
        return {
            ebayUri: `${Const.BASE_URL}ebay/auth`,
            quickbooksUri: `${Const.BASE_URL}quickbooks/auth`,
            settings: {},
            isLoading: false
        }
    },
    mounted() {
        this.getSettings()
    },
    methods: {
        async getSettings() {
            this.isLoading = true;
            let config = {
                method: 'get',
                url: `${Const.BASE_URL}settings/list`,
                headers: {
                    'access-token': localStorage.getItem('accessToken')
                },
            }

            axios
                .request(config)
                .then((response) => {

                    this.isLoading = false;
                    this.settings = response.data.data ? response.data.data : {}

                })
                .catch((error) => {
                    this.isLoading = false;
                    console.log(error)
                })
        },
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
                        Settings
                    </h2>
                </div>
                <div class="col-auto ms-auto d-print-none">

                </div>
            </div>
        </div>
    </div>

    <div class="page-body mt-1">
        <div class="container-xl">
            <div class="card">

                <div class="card-body">
                    <Shimmer v-if="isLoading"></Shimmer>

                    <div v-if="!isLoading" class="row">
                        <div class="col-md-12">

                            <h3 class="text-primary">Marketplace Authentication</h3>
                            <div class="mb-2">
                                <label class=" form-label text-weight-700 ">Quickbooks</label>
                                <p><span>Quickbooks authentication process requires a user to allow an application to
                                        access
                                        any of the APIs. Use the below option to authenticate this application to access
                                        your quickbooks. This will open a new tab where you will be required to login to
                                        your Quickbooks account.</span></p>
                                <a :href="quickbooksUri" target="_blank" class="btn btn-outline-dark"
                                    :class="{ disabled: settings.isQuickbooksAutheticated }">
                                    {{ settings.isQuickbooksAutheticated ? "Authenticated" : "Quickbooks Authentication"
                                    }}
                                </a>

                            </div>
                            <div class="mb-2">
                                <label class=" form-label text-weight-700 ">Ebay</label>
                                <p><span>Ebay authentication process requires a user to allow an application to access
                                        any
                                        of the APIs. Use the below option to authenticate this application to access
                                        your
                                        ebay orders. This will open a new tab where you will be required to login to
                                        your
                                        Ebay account.</span></p>

                                <a :href="ebayUri" target="_blank" :disabled="settings.isEbayAutheticated"
                                    class="btn btn-outline-dark" :class="{ disabled: settings.isEbayAutheticated }">
                                    {{ settings.isEbayAutheticated ? "Authenticated" : "Ebay Authentication" }}
                                </a>

                            </div>



                        </div>

                    </div>
                </div>
            </div>


        </div>
    </div>



</template>
