<script>
import { Const } from '@/utils/constants';
import axios from 'axios';
import { Toast } from 'bootstrap/dist/js/bootstrap.bundle';

export default {
    props: {
        userId: {
            required: true
        }
    },
    selectedUser: null,

    data() {
        return {
            initialFormData: {
                name: '',
                phone: '',
                email: '',

            },

            formData: {
                name: '',
                phone: '',
                email: '',

            },
            loading: false,
            formSubmitted: false,
            toastElement: null
        };
    },

    watch: {
        userId: {
            immediate: true,
            handler: 'fetchUser'
        }
    },

    mounted() {
        this.toastElement = new Toast(document.getElementById('toast'));
    },


    methods: {
        showToastMessage(message) {
            const toastEl = document.getElementById('toast');
            toastEl.querySelector('.toast-body').textContent = message;
            this.toastElement.show();
        },

        hideToast() {
            this.toastElement.hide();
        },

        async fetchUser(userId) {
            try {
                const res = await axios.get(`${Const.BASE_URL}users/${userId}`)
                const user = res.data.user
                this.initialFormData.name = user?.name
                this.initialFormData.phone = user?.phone
                this.initialFormData.email = user?.email
                return
            } catch (error) {
                console.error(error)
            }
        },
        async handleSubmit() {
            try {
                this.loading = true
                const payload = {
                    userId: this.userId,
                    name: this.formData.name === '' ? this.initialFormData.name : this.formData.name,
                    email: this.formData.email === '' ? this.initialFormData.email : this.formData.email,
                    phone: this.formData.phone === '' ? this.initialFormData.phone : this.formData.phone
                }

                var config = {
                    method: 'post',
                    url: `${Const.BASE_URL}users/update`,
                    data: payload,
                    headers: {
                        'access-token': localStorage.getItem('accessToken')
                    },
                }

                await axios.request(config)

                this.showToastMessage('User updated successfully!');

                setTimeout(() => {
                    window.location.reload()
                }, 1000);

            } catch (error) {
                console.error(error)
                this.showToastMessage('Failed to update user. Please try again.');
            } finally {
                this.loading = false

            }
        },
    },


};
</script>

<template>
    <div>
        <form @submit.prevent="handleSubmit">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="row">
                        <div class="mb-3">
                            <label for="updateName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="updateName" :placeholder="initialFormData.name"
                                v-model="formData.name">
                        </div>

                        <div class="mb-3">
                            <label for="updatePhone" class="form-label">Phone</label>
                            <input type="tel" class="form-control" id="updatePhone" :placeholder="initialFormData.phone"
                                v-model="formData.phone">
                        </div>

                        <div class="mb-3">
                            <label for="updateEmail" class="form-label">Email</label>
                            <input type="email" class="form-control" id="updateEmail"
                                :placeholder="initialFormData.email" v-model="formData.email">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn me-auto" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span v-if="loading">Updating...</span>
                        <span v-if="!loading">Update</span>
                    </button>
                </div>

            </div>
        </form>

        <div class="position-absolute top-0 start-50 translate-middle-x p-3" style="z-index: 11">
            <div id="toast" class="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body"></div>
                    <button type="button" class="btn-close ms-auto me-2" aria-label="Close" @click="hideToast"></button>
                </div>
            </div>
        </div>
    </div>
</template>



<style>
.form {
    display: flex;
    flex-direction: column;

}
</style>