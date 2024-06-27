<script>

import DataTable from 'datatables.net-vue3'
import { Const } from '../../utils/constants'
import DataTableBs5 from 'datatables.net-bs5'
import NewUserForm from './NewUserForm.vue'
import EditUserForm from './EditUserForm.vue'
import UpdatePasswordForm from './UpdatePasswordForm.vue'

DataTable.use(DataTableBs5)
export default {
    components: {
        DataTable,
        NewUserForm,
        EditUserForm,
        UpdatePasswordForm
    },

    data() {
        return {
            options: {
                responsive: true,
                serverSide: true,
                select: true,
                bLengthChange: false,
                bInfo: false,
                destroy: true,
                paging: true,
                searching: true,
                ordering: true,
                pageLength: 10,
                "ajax": {
                    url: `${Const.BASE_URL}users/list`,
                    type: "get",
                    headers: {
                        'access-token': localStorage.getItem('accessToken')
                    },
                    error: function () {
                        console.log("Error loading data")
                    },

                }
            },

            columns: [
                { title: 'Name', data: null, render: (data, type, row) => { return `${row.name}` } },
                { title: 'Phone', data: null, render: (data, type, row) => { return `${row.phone}` } },
                { title: 'Email', data: null, render: (data, type, row) => { return `${row.email}` } },
                {
                    data: null,
                    render: '#action',
                    title: 'Action'

                }
            ],
            userId: null
        }
    },

    methods: {
        resetPassword(userId) {
            this.userId = userId

        },
        editUser(userId) {
            this.userId = userId
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
                        System users
                    </h2>
                </div>
                <!-- Page title actions -->
                <div class="col-auto ms-auto d-print-none">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">Add
                        User</button>


                </div>
            </div>
        </div>
    </div>

    <!-- Navbar -->
    <div class="page-body mt-1">
        <div class="container-xl">
            <div class="row row-cards">
                <div class="col-12">
                    <div class="card p-1">
                        <div class="card-body">

                            <div class="table-responsive">
                                <DataTable :columns="columns" :options="options" width="100%"
                                    class="table card-table table-vcenter text-nowrap datatable">
                                    <template #action="props">
                                        <div class="button-container">
                                            <a href="" class="text-info" data-bs-toggle="modal"
                                                data-bs-target="#editUserModal"
                                                @click="editUser(props.rowData.userID)">Edit</a>
                                            <a href="" class="text-danger" data-bs-toggle="modal"
                                                data-bs-target="#updatePassModal"
                                                @click="resetPassword(props.rowData.userID)">Reset
                                                Password</a>
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


    <!-- Add user modal -->
    <div class="modal modal-blur fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <NewUserForm />
        </div>
    </div>

    <!-- Edit user modal -->
    <div class="modal fade" id="editUserModal" tabindex="-1" aria-labelledby="editUser" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <EditUserForm :userId="userId" />
        </div>

    </div>

    <!-- Update Password modal -->
    <div class="modal fade" id="updatePassModal" tabindex="-1" aria-labelledby="editUser" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <UpdatePasswordForm :userId="userId" />
        </div>

    </div>




</template>

<style>
.button-container {
    display: flex;
    flex-direction: row;
    gap: 1em;
}
</style>